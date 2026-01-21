<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\Auth\AuthController;
use App\Http\Controllers\Api\Public\EventController;
use App\Http\Controllers\Api\Public\CategoryController;
use App\Http\Controllers\Api\Organizer\OrganizerEventController;
use App\Http\Controllers\Api\Organizer\AttendeeController;
use App\Http\Controllers\Api\Organizer\SalesController;
use App\Http\Controllers\Api\Organizer\AnnouncementController;
use App\Http\Controllers\Api\User\TicketController;
use App\Http\Controllers\Api\User\ReviewController;
use App\Http\Controllers\Api\User\NotificationController;
use App\Http\Controllers\Api\User\ProfileController;
use App\Http\Controllers\Api\Admin\AdminEventController;
use App\Http\Controllers\Api\Admin\AdminUserController;
use App\Http\Controllers\Api\Admin\AdminCategoryController;
use App\Http\Controllers\Api\Admin\AdminAnalyticsController;

/*
|--------------------------------------------------------------------------
| API Routes - Frontend Matched
|--------------------------------------------------------------------------
|
| These routes are designed to match the frontend exactly.
| No unused endpoints, only what the frontend needs.
|
*/

// ============================================
// PUBLIC ROUTES
// ============================================

Route::post('/auth/login', [AuthController::class, 'login']);
Route::post('/auth/register', [AuthController::class, 'register']);

// Events & Categories (public browsing)
Route::get('/events', [EventController::class, 'index']);
Route::get('/events/{id}', [EventController::class, 'show']);
Route::get('/categories', [CategoryController::class, 'index']);

// ============================================
// PROTECTED ROUTES
// ============================================

Route::middleware('auth:sanctum')->group(function () {
    
    // Auth
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me', [AuthController::class, 'me']);
    
    // ============================================
    // ORGANIZER ROUTES
    // ============================================
    
    Route::prefix('organizer')->group(function () {
        // Events management
        Route::post('/events', [OrganizerEventController::class, 'store']);
        Route::get('/events', [OrganizerEventController::class, 'index']);
        Route::patch('/events/{id}', [OrganizerEventController::class, 'update']);
        Route::delete('/events/{id}', [OrganizerEventController::class, 'destroy']);
        
        // Attendees
        Route::get('/attendees', [AttendeeController::class, 'index']);
        Route::patch('/attendees/{id}/checkin', [AttendeeController::class, 'checkIn']);
        
        // Sales
        Route::get('/sales', [SalesController::class, 'overview']);
        Route::get('/transactions', [SalesController::class, 'transactions']);
        
        // Announcements
        Route::post('/announcements', [AnnouncementController::class, 'store']);
    });
    
    // ============================================
    // USER ROUTES
    // ============================================
    
    Route::prefix('user')->group(function () {
        // Tickets
        Route::get('/tickets', [TicketController::class, 'index']);
        Route::post('/tickets/buy', [TicketController::class, 'buy']);
        
        // Reviews
        Route::post('/reviews', [ReviewController::class, 'store']);
        Route::get('/reviews', [ReviewController::class, 'index']);
        
        // Notifications
        Route::get('/notifications', [NotificationController::class, 'index']);
        
        // Profile & Settings
        Route::get('/profile', [ProfileController::class, 'show']);
        Route::patch('/profile', [ProfileController::class, 'update']);
        Route::patch('/settings', [ProfileController::class, 'updateSettings']);
    });
    
    // ============================================
    // ADMIN ROUTES
    // ============================================
    
    Route::prefix('admin')->group(function () {
        // Events
        Route::get('/events', [AdminEventController::class, 'index']);
        Route::patch('/events/{id}/approve', [AdminEventController::class, 'approve']);
        Route::patch('/events/{id}/reject', [AdminEventController::class, 'reject']);
        
        // Users
        Route::get('/users', [AdminUserController::class, 'index']);
        Route::patch('/users/{id}/role', [AdminUserController::class, 'updateRole']);
        
        // Categories
        Route::get('/categories', [AdminCategoryController::class, 'index']);
        Route::post('/categories', [AdminCategoryController::class, 'store']);
        Route::patch('/categories/{id}', [AdminCategoryController::class, 'update']);
        Route::delete('/categories/{id}', [AdminCategoryController::class, 'destroy']);
        
        // Analytics
        Route::get('/analytics', [AdminAnalyticsController::class, 'index']);
    });
});
