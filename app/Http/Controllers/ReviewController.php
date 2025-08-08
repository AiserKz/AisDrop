<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Review;


class ReviewController extends Controller
{
    public function store(Request $request)
    {      
        $request->validate([
            'to_user_id' => 'required|exists:users,id',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string',
        ]);

        if (auth()->id() == $request->to_user_id) {
            return back()->with('error', 'Вы не можете оставить отзыв самому себе!');
        }

        if (
            Review::where('from_user_id', auth()->id())
                ->where('to_user_id', $request->to_user_id)
                ->exists()
        ) {
            return back()->with('error', 'Вы уже оставили отзыв этому пользователю!');
        }

        
        Review::create([
            'from_user_id' => auth()->id(),
            'to_user_id' => $request->to_user_id,
            'rating' => $request->rating,
            'comment' => $request->comment
        ]);
     
 
        return back()->with('success', 'Ваш отзыв отправлен!');
    }
}
