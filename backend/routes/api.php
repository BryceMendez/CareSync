<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;

// Public login route
Route::post('/login', [AuthController::class, 'login']);

// Protected route (requires token)
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});