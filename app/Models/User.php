<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'phone',
        'password',
        'email',
        'avatar',
        'rating',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function favorites() {
        return $this->hasMany(Favorite::class);
    }

    public function favoritesAds() {
        return $this->belongsToMany(Ad::class, 'favorites')->withTimestamps();
    }

    public function reports() {
        return $this->hasMany(Report::class);
    }

    public function reviewsReceived() {
        return $this->hasMany(Review::class, 'to_user_id');
    }

    public function reviewsGiven() {
        return $this->hasMany(Review::class, 'from_user_id');
    }

    public function updateAverageRating() {
        $average = $this->reviewsReceived()->avg('rating') ?? 0;
        $this->rating = round($average, 2);
        $this->save();
    }
}
