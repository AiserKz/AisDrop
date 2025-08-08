<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Report;

class ReportController extends Controller
{
    public function store(Request $request) {
        $request->validate([
            'ad_id' => 'required|exists:ads,id',
            'reason' => 'required|string|min:10',
        ]);
        // dd($request->all());

        if (Report::where('user_id', auth()->id())->where('ad_id', $request->ad_id)->exists()) {
            return back()->withErrors([
                'reason' => 'Вы уже отправляли жалобу на это объявление',
            ]);
        }

        Report::create([
            'user_id' => auth()->id(),
            'ad_id' => $request->ad_id,
            'reason' => $request->reason
        ]);

        return redirect()->back()->with('success', 'Ваша жалоба отправлена!');
    }
}
