<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Favorite;
use App\Models\Ad;

class FavoriteController extends Controller
{

    public function index()
    {
        $user = Auth::user();

        if (!$user) {
            // Возвращаем пустой массив с 200, чтобы не вызывать 401
            return response()->json([]);
        }

        $favorites = $user->favoritesAds()->with('category', 'city', 'images')->get();
        return response()->json($favorites);
    }
    

    public function toggle(Request $request, $adId) {
        $user = auth()->user();
        $ad = Ad::findOrFail($adId);

        if($user->favorites()->where('ad_id', $ad->id)->exists()) {
            $user->favorites()->detach($ad->id);
            return response()->json(['favorited' => false]);
        } else {
            $user->favorites()->attach($ad->id);
            return response()->json(['favorited' => true]);
        }
    }

    public function addToFavorites($adId) {
        $user = Auth::user();

            if (!$user) {
                return response()->json(['message' => 'Вы не авторизованы'], 401);
            }

            try {
                $exists = Favorite::where('user_id', $user->id)->where('ad_id', $adId)->exists();

                if (!$exists) {
                    Favorite::create([
                        'user_id' => $user->id,
                        'ad_id' => $adId
                    ]);
                }

                return response()->json(['message' => 'Добавлено в избранное']);
            } catch (\Throwable $e) {
                return response()->json([
                    'message' => 'Ошибка на сервере',
                    'error' => $e->getMessage()
                ], 500);
            }
    }

    public function removeFromFavorites($adId)
    {
        $user = Auth::user();

        Favorite::where('user_id', $user->id)
            ->where('ad_id', $adId)
            ->delete();

        return response()->json([
            'message' => 'Объявление удалено из избранного',
            'status' => 'success'
        ]);
    }

}
