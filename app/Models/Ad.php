<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Ad extends Model
{
    protected $fillable = [
        'title',
        'description',
        'price',
        'category_id',
        'city_id',
        'user_id',
        'cor_x',
        'cor_y',
        'views',
    ];

    public function images() {
        return $this->hasMany(AdImage::class);
    }

    public function favoritedBy() {
        return $this->belongsToMany(User::class, 'favorites')->withTimestamps();
    }

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function category() {
        return $this->belongsTo(Category::class);
    }
    public function city() {
        return $this->belongsTo(City::class);
    }

    public function reports() {
        return $this->hasMany(Report::class);
    }

    public function scopeWithValidUsers($query)
    {
        return $query->whereHas('user', function ($q) {
            $q->where('is_banned', '!=', 1);
        });
    }

    public function scopeWithValidAds($query)
    {
        return $query->where('status', 1);
    }

}
