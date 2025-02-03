<?php

use App\Http\Controllers\ShopifyUninstallController;
use App\Http\Controllers\ThemeChangeController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('/settings/{userId}', [ThemeChangeController::class, 'getSettings'])->name('theme-settings');
Route::post('/app/uninstalled',[ShopifyUninstallController::class ,'appUninstall'])->name('app-uninstall');
// Route::post('/shop/redact',[ShopifyUninstallController::class ,'appRedact'])->name('app-redact');
// Route::post('/customers/data_request',[ShopifyUninstallController::class ,'appRedact'])->name('customers-request');
// Route::post('/customers/redact',[ShopifyUninstallController::class ,'appRedact'])->name('customers-redact');
// Route::post('/genrate-hmac',[ShopifyUninstallController::class ,'generateHmac'])->name('generate-hmac');
