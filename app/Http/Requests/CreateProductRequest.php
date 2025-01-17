<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateProductRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'productsCount' => ['required','integer', 'min:5', 'max:100']
        ];
    }
}
