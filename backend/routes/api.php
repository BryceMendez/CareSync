<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

// Test route (The one that worked on your phone)
Route::get('/test', function () {
    return 'API is working';
});

// The Register Door
Route::post('/register', function (Request $request) {
    // This part actually saves to the database
    $user = User::create([
        'name' => $request->name,
        'email' => $request->email,
        'password' => Hash::make($request->password),
    ]);

    return response()->json(['message' => 'User saved!', 'user' => $user], 201);
});