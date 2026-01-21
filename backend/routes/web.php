<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

// API routes are now loaded from routes/api.php via bootstrap/app.php
