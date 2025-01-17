<?php

namespace App\Http\Controllers;

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

    // public function updateProduct(Request $request)
    // {   

    //     $shop = $request->user();
    //     $access_scopes = $shop->api()->rest('GET', '/admin/oauth/access_scopes.json');
    //     $getResponse = $shop->api()->rest('GET', '/admin/api/2025-01/script_tags.json');
  
    //     $response = $shop->api()->rest(
    //         'POST',
    //         '/admin/api/2025-01/script_tags.json',
    //         [
    //             'script_tag' => [
    //                 'event' => 'onload',
    //                 'src' => "https://2b65-124-253-110-243.ngrok-free.app/consent.js",
    //             ],
    //         ]
    //     );
        
    //     dd($response);
    //     if ($response['status'] === 201) {
    //         return response()->json(['message' => 'Script added successfully']);
    //     } else {
    //         return response()->json(['error' => 'Failed to add script'], 500);
    //     }
        
    // }
}
