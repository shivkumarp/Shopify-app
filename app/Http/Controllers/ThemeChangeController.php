<?php

namespace App\Http\Controllers;

use App\Models\AgeRestriction;
use App\Models\DesignSetting;
use App\Models\Product;
use App\Models\ScriptTag;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Termwind\Components\Raw;

class ThemeChangeController extends Controller
{
    // public function getThemeID(Request $request)
    // {
    //     $shop = $request->user();

    //     $response = $shop->api()->rest('GET', '/admin/api/2025-01/themes.json');

    //     if ($response['status'] === 200) {
    //         $themes = $response['body']['themes'];
    //         return response()->json(['themes' => $themes]);
    //     } else {
    //         return response()->json(['error' => 'Unable to fetch themes'], $response['status']);
    //     }
    // }

    // public function getMainTheme(Request $request)
    // {
    //     $shop = $request->user();

    //     $themesResponse = $shop->api()->rest('GET', '/admin/api/2025-01/themes.json');

    //     if ($themesResponse['status'] === 200) {
    //         $themes = $themesResponse['body']['themes'];

    //         $mainTheme = collect($themes)->firstWhere('role', 'main');

    //         if ($mainTheme) {
    //             $themeId = $mainTheme['id'];
    //             $assetsResponse = $shop->api()->rest('GET', "/admin/api/2025-01/themes/$themeId/assets.json");

    //             if ($assetsResponse['status'] === 200) {
    //                 return response()->json([
    //                     'theme' => $mainTheme,
    //                     'assets' => $assetsResponse['body']['assets'],
    //                 ], 200);
    //             }
    //         }
    //     }

    //     return response()->json(['error' => 'Main theme or assets not found'], 404);
    // }


    // public function changeThemeheaderFile(Request $request)
    // {
    //     $shop = $request->user();
    //     $theme_id = $request->input('theme_id');
    //     $file_key = $request->input('file_key');
    //     $new_heading = $request->input('new_heading');

    //     // Step 1: Fetch the file content
    //     $response = $shop->api()->rest('GET', '/admin/api/2025-01/themes/' . $theme_id . '/assets.json', [
    //         'asset[key]' => $file_key,
    //     ]);

    //     if ($response['status'] !== 200) {
    //         return response()->json(['error' => 'Unable to fetch the file content'], $response['status']);
    //     }

    //     $file_content = $response['body']['asset']['value']; // Content of the file

    //     // Step 2: Modify the content
    //     // Example: Replace a heading placeholder with the new heading
    //     $updated_content = str_replace('[[heading]]', $new_heading, $file_content);
    //     // Step 3: Update the file with the modified content
    //     $update_response = $shop->api()->rest('PUT', '/admin/api/2025-01/themes/' . $theme_id . '/assets.json', [
    //         'asset' => [
    //             'key' => $file_key,
    //             'value' => $updated_content,
    //         ],
    //     ]);

    //     if ($update_response['status'] === 200) {
    //         return response()->json(['message' => 'Header file updated successfully']);
    //     } else {
    //         return response()->json(['error' => 'Unable to update header file'], $update_response['status']);
    //     }
    // }

    public function uploadScriptTagShopify(Request $request)
    {
        $shop = $request->user();
        $designSettings = DesignSetting::where('user_id', $shop->id)->first();
        $existingScript = ScriptTag::where('user_id', $shop->id)->first();
    
        if (!$existingScript) {
            $graphqlMutation = '
                mutation scriptTagCreate($input: ScriptTagInput!) {
                    scriptTagCreate(input: $input) {
                        scriptTag {
                            id
                            src
                        }
                        userErrors {
                            field
                            message
                        }
                    }
                }
            ';
            
            $variables = [
                'input' => [
                    'src' => "https://ageverifier.zo-apps.com/age-restrictions-kashco.js?user_id={$shop->id}",
                    'displayScope' => 'ONLINE_STORE',
                    'cache' => false
                ]
            ];
    
            $apiResponse = $shop->api()->graph($graphqlMutation, $variables);
    
            if (isset($apiResponse['body']['data']['scriptTagCreate']['scriptTag']['id'])) {
                $gid = $apiResponse['body']['data']['scriptTagCreate']['scriptTag']['id'];
                $scriptTagId = substr($gid, strrpos($gid, '/') + 1);
                
                ScriptTag::create([
                    'user_id' => $shop->id,
                    'script_tag_id' => $scriptTagId,
                    'is_installed' => true,
                ]);
                
                return response()->json(['message' => 'Script added successfully'], 200);
            } else {
                $errors = $apiResponse['body']['data']['scriptTagCreate']['userErrors'] ?? [];
                $errorMessage = $errors ? $errors[0]['message'] : 'Failed to add script';
                return response()->json(['error' => $errorMessage], 500);
            }
        } else {
            $updateResponse = $this->updateScriptTagShopify($request, $existingScript);
            return $updateResponse;
        }
    }

    public function updateScriptTagShopify(Request $request, $existingScript)
    {
        $shop = $request->user();
        $graphqlMutation = '
        mutation scriptTagUpdate($id: ID!, $input: ScriptTagInput!) {
            scriptTagUpdate(id: $id, input: $input) {
                scriptTag {
                    id
                    src
                }
                userErrors {
                    field
                    message
                }
            }
        }
    ';

        $variables = [
            'id' => "gid://shopify/ScriptTag/{$existingScript->script_tag_id}",
            'input' => [
                'src' => "https://ageverifier.zo-apps.com/age-restrictions-kashco.js?user_id={$shop->id}"
            ]
        ];

        $apiResponse = $shop->api()->graph($graphqlMutation, $variables);

        if (
            isset($apiResponse['body']['data']['scriptTagUpdate']['userErrors'])
            && count($apiResponse['body']['data']['scriptTagUpdate']['userErrors']) === 0
        ) {
            return response()->json(['message' => 'Script updated successfully'], 200);
        } else {
            $errors = $apiResponse['body']['data']['scriptTagUpdate']['userErrors'] ?? [];
            $errorMessage = $errors ? $errors[0]['message'] : 'Failed to update script';
            return response()->json(['error' => $errorMessage], 500);
        }
    }

    public function getSettings($userId)
    {
        $designSettings = DesignSetting::where('user_id', $userId)->first();
        $ageRestrictionSettings = AgeRestriction::where('user_id', $userId)->first();
        $getSpecificUrl = Product::where('user_id', $userId)->get();

        if (!$designSettings && !$ageRestrictionSettings) {
            return response()->json(['error' => 'Settings not found'], 404);
        }

        return response()->json([
            'design_settings' => $designSettings ?? [],
            'age_restriction_settings' => $ageRestrictionSettings ?? [],
            'specific_url' => $getSpecificUrl ?? null
        ]);
    }
}
