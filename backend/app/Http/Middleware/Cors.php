<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class Cors
{
    private function normalizeOrigin(string $origin): string
    {
        return rtrim(strtolower(trim($origin)), '/');
    }

    private function resolveAllowedOrigin(Request $request): ?string
    {
        $origin = $request->headers->get('Origin');
        if (!$origin) {
            return null;
        }

        $normalizedOrigin = $this->normalizeOrigin($origin);

        $allowedOrigins = array_filter(array_map($this->normalizeOrigin(...), explode(',', (string) env(
            'CORS_ALLOWED_ORIGINS',
            'http://localhost:5173,http://127.0.0.1:5173,http://localhost:3000,http://127.0.0.1:3000'
        ))));

        return in_array($normalizedOrigin, $allowedOrigins, true) ? $origin : null;
    }

    private function applyCorsHeaders($response, ?string $allowedOrigin)
    {
        if ($allowedOrigin) {
            $response->headers->set('Access-Control-Allow-Origin', $allowedOrigin);
            $response->headers->set('Access-Control-Allow-Credentials', 'true');
            $response->headers->set('Vary', 'Origin');
        }

        $response->headers->set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
        $response->headers->set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin');
        $response->headers->set('Access-Control-Expose-Headers', 'Authorization');

        return $response;
    }

    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next)
    {
        $allowedOrigin = $this->resolveAllowedOrigin($request);

        // Handle preflight requests
        if ($request->isMethod('OPTIONS')) {
            $response = response('', 200)
                ->header('Access-Control-Max-Age', '86400');

            return $this->applyCorsHeaders($response, $allowedOrigin);
        }

        $response = $next($request);

        return $this->applyCorsHeaders($response, $allowedOrigin);
    }
}
