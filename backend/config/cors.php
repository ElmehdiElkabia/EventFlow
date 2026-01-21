<?php

return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    // Match your frontend origin; do not use wildcard when sending credentials
    'allowed_origins' => [env('FRONTEND_URL', 'http://localhost:8080')],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    // Must be true to allow cookies with cross-site requests
    'supports_credentials' => true,
];
