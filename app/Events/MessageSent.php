<?php

namespace App\Events;

use App\Models\Message;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Broadcasting\Channel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Queue\SerializesModels;

class MessageSent implements ShouldBroadcast
{
    use SerializesModels;

    public $message;
    public $recipetId;

    public function __construct(Message $message, $recipetId) 
    {
        logger('📨 Событие создаётся', ['message' => $message->body, 'to_user_id' => $recipetId]);
        $this->message = $message;
        $this->recipetId = $recipetId;

    }

    public function broadcastOn(): Channel
    {
        \Log::info('📡 Отправка в канал: chat.' . $this->recipetId);
        return new PrivateChannel('chat.' . $this->recipetId);
    }

    public function broadcastAs()
    {
        return 'MessageSent';
    }
}
