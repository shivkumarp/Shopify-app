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
        Schema::create('script_tags', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(User::class)->default(0);
            $table->string('script_tag_id')->nullable();
            $table->boolean('is_installed')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('script_tags');
    }
};
