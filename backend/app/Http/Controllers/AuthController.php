<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Validation\ValidationException;
use Illuminate\Auth\Events\Verified;

class AuthController extends Controller
{
    private const AUTH_COOKIE_NAME = 'auth_token';

    /**
     * Register a new user
     */
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'role' => 'nullable|string|in:attendee,organizer',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
        ]);

        // Assign role (default to attendee)
        $role = $validated['role'] ?? 'attendee';
        $user->assignRole($role);

        // Trigger verification email
        event(new Registered($user));

        // Create personal access token and store in HttpOnly cookie.
        $token = $user->createToken('auth-token')->plainTextToken;

        return $this->withAuthCookie($request, response()->json([
            'success' => true,
            'message' => 'Registration successful. Please check your email to verify your account.',
            'data' => [
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->getRoleNames()->first(),
                    'email_verified_at' => $user->email_verified_at,
                ],
            ],
        ], 201), $token);
    }

    /**
     * Login user
     */
    public function login(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $validated['email'])->first();

        if (!$user || !Hash::check($validated['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        // Revoke previous tokens and issue a fresh token per login.
        $user->tokens()->delete();
        $token = $user->createToken('auth-token')->plainTextToken;

        return $this->withAuthCookie($request, response()->json([
            'success' => true,
            'message' => 'Login successful',
            'data' => [
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->getRoleNames()->first(),
                    'email_verified_at' => $user->email_verified_at,
                ],
            ],
        ]), $token);
    }

    /**
     * Get authenticated user
     */
    public function me(Request $request)
    {
        $user = $request->user();

        return response()->json([
            'success' => true,
            'data' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->getRoleNames()->first(),
                'email_verified_at' => $user->email_verified_at,
            ],
        ]);
    }

    /**
     * Logout user
     */
    public function logout(Request $request)
    {
        $plainTextToken = $request->cookie(self::AUTH_COOKIE_NAME);

        if ($plainTextToken) {
            $tokenParts = explode('|', $plainTextToken, 2);
            if (count($tokenParts) === 2 && is_numeric($tokenParts[0])) {
                $request->user()->tokens()->where('id', (int) $tokenParts[0])->delete();
            }
        } else {
            // Fallback if request was authenticated by another mechanism.
            $request->user()->currentAccessToken()?->delete();
        }

        return $this->withoutAuthCookie(response()->json([
            'success' => true,
            'message' => 'Logged out successfully',
        ]));
    }

    /**
     * Verify email
     */
    public function verifyEmail(Request $request)
    {
        $user = User::findOrFail($request->route('id'));

        if (!hash_equals((string) $request->route('hash'), sha1($user->getEmailForVerification()))) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid verification link',
            ], 403);
        }

        if ($user->hasVerifiedEmail()) {
            return response()->json([
                'success' => true,
                'message' => 'Email already verified',
            ]);
        }

        if ($user->markEmailAsVerified()) {
            event(new Verified($user));
        }

        return response()->json([
            'success' => true,
            'message' => 'Email verified successfully',
        ]);
    }

    /**
     * Resend verification email
     */
    public function resendVerification(Request $request)
    {
        $user = $request->user();

        if ($user->hasVerifiedEmail()) {
            return response()->json([
                'success' => false,
                'message' => 'Email already verified',
            ], 400);
        }

        $user->sendEmailVerificationNotification();

        return response()->json([
            'success' => true,
            'message' => 'Verification email sent',
        ]);
    }

    /**
     * Send password reset link
     */
    public function forgotPassword(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        $status = Password::sendResetLink(
            $request->only('email')
        );

        if ($status === Password::RESET_LINK_SENT) {
            return response()->json([
                'success' => true,
                'message' => 'Password reset link sent to your email',
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => __($status),
        ], 400);
    }

    /**
     * Reset password
     */
    public function resetPassword(Request $request)
    {
        $request->validate([
            'token' => 'required',
            'email' => 'required|email',
            'password' => 'required|min:8|confirmed',
        ]);

        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function (User $user, string $password) {
                $user->forceFill([
                    'password' => Hash::make($password)
                ])->save();

                $user->tokens()->delete();
            }
        );

        if ($status === Password::PASSWORD_RESET) {
            return response()->json([
                'success' => true,
                'message' => 'Password reset successfully',
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => __($status),
        ], 400);
    }

    /**
     * Update user profile
     */
    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:users,email,' . $user->id,
        ]);

        $user->update($request->only(['name', 'email']));

        return response()->json([
            'success' => true,
            'message' => 'Profile updated successfully',
            'data' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->getRoleNames()->first(),
                'email_verified_at' => $user->email_verified_at,
            ],
        ]);
    }

    /**
     * Update user password
     */
    public function updatePassword(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'current_password' => 'required|string',
            'new_password' => 'required|string|min:8|confirmed',
        ]);

        // Verify current password
        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Current password is incorrect',
            ], 422);
        }

        // Update password
        $user->update([
            'password' => Hash::make($request->new_password),
        ]);

        // Optionally revoke all tokens to force re-login
        // $user->tokens()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Password updated successfully',
        ]);
    }

    private function withAuthCookie(Request $request, JsonResponse $response, string $token): JsonResponse
    {
        $apiHost = parse_url((string) config('app.url'), PHP_URL_HOST) ?: $request->getHost();
        $originHost = parse_url((string) $request->headers->get('origin'), PHP_URL_HOST);
        $isCrossSite = is_string($originHost) && !empty($originHost) && !empty($apiHost) && strcasecmp($originHost, $apiHost) !== 0;

        $sameSite = env('AUTH_COOKIE_SAME_SITE');
        if (!is_string($sameSite) || $sameSite === '') {
            $sameSite = $isCrossSite || app()->environment('production') ? 'none' : 'lax';
        }

        $secure = $this->isAuthCookieSecure();
        if ($isCrossSite && strtolower($sameSite) === 'none') {
            $secure = true;
        }

        return $response->cookie(
            self::AUTH_COOKIE_NAME,
            $token,
            (int) env('AUTH_COOKIE_TTL', 120),
            '/',
            env('AUTH_COOKIE_DOMAIN'),
            $secure,
            true,
            false,
            $sameSite
        );
    }

    private function withoutAuthCookie(JsonResponse $response): JsonResponse
    {
        return $response->withoutCookie(
            self::AUTH_COOKIE_NAME,
            '/',
            env('AUTH_COOKIE_DOMAIN')
        );
    }

    private function isAuthCookieSecure(): bool
    {
        return filter_var(
            env('AUTH_COOKIE_SECURE', app()->environment('production')),
            FILTER_VALIDATE_BOOL
        );
    }
}
