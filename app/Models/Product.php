<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;

class Product extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'product_id', 'title', 'price', 'description', 'product_url', 'active'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
