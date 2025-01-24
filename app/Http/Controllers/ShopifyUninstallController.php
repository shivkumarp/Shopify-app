<?php

namespace App\Http\Controllers;

use App\Models\AgeRestriction;
use App\Models\DesignSetting;
use App\Models\Product;
use App\Models\ScriptTag;
use App\Models\Tag;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ShopifyUninstallController extends Controller
{
    public function appUninstall(Request $request)
    {
        try {
            $user = User::where('name', trim($request->domain))->first();

            if ($user) {
                Tag::where('user_id', $user->id)->delete();
                ScriptTag::where('user_id', $user->id)->delete();
                AgeRestriction::where('user_id', $user->id)->delete();
                Product::where('user_id', $user->id)->delete();
                DesignSetting::where('user_id', $user->id)->delete();
                $user->delete();
                return response()->json(['message' => 'User and associated data deleted successfully'], 200);
            }
            return response()->json(['message' => 'No user found, but operation completed'], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'An error occurred while processing the request', $e], 500);
        }
    }
}
