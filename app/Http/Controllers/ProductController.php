<?php

namespace App\Http\Controllers;

use App\Http\Requests\CreateProductRequest;
use App\Models\User;
use Illuminate\Contracts\Routing\ResponseFactory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ProductController extends Controller
{
    public function __construct(private readonly ResponseFactory $responseFactory)
    {
        
    }
    public function store(CreateProductRequest $request)
    {
        $data = $request->validated();
        // $products = [];
        // $count = $data['count'];

        /** @var ShopModel $shop */
        $shop = $request->user();
        $productResource = [
            "title" => "Good Product",
            "body_html" => "<strong>Good snowboard!</strong>"
        ];

        $request = $shop->api()->rest(
            'POST','/admin/api/products.json',[
                'product' => $productResource
            ]
        );
        $shop->fakeProducts()->createMany($request['body']['product']);
      

        return $this->responseFactory->json($request['body']['product']);
    }

    public function destroy(Request $request, $id)
    {
        $shop = $request->user();
        $request = $shop->api()->rest(
            'DELETE','/admin/api/products/'.$id.'.json'
        );
        return $this->responseFactory->json($request['body']);
    }
}
