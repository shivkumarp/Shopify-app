<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DesignSetting extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'title',
        'title_font_size',
        'template_id',
        'description',
        'template_round',
        'accept_button_text',
        'accept_button_round',
        'accept_button_text_color',
        'accept_button_bg_color',
        'reject_button_text',
        'reject_button_round',
        'reject_button_text_color',
        'reject_button_bg_color',
        'background_color',
        'text_color',
        'font_family',
        'font_size',
        'position'
    ];

    protected $casts = [
        'accept_button_text_color' => 'array',
        'accept_button_bg_color' => 'array',
        'reject_button_text_color' => 'array',
        'reject_button_bg_color' => 'array',
        'background_color' => 'array',
        'text_color' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
