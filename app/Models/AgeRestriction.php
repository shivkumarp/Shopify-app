<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AgeRestriction extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'age',
        'widget_name',
        'page_view_type',
        'minimum_age',
        'validation_type',
        'validation_message',
        'validation_redirect_url',
        'remember_verification_days',
        'popup_enabled'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
