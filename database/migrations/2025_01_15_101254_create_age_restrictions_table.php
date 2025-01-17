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
        Schema::create('age_restrictions', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(User::class)->default(0);
            $table->string('widget_name')->nullable();
            $table->string('page_view_type')->default('all');
            $table->json('specific_urls')->nullable(); 
            $table->integer('minimum_age')->default(18);
            $table->string('validation_type')->default('block');
            $table->string('validation_message')->nullable();
            $table->string('validation_redirect_url')->nullable();
            $table->integer('remember_verification_days')->default(30);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('age_restrictions');
    }
};
