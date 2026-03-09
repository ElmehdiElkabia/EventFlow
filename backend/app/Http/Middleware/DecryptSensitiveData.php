<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class DecryptSensitiveData
{
    private const ENCRYPTION_PREFIX = 'ENC:';
    
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if ($request->isMethod('POST') || $request->isMethod('PATCH') || $request->isMethod('PUT')) {
            $data = $request->all();
            $decrypted = $this->decryptData($data);
            $request->merge($decrypted);
        }

        return $next($request);
    }

    /**
     * Recursively decrypt data
     *
     * @param mixed $data
     * @return mixed
     */
    private function decryptData($data)
    {
        if (is_array($data)) {
            $result = [];
            foreach ($data as $key => $value) {
                $result[$key] = $this->decryptData($value);
            }
            return $result;
        }

        if (is_string($data) && str_starts_with($data, self::ENCRYPTION_PREFIX)) {
            return $this->decrypt($data);
        }

        return $data;
    }

    /**
     * Decrypt a single encrypted string
     *
     * @param string $encrypted
     * @return string
     */
    private function decrypt(string $encrypted): string
    {
        try {
            // Remove the ENC: prefix
            $encrypted = substr($encrypted, strlen(self::ENCRYPTION_PREFIX));
            
            // Decode from base64
            $combined = base64_decode($encrypted);
            
            if ($combined === false) {
                \Log::warning('Failed to decode base64 encrypted data');
                return '';
            }

            // Extract IV (first 12 bytes), ciphertext, and auth tag (last 16 bytes)
            $iv = substr($combined, 0, 12);
            $ciphertextWithTag = substr($combined, 12);
            
            // AES-GCM tag is the last 16 bytes
            $tag = substr($ciphertextWithTag, -16);
            $ciphertext = substr($ciphertextWithTag, 0, -16);

            // Get encryption key
            $key = $this->getEncryptionKey();

            // Decrypt using AES-256-GCM with authentication tag
            $plaintext = openssl_decrypt(
                $ciphertext,
                'aes-256-gcm',
                $key,
                OPENSSL_RAW_DATA,
                $iv,
                $tag
            );

            if ($plaintext === false) {
                \Log::warning('Failed to decrypt data: ' . openssl_error_string());
                return '';
            }

            return $plaintext;
        } catch (\Exception $e) {
            \Log::error('Decryption error: ' . $e->getMessage());
            return '';
        }
    }

    /**
     * Generate encryption key from environment configuration
     *
     * @return string
     */
    private function getEncryptionKey(): string
    {
        $baseKey = config('app.encryption_key', 'EventFlow2026SecureEncryptionKeyDefault');
        $salt = 'EventFlowSalt2026';
        
        // Use PBKDF2 to derive a 256-bit key
        return hash_pbkdf2('sha256', $baseKey, $salt, 100000, 32, true);
    }
}
