<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\User;
use App\Models\Ad;

use App\Events\MessageSent;
use App\Events\TestMessageSent; // Assuming this is the event you want to broadcast

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $user = Auth::user();
    
        $data = request()->validate([
            'name' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:20',
            // 'email' => 'nullable|string|email|max:255|unique:users,email,' . $user->id,
            // 'avatar' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);
        // dd($data);
        if (request()->hasFile('avatar') && request()->file('avatar')->isValid()) {
            $avatar = request()->file('avatar');
            $path = $avatar->store('avatars', 'public');
            $data['avatar'] = Storage::url($path);
        }
        $user->update($data);
        
        return back()->with('success', 'Профиль обновлен!');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }

    public function show($section = 'my_ads') {

        // broadcast(new TestMessageSent('📢 Привет от сервера!'));
        $user = Auth::user()->load('reviewsReceived.fromUser');
        $user_ads = Ad::where('user_id', $user->id)
            ->with(['images', 'category', 'city'])
            ->orderByDesc('created_at')
            ->get();
        return Inertia::render('Profile', [
            'section' => $section,
            'ads' => $user_ads,
        ]);
    }

    public function showUser($id, Request $request) {
        $user = User::with('reviewsReceived.fromUser')->findOrFail($id);
        $user_ads = Ad::where('user_id', $user->id)
            ->where('status', 1)
            ->with(['images', 'category', 'city'])
            ->orderByDesc('created_at')
            ->get();
        
        $fromItemId = $request->query('from_item');
        return Inertia::render('UserProfile', [
            'user' => $user,
            'ads' => $user_ads,
            'fromItemId' => $fromItemId
        ]);
    }
}
