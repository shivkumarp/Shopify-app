<?php

use App\Http\Controllers\DesignSettingController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\PremiumController;
use App\Http\Controllers\ThemeChangeController;
use App\Http\Middleware\Billabe;
use App\Http\Middleware\CheckAccessScopes;
use App\Models\DesignSetting;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::middleware(['verify.shopify', CheckAccessScopes::class, Billabe::class])->group(function () {
    Route::view('/', 'app')->name('home');
    // Route::post('/products', [ProductController::class, 'store']);
    // Route::get('/premium', [PremiumController::class, 'index']);
    // Route::post('/premium', [PremiumController::class, 'store']);
    // Route::delete('/premium', [PremiumController::class, 'destroy']);
    // Route::get('/getThemeId', [ThemeChangeController::class, 'getThemeID']);
    // Route::put('/change-theme-header-file', [ThemeChangeController::class, 'changeThemeheaderFile']);
    // Route::get('/get-main-theme', [ThemeChangeController::class, 'getMainTheme']);
    // Route::put('get-theme-pages', [ThemeChangeController::class, 'updateProduct']);

    //Design Save Preview user
    Route::post('/save-pop-design-data', [DesignSettingController::class, 'savePopupDesignData'])->name('save-popup-design-data');
    Route::get('/get-products', [ProductController::class, 'showProducts'])->name('get-products');
    Route::post('/save-products-app', [ProductController::class, 'saveProductsApp'])->name('save-products-app');
    Route::post('/delete-products-app', [ProductController::class, 'deleteProductApp'])->name('delete-products-app');
    Route::post('/age-restriction/settings', [DesignSettingController::class, 'ageRestrictionSetting'])->name('age-restriction-settings');
    Route::get('/age-restriction',[DesignSettingController::class,'getRestrictionsSetting'])->name('get-age-restrictions');
    Route::post('/upload-script-tag-shopify', [ThemeChangeController::class, 'uploadScriptTagShopify'])->name('upload-script-tag-shopify');
    Route::get('/get-pop-design-data', [DesignSettingController::class, 'getPopupDesignData'])->name('get-pop-design-data');
});


Route::view('/admin', 'layouts.admin')->name('admin');
