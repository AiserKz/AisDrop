<?php

use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

Broadcast::channel('chat.{id}', function ($user, $id) {
    \Log::info('🔐 Пользователь подключился к чату', ['user_id' => $user->id, 'roomId' => $id]);
    return (int) $user->id === (int) $id;
});


// routes/channels.php
Broadcast::channel('public-chat', function () {
    return true;
});
