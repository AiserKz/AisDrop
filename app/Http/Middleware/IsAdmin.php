<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class IsAdmin
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = auth()->user();
        // 0 - User, 1 - Moderator, 2 - Admin 3 - Super Admin
        if ($user && intval($user->role) >= 2) {
            return $next($request);
        } else {

            return redirect()->route('home');
        }

    }
}
