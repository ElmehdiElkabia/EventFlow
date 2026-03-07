<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class BillingAddress extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'street_address',
        'city',
        'state',
        'zip_code',
        'country',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
