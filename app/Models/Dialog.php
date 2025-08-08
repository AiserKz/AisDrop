<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;


class Dialog extends Model
{

    protected $fillable = ['user_one_id', 'user_two_id', 'last_message'];

    public function messages() {
        return $this->hasMany(Message::class);
    }

    public function userOne() {
        return $this->belongsTo(User::class, 'user_one_id');
    }

    public function userTwo() {
        return $this->belongsTo(User::class, 'user_two_id');
    }

    public function companion() {
        return auth()->id() === $this->user_one_id ? $this->userTwo() : $this->userOne();
    }
}
