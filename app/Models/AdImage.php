<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AdImage extends Model
{
    protected $fillable = [
        'ad_id',
        'url',
    ];

    public function ad()
    {
        return $this->belongsTo(Ad::class);
    }
}
