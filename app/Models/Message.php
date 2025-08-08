<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    protected $fillable = [
        'dialog_id',
        'sender_id',
        'body',
    ];

    public function dialog() {
        return $this->belongsTo(Dialog::class);
    }

    public function sender() {
        return $this->belongsTo(User::class, 'sender_id');
    }
}
