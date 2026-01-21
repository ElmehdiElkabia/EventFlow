<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;

class Event extends Model
{
    use HasFactory, SoftDeletes;

    protected $guarded = [];

    protected $casts = [
        'start_date' => 'datetime',
        'end_date' => 'datetime',
        'featured' => 'boolean',
        'average_rating' => 'float',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function organizers()
    {
        return $this->belongsToMany(User::class, 'event_organizers', 'event_id', 'user_id')
                    ->withPivot('role')
                    ->withTimestamps();
    }

    public function ticketTypes()
    {
        return $this->hasMany(TicketType::class);
    }

    public function tickets()
    {
        return $this->hasMany(Ticket::class);
    }

    public function attendees()
    {
        return $this->hasMany(Attendee::class);
    }

    public function attendingUsers()
    {
        return $this->belongsToMany(User::class, 'attendees', 'event_id', 'user_id')
                    ->withPivot('status', 'checked_in_at')
                    ->withTimestamps();
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    public function transactions()
    {
        return $this->hasMany(Transaction::class);
    }

    public function refunds()
    {
        return $this->hasMany(Refund::class);
    }

    public function announcements()
    {
        return $this->hasMany(Announcement::class);
    }
}
