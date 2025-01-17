<?php

namespace App\Http\Controllers;

use App\Http\Requests\CreateProductRequest;
use App\Models\Product;
use App\Models\User;
use Illuminate\Contracts\Routing\ResponseFactory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ProductController extends Controller
{
    public function __construct(private readonly ResponseFactory $responseFactory) {}
    
    public function store(CreateProductRequest $request)
    {
        $data = $request->validated();
        // $products = [];
        // $count = $data['count'];

        for ($i = 0; $i < $data['productsCount']; $i++) {
            /** @var ShopModel $shop */
            $shop = $request->user();

            $productResource = [
                "title" => "Good Product",
                "body_html" => "<strong>Good snowboard!</strong>"
            ];

            $apiResponse = $shop->api()->rest(
                'POST',
                '/admin/api/products.json',
                [
                    'product' => $productResource
                ]
            );
            $shop->fakeProducts()->createMany($apiResponse['body']['product']);
        }
        return $this->responseFactory->json($apiResponse['body']['product']);
    }

    public function destroy(Request $request, $id)
    {
        $shop = $request->user();
        $request = $shop->api()->rest(
            'DELETE',
            '/admin/api/products/' . $id . '.json'
        );
        return $this->responseFactory->json($request['body']);
    }

    public function showProducts(Request $request)
    {
        $shop = $request->user();

        $getProductResponse = $shop->api()->rest(
            'GET',
            '/admin/api/products.json'
        );

        if ($getProductResponse['status'] === 200) {
            $products = $getProductResponse['body']['products'];

            $selectedProductIds = Product::where('user_id', $shop->id)
                ->pluck('product_id')
                ->toArray();

            $formattedProducts = collect($products)->map(function ($product) use ($shop, $selectedProductIds) {
                $shopDomain = $shop->name;
                return [
                    'product_id' => $product['id'],
                    'title' => $product['title'],
                    'description' => $product['body_html'],
                    'price' => $product['variants'][0]['price'] ?? '0.00',
                    'url' => "https://{$shopDomain}/products/{$product['handle']}",
                    'is_selected' => in_array($product['id'], $selectedProductIds),
                ];
            });

            $selectedProducts = $formattedProducts->filter(fn($product) => $product['is_selected']);
            $notSelectedProducts = $formattedProducts->filter(fn($product) => !$product['is_selected']);

            return response()->json([
                'message' => 'Products retrieved successfully.',
                'data' => [
                    'selected' => $selectedProducts->values(),
                    'not_selected' => $notSelectedProducts->values(),
                ],
            ], 200);
        } else {
            return response()->json([
                'error' => 'Unable to fetch products',
                'details' => $getProductResponse['error'],
            ], $getProductResponse['status']);
        }
    }

    public function saveProductsApp(Request $request)
    {
        try {
            $validatedData = $request->validate([
                'products' => 'required|array',
                'products.*.product_id' => 'required|int',
                'products.*.title' => 'required|string',
                'products.*.description' => 'nullable|string',
                'products.*.price' => 'required|string',
                'products.*.url' => 'required|string',
            ]);

            $shop = $request->user();

            $savedProducts = [];

            foreach ($validatedData['products'] as $productData) {
                $product = Product::updateOrCreate(
                    ['product_id' => $productData['product_id']],
                    [
                        'user_id' => $shop->id,
                        'title' => $productData['title'],
                        'price' => $productData['price'] ?? '0,00',
                        'description' => json_encode($productData['description']) ?? null,
                        'product_url' => $productData['url'],
                        'active' => true,
                    ]
                );

                $savedProducts[] = $product;
            }
            return response()->json([
                'success' => true,
                'data' => $savedProducts,
                'message' => 'Products saved successfully',
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error saving products',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function deleteProductApp(Request $request)
    {
        try {
            $validatedData = $request->validate([
                'products' => 'required|array',
                'products.*.product_id' => 'required|int',
            ]);
    
            $shop = $request->user();
    
            $productIds = [];
            foreach ($validatedData['products'] as $product) {
                $productIds[] = $product['product_id'];
            }
    
            $deletedCount = Product::where('user_id', $shop->id)
                ->whereIn('product_id', $productIds)
                ->delete();
    
            if ($deletedCount === 0) {
                return response()->json([
                    'success' => false,
                    'message' => 'No products found to delete',
                ], 404);
            }
    
            return response()->json([
                'success' => true,
                'message' => 'Products deleted successfully',
                'deleted_count' => $deletedCount,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error deleting products',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
    
}
