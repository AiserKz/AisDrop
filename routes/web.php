<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\FavoriteController;
use App\Http\Controllers\AdController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\MessageController;

use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Support\Facades\Broadcast;

use App\Http\Middleware\IsAdmin;

use App\Events\TestMessageSent;
use App\Events\MessageSent;

// Route::get('/send-test', function () {
//     // broadcast(new TestMessageSent('📢 Привет от сервера!'));
//     broadcast(new MessageSent("Привет от сервера!"));
//     return 'Событие отправлено!';
// });


Route::get('/', [AdController::class, 'index'])->name('home');
Route::get('/item/{id}', [AdController::class, 'show'])->name('item');
Route::get('/about', function () {
    return Inertia::render('About');
})->name('about');



Route::prefix('profile')
    ->middleware(['auth', 'verified'])
    ->name('profile.')
    ->group(function () {
        Route::get('/{section?}', [ProfileController::class, 'show'])->name('index');
        Route::post('/update', [ProfileController::class, 'update'])->name('update');
});


Route::middleware('auth')->group(function () {
    Route::get('/sell', [AdController::class, 'create'])->name('sell');
    
});

Route::prefix('admin-panel')
    ->middleware(['auth', IsAdmin::class])
    ->name('admin.')
    ->group(function () {
        Route::get('/', [AdminController::class, 'index'])->name('panel');
        Route::post('/user/update/role', [AdminController::class, 'updateRole'])->name('user.update.role');
        Route::post('/user/update/banned', [AdminController::class, 'bannedUser'])->name('user.update.banned');
        Route::post('/ads/update/status', [AdminController::class, 'adsStatusSet'])->name('ads.update.status');
        Route::post('/ads/report', [AdminController::class, 'adsReport'])->name('report.update.status');
    });

Route::get('/favorites', [FavoriteController::class, 'index'])->name('favorites.index');
Route::prefix('favorites')
    ->middleware('auth') 
    ->name('favorites.')
    ->group(function () {
        Route::post('/{adId}', [FavoriteController::class, 'addToFavorites'])->name('add');
        Route::delete('/{adId}', [FavoriteController::class, 'removeFromFavorites'])->name('remove');
    });
    
Route::get('/user/{id}', [ProfileController::class, 'showUser'])->name('user.show');
Route::get('/api/ads', [AdController::class, 'indexApi'])->name('ads.index.api');
Route::get('/api/unread-dialogs', [MessageController::class, 'unreadSummary'])->name('messages.unread.summary');
Route::get('/category', [AdController::class, 'category'])->name('categories');
Route::post('/reviews', [ReviewController::class, 'store'])->name('reviews.store');
Route::post('/reports', [ReportController::class, 'store'])->name('reports.store');
Route::post('/items', [AdController::class, 'store'])->name('items.store');

Route::prefix('messages')
    ->middleware('auth')
    ->name('messages.')
    ->group(function () {
        Route::get('/', [MessageController::class, 'index'])->name('main');
        Route::post('/set', [MessageController::class, 'sender'])->name('set');
        Route::get('/{id}/messages', [MessageController::class, 'load'])->name('load');
    });


require __DIR__.'/auth.php';
