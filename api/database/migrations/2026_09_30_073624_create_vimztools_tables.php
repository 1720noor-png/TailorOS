<?php

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
        // Add role to users if not present
        if (!Schema::hasColumn('users', 'role')) {
            Schema::table('users', function (Blueprint $table) {
                $table->string('role')->default('user'); // 'admin' or 'user'
            });
        }

        // Tools table (metadata for pricing, downloads, and stats)
        Schema::create('tools', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('name');
            $table->string('category_slug')->nullable();
            $table->string('subcategory_slug')->nullable();
            $table->boolean('is_paid')->default(false);
            $table->decimal('price', 8, 2)->default(0.00); // USD
            $table->string('currency')->default('USD');
            $table->boolean('download_enabled')->default(true);
            $table->string('download_type')->nullable(); // pdf, zip, excel, json, svg
            $table->text('preview_summary')->nullable();
            $table->unsignedBigInteger('view_count')->default(0);
            $table->unsignedBigInteger('use_count')->default(0);
            $table->unsignedBigInteger('purchase_count')->default(0);
            $table->timestamps();
        });

        // Purchases table (One-time payments only - NO subscriptions)
        Schema::create('purchases', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('guest_email')->nullable();
            $table->string('tool_slug');
            $table->string('transaction_id')->unique();
            $table->decimal('amount', 8, 2);
            $table->string('currency')->default('USD');
            $table->string('payment_gateway')->default('stripe'); // stripe, paypal, sandbox
            $table->string('status')->default('completed'); // completed, pending, failed, refunded
            $table->string('download_token')->unique();
            $table->unsignedInteger('download_limit')->default(10);
            $table->unsignedInteger('download_count')->default(0);
            $table->timestamp('expires_at')->nullable();
            $table->json('metadata')->nullable();
            $table->timestamps();

            $table->index(['user_id', 'tool_slug']);
            $table->index('download_token');
        });

        // Saved tool results for logged-in users
        Schema::create('saved_results', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('tool_slug');
            $table->string('title');
            $table->longText('payload'); // JSON or formatted text
            $table->timestamps();

            $table->index(['user_id', 'tool_slug']);
        });

        // User favorite tools
        Schema::create('favorites', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('tool_slug');
            $table->timestamps();

            $table->unique(['user_id', 'tool_slug']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('favorites');
        Schema::dropIfExists('saved_results');
        Schema::dropIfExists('purchases');
        Schema::dropIfExists('tools');

        if (Schema::hasColumn('users', 'role')) {
            Schema::table('users', function (Blueprint $table) {
                $table->dropColumn('role');
            });
        }
    }
};
