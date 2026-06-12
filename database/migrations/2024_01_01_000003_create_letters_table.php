<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('letters', function (Blueprint $table) {
            $table->id();
            $table->string('char_arabic');       // e.g. ب
            $table->string('name');              // e.g. Ba
            $table->string('read_latin');        // e.g. Ba
            $table->text('pronunciation_desc')->nullable();
            $table->string('audio_path')->nullable();
            $table->string('example_word')->nullable();
            $table->string('example_image_path')->nullable();
            $table->integer('order_sequence')->default(0);
            // Harakat data from iqro-json
            $table->json('fathah')->nullable();  // {"latin":"Ba","arabic":"بَ"}
            $table->json('kasrah')->nullable();  // {"latin":"Bi","arabic":"بِ"}
            $table->json('dhammah')->nullable(); // {"latin":"Bu","arabic":"بُ"}
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('letters');
    }
};
