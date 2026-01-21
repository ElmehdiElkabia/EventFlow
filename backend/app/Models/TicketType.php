<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class TicketType extends Model
{
    use HasFactory;

    protected $guarded = [];

    protected $casts = [
        'sale_start_date' => 'datetime',
        'sale_end_date' => 'datetime',
        'price' => 'float',
    ];

    public function event()
    {
        return $this->belongsTo(Event::class);
    }

    public function tickets()
    {
        return $this->hasMany(Ticket::class);
    }

    public function getAvailableQuantityAttribute()
    {
        return $this->quantity - $this->sold;
    }

    public function isAvailable()
    {
        return $this->getAvailableQuantityAttribute() > 0;
    }
}
