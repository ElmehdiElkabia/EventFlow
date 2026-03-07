<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class PaymentMethod extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'type',
        'last_four',
        'cardholder_name',
        'expiry_month',
        'expiry_year',
        'brand',
        'is_default',
        'stripe_payment_method_id',
    ];

    protected $casts = [
        'is_default' => 'boolean',
    ];

    protected $hidden = [
        'stripe_payment_method_id',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Scope to get default payment method
     */
    public function scopeDefault($query)
    {
        return $query->where('is_default', true);
    }
}
