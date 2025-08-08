<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

use App\Models\User;
use App\Models\Ad;
use App\Models\Report;

class AdminController extends Controller
{
    public function index() {
        $ads = Ad::with('user')->with('category', 'city')->get();
        $users = User::all();
        $reports = Report::with('user', 'ad')->latest()->get();
        return Inertia::render('Admin/Dashboard', [
            'ads' => $ads,
            'users' => $users,
            'reports' => $reports
        ]);
    }

    public function updateRole(Request $request) {
        $user = User::find($request->user_id);
        $user->role = $request->role;
        $user->save();
        return back()->with('success', 'Роль пользователя обновлена!');
    }

    public function bannedUser(Request $request) {
        // dd($request->all());
        $user = User::find($request->user_id);
        $user->is_banned = $request->is_banned;
        $user->ban_reason = $request->ban_reason;
        $user->save();
        return back()->with('success', 'Пользователь заблокирован!');
    }

    public function adsStatusSet(Request $request) {
        // dd($request->all());
        $ad = Ad::find($request->ad_id);
        $ad->status = $request->status;
        $ad->save();
    }

    public function adsReport(Request $request) {
        $ad = Ad::find($request->item_id);
        $report = Report::find($request->report_id);
        $status = $request->status;
        if ($status == 1) {
            $report->status = 1;
            $report->save();
            $ad->status = 3;
            $ad->ban_reason = $request->reason;
            $ad->save();
        } else if ($status == 2) {
            $report->status = 2;
            $report->save();
        }
    }
}
