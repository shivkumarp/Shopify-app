<?php

namespace App\Http\Controllers;

use App\Models\DesignSetting;
use App\Models\User;
use Illuminate\Http\Request;

class DesignSettingController extends Controller
{
    public function index()
    {
        return DesignSetting::all();
    }

    public function savePopupDesignData(Request $request)
    {
        try {
            $validatedData = $request->validate([
                'title' => 'nullable|string|max:255',
                'description' => 'nullable|string',
                'accept_button_text' => 'nullable|string|max:255',
                'accept_button_text_color' => 'nullable|json',
                'accept_button_bg_color' => 'nullable|json',
                'reject_button_text' => 'nullable|string|max:255',
                'reject_button_text_color' => 'nullable|json',
                'reject_button_bg_color' => 'nullable|json',
                'background_color' => 'nullable|json',
                'text_color' => 'nullable|json',
                'font_family' => 'nullable|string|max:255',
                'font_size' => 'nullable|string|max:255',
                'position' => 'nullable|string|max:255',
            ]);

            // Format color values
            $formattedData = [
                ...$validatedData,
                'accept_button_text_color' => json_decode($validatedData['accept_button_text_color']),
                'accept_button_bg_color' => json_decode($validatedData['accept_button_bg_color']),
                'reject_button_text_color' => json_decode($validatedData['reject_button_text_color']),
                'reject_button_bg_color' => json_decode($validatedData['reject_button_bg_color']),
                'background_color' => json_decode($validatedData['background_color']),
                'text_color' => json_decode($validatedData['text_color']),
            ];

            $shop = $request->user();

            $popupDesign = DesignSetting::updateOrCreate(
                ['user_id' => $shop->id],
                $formattedData
            );

            $cleanShopName = trim($shop->name, '*');

            $storeName = explode('.', $cleanShopName)[0];
            $fullUrl = "https://{$cleanShopName}";

            $user = User::updateOrCreate(
                ['id' => $shop->id],
                [
                    'store_name' => $storeName,
                    'store_url' => $fullUrl,
                    'store_id' => $shop->id
                ]
            );

            return response()->json([
                'success' => true,
                'message' => 'Design settings saved successfully'
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error saving design settings',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {
        return DesignSetting::findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $designSetting = DesignSetting::findOrFail($id);
        $designSetting->update($request->all());
        return response()->json($designSetting, 200);
    }

    public function delete($id)
    {
        DesignSetting::findOrFail($id)->delete();
        return response()->json(null, 204);
    }
}
