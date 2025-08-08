<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Queue\SerializesModels;

class TestMessageSent implements ShouldBroadcast
{
    use SerializesModels;

    public $message;

    public function __construct($message)
    {
        logger('🧨 Тестовое сообщение сработало', ['message' => $message]);
        $this->message = $message;
    }

    public function broadcastOn()
    {
        return new Channel('public-chat');
    }

    public function broadcastAs()
    {
        return 'TestMessageSent';
    }
}

