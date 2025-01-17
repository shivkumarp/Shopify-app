<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Osiset\ShopifyApp\Contracts\ShopModel as IShopModel;
use Osiset\ShopifyApp\Traits\ShopModel;
use App\Models\FakeProduct;
use App\Models\Tag;
use App\Models\ScriptTag;
use App\Models\AgeRestriction;

class User extends Authenticatable implements IShopModel
{
    use Notifiable;
    use ShopModel;

    protected $fillable = [
        'name',
        'email',
        'password',
        'store_name',
        'store_url',
        'store_id'
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    public function fakeProducts()
    {
        return $this->hasMany(FakeProduct::class);
    }

    public function tags()
    {
        return $this->hasMany(Tag::class);
    }

    public function scriptTags()
    {
        return $this->hasMany(ScriptTag::class);
    }

    public function ageRestrictions()
    {
        return $this->hasOne(AgeRestriction::class);
    }
}
