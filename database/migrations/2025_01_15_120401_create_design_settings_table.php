<?php

use App\Models\User;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('design_settings', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(User::class)->default(0);
            $table->bigInteger('template_id')->default(0);
            $table->string('title')->nullable();
            $table->string('title_font_size')->nullable();
            $table->text('description')->nullable();
            $table->string('accept_button_text')->nullable();
            $table->string('accept_button_round')->nullable();
            $table->json('accept_button_text_color')->nullable();
            $table->json('accept_button_bg_color')->nullable();
            $table->string('reject_button_text')->nullable();
            $table->string('reject_button_round')->nullable();
            $table->json('reject_button_text_color')->nullable();
            $table->json('reject_button_bg_color')->nullable();
            $table->json('background_color')->nullable();
            $table->json('text_color')->nullable();
            $table->string('font_family')->nullable();
            $table->string('font_size')->nullable();
            $table->string('position')->nullable();
            $table->string('template_round')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('design_settings');
    }
};
