<?php

namespace App\Http\Controllers;

use App\Models\AgeRestriction;
use App\Models\DesignSetting;
use App\Models\User;
use Illuminate\Http\Request;

class DesignSettingController extends Controller
{
    public function savePopupDesignData(Request $request)
    {
        try {
            $validatedData = $request->validate([
                'title' => 'nullable|string|max:255',
                'title_font_size' => 'nullable',
                'description' => 'nullable|string',
                'template_round' => 'nullable',
                'accept_button_text' => 'nullable|string|max:255',
                'accept_button_round' => 'nullable',
                'accept_button_text_color' => 'nullable|json',
                'accept_button_bg_color' => 'nullable|json',
                'reject_button_text' => 'nullable|string|max:255',
                'reject_button_round' => 'nullable',
                'reject_button_text_color' => 'nullable|json',
                'reject_button_bg_color' => 'nullable|json',
                'background_color' => 'nullable|json',
                'text_color' => 'nullable|json',
                'font_family' => 'nullable|string|max:255',
                'font_size' => 'nullable',
                'position' => 'nullable|string|max:255',
            ]);

            // Format color values
            $formattedData = [
                ...$validatedData,
                'accept_button_text_color' => json_decode($validatedData['accept_button_text_color']),
                'position' => $validatedData['position'] ?? 'center',
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

    public function getPopupDesignData(Request $request)
    {
        try {
            $shop = $request->user();

            $popupDesign = DesignSetting::where('user_id', $shop->id)->first();

            if (!$popupDesign) {
                return response()->json([
                    'success' => false,
                    'message' => 'No design settings found for this user',
                ], 200);
            }

            return response()->json([
                'success' => true,
                'data' => $popupDesign,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error retrieving design settings',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function ageRestrictionSetting(Request $request)
    {
        try {
            $validatedData = $request->validate([
                'minimumAge' => 'nullable|integer|min:13|max:120',
                'validationType' => 'nullable|string|in:block,message,redirect',
                'redirectUrl' => 'nullable|url|max:255',
                'blockMessage' => 'nullable|max:255',
                'pageViewType' => 'nullable|string|in:all,specific',
                'popupEnabled' => 'nullable|boolean',
                'rememberVerificationDays' => 'nullable|integer|min:15|max:90',
            ]);

            $shop = $request->user();
            $cleanShopName = trim($shop->name, '*');
            $storeName = explode('.', $cleanShopName)[0];

            $defaultMessages = [
                'block' => $request->blockMessage,
                'message' => "You are not able to see website.",
                'redirect' => null,
            ];

            $message = $defaultMessages[$validatedData['validationType']] ?? null;

            $formattedData = [
                'user_id' => $shop->id,
                'widget_name' => $storeName ?? null,
                'minimum_age' => $validatedData['minimumAge'] ?? null,
                'validation_type' => $validatedData['validationType'] ?? null,
                'validation_message' => $message ?? null,
                'validation_redirect_url' => $validatedData['redirectUrl'] ?? null,
                'page_view_type' => $validatedData['pageViewType'] ?? 'all',
                'remember_verification_days' => $validatedData['rememberVerificationDays'] ?? null,
                'popup_enabled' => $validatedData['popupEnabled'] ?? false,
            ];

            $ageSettings = AgeRestriction::updateOrCreate(
                ['user_id' => $shop->id],
                $formattedData
            );

            return response()->json([
                'success' => true,
                'data' => $ageSettings,
                'message' => 'Age settings saved successfully',
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error saving age restriction settings',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function getRestrictionsSetting(Request $request)
    {
        try {
            $shop = $request->user();

            $ageRestrictionData = AgeRestriction::where('user_id', $shop->id)->first();

            $data = [
                'user_id' => $shop->id,
                'widget_name' => $ageRestrictionData->widget_name ?? null,
                'minimum_age' => $ageRestrictionData->minimum_age ?? null,
                'validation_type' => $ageRestrictionData->validation_type ?? null,
                'validation_message' => $ageRestrictionData->validation_message ?? null,
                'validation_redirect_url' => $ageRestrictionData->validation_redirect_url ?? null,
                'page_view_type' => $ageRestrictionData->page_view_type ?? 'all',
                'remember_verification_days' => $ageRestrictionData->remember_verification_days ?? null,
                'popup_enabled' => $ageRestrictionData->popup_enabled ?? true,
            ];
            return response()->json([
                'success' => true,
                'data' => $data,
                'message' => 'Age settings get successfully',
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error saving age restriction settings',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
