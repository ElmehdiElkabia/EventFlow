<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class AttachSanctumTokenFromCookie
{
    /**
     * Copy auth token from HttpOnly cookie into Authorization header for Sanctum.
     */
    public function handle(Request $request, Closure $next)
    {
        if (!$request->bearerToken()) {
            $token = $request->cookie('auth_token');

            if (is_string($token) && str_contains($token, '%7C')) {
                $token = urldecode($token);
            }

            if (is_string($token) && str_contains($token, '|')) {
                $request->headers->set('Authorization', 'Bearer ' . $token);
            }
        }

        return $next($request);
    }
}
