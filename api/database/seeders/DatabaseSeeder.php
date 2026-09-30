<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Tool;
use App\Models\Purchase;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Create Admin User
        $admin = User::firstOrCreate(
            ['email' => 'admin@vimztools.com'],
            [
                'name' => 'VimzTools Admin',
                'password' => Hash::make('AdminVimz2026!'),
                'role' => 'admin',
            ]
        );

        // 2. Create Demo/Test User
        $demoUser = User::firstOrCreate(
            ['email' => 'user@vimztools.com'],
            [
                'name' => 'Demo Professional',
                'password' => Hash::make('DemoUser2026!'),
                'role' => 'user',
            ]
        );

        // 3. Define the Premium High-Value Paid Tools (~20-25 tools with one-time payment pricing)
        $premiumToolsConfig = [
            'invoice-generator' => [
                'name' => 'Professional Invoice Generator',
                'category_slug' => 'office',
                'subcategory_slug' => 'document-office',
                'is_paid' => true,
                'price' => 4.99,
                'download_type' => 'pdf',
                'preview_summary' => 'Export vector PDF invoices with customizable tax, discounts, branding, and multi-currency formatting.',
            ],
            'meeting-minutes-generator' => [
                'name' => 'Executive Meeting Minutes Generator',
                'category_slug' => 'office',
                'subcategory_slug' => 'productivity-office',
                'is_paid' => true,
                'price' => 3.99,
                'download_type' => 'pdf',
                'preview_summary' => 'Formal meeting summary and action-item tracker with executive signatures.',
            ],
            'business-letter-generator' => [
                'name' => 'Corporate Business Letter Generator',
                'category_slug' => 'office',
                'subcategory_slug' => 'document-office',
                'is_paid' => true,
                'price' => 2.99,
                'download_type' => 'pdf',
                'preview_summary' => 'Formal corporate correspondence template with letterhead export.',
            ],
            'expense-report-generator' => [
                'name' => 'Itemized Expense Report Generator',
                'category_slug' => 'office',
                'subcategory_slug' => 'spreadsheets-office',
                'is_paid' => true,
                'price' => 4.99,
                'download_type' => 'excel',
                'preview_summary' => 'Comprehensive tax-compliant expense summary with receipt attachment slots.',
            ],
            'nda-template-generator' => [
                'name' => 'Standard Non-Disclosure Agreement Generator',
                'category_slug' => 'legal',
                'subcategory_slug' => 'contracts-legal',
                'is_paid' => true,
                'price' => 7.99,
                'download_type' => 'pdf',
                'preview_summary' => 'Bilateral & unilateral NDA contracts customized with jurisdiction clauses.',
            ],
            'privacy-policy-generator' => [
                'name' => 'GDPR/CCPA Privacy Policy Generator',
                'category_slug' => 'legal',
                'subcategory_slug' => 'compliance-legal',
                'is_paid' => true,
                'price' => 6.99,
                'download_type' => 'pdf',
                'preview_summary' => 'Compliant privacy terms for web, SaaS, and mobile applications.',
            ],
            'compliance-checklist' => [
                'name' => 'Regulatory Compliance Audit Checklist',
                'category_slug' => 'legal',
                'subcategory_slug' => 'compliance-legal',
                'is_paid' => true,
                'price' => 4.99,
                'download_type' => 'pdf',
                'preview_summary' => 'ISO/SOC2/GDPR readiness checklist with score calculations.',
            ],
            'pdf-watermark' => [
                'name' => 'High-Resolution PDF Watermarker',
                'category_slug' => 'pdf',
                'subcategory_slug' => 'pdf-security',
                'is_paid' => true,
                'price' => 2.99,
                'download_type' => 'pdf',
                'preview_summary' => 'Batch apply transparent diagonal watermarks with custom opacity.',
            ],
            'pdf-bates-stamper' => [
                'name' => 'Legal Bates Number Stamper',
                'category_slug' => 'pdf',
                'subcategory_slug' => 'pdf-security',
                'is_paid' => true,
                'price' => 5.99,
                'download_type' => 'pdf',
                'preview_summary' => 'Automated sequential legal numbering and case indexing for discovery documents.',
            ],
            'qr-code-generator' => [
                'name' => 'Dynamic Vector QR Code Studio',
                'category_slug' => 'developer',
                'subcategory_slug' => 'utilities-developer',
                'is_paid' => true,
                'price' => 2.99,
                'download_type' => 'svg',
                'preview_summary' => 'Print-ready high-DPI SVG/PNG QR codes with embedded center logos and custom eye styles.',
            ],
            'social-post-scheduler' => [
                'name' => 'Omnichannel Social Media Calendar & Planner',
                'category_slug' => 'social-media',
                'subcategory_slug' => 'management-social-media',
                'is_paid' => true,
                'price' => 5.99,
                'download_type' => 'excel',
                'preview_summary' => 'Editorial calendar export with hashtag performance formulas.',
            ],
            'dcf-valuation-calc' => [
                'name' => 'Discounted Cash Flow (DCF) Financial Model',
                'category_slug' => 'finance',
                'subcategory_slug' => 'investment-finance',
                'is_paid' => true,
                'price' => 8.99,
                'download_type' => 'excel',
                'preview_summary' => 'Multi-stage WACC, terminal growth, and sensitivity matrix financial model.',
            ],
            'rice-prioritization-calc' => [
                'name' => 'Product RICE Scoring & Roadmap Matrix',
                'category_slug' => 'business',
                'subcategory_slug' => 'management-business',
                'is_paid' => true,
                'price' => 4.99,
                'download_type' => 'excel',
                'preview_summary' => 'Reach, Impact, Confidence, and Effort prioritization sheet with rankings.',
            ],
            'swot-matrix-gen' => [
                'name' => 'Strategic SWOT Analysis Builder',
                'category_slug' => 'business',
                'subcategory_slug' => 'strategy-business',
                'is_paid' => true,
                'price' => 3.99,
                'download_type' => 'pdf',
                'preview_summary' => 'Executive-ready 4-quadrant strategic presentation matrix.',
            ],
            'bmc-generator' => [
                'name' => 'Business Model Canvas Architect',
                'category_slug' => 'business',
                'subcategory_slug' => 'strategy-business',
                'is_paid' => true,
                'price' => 4.99,
                'download_type' => 'pdf',
                'preview_summary' => 'Alexander Osterwalder 9-box business framework vector canvas.',
            ],
            'citation-generator' => [
                'name' => 'Academic Citation & Bibliography Studio',
                'category_slug' => 'student',
                'subcategory_slug' => 'research-student',
                'is_paid' => true,
                'price' => 2.99,
                'download_type' => 'pdf',
                'preview_summary' => 'Formatted APA 7, MLA 9, Chicago 17, and Harvard bibliography builder.',
            ],
            'timetable-generator' => [
                'name' => 'Academic & Weekly Schedule Optimizer',
                'category_slug' => 'student',
                'subcategory_slug' => 'study-planning-student',
                'is_paid' => true,
                'price' => 2.99,
                'download_type' => 'pdf',
                'preview_summary' => 'Color-coded conflict-free timetable matrix.',
            ],
            'employee-satisfaction' => [
                'name' => 'eNPS & Employee Satisfaction Survey Suite',
                'category_slug' => 'hr',
                'subcategory_slug' => 'engagement-hr',
                'is_paid' => true,
                'price' => 4.99,
                'download_type' => 'excel',
                'preview_summary' => 'Standardized pulse survey framework with automated sentiment scorecards.',
            ],
            'diversity-tracker' => [
                'name' => 'Workforce Diversity & Inclusion Analytics Sheet',
                'category_slug' => 'hr',
                'subcategory_slug' => 'analytics-hr',
                'is_paid' => true,
                'price' => 5.99,
                'download_type' => 'excel',
                'preview_summary' => 'Demographic breakdown and hiring parity metrics visualization sheet.',
            ],
            'speaker-intro-gen' => [
                'name' => 'Keynote Speaker Introduction Script Studio',
                'category_slug' => 'presentation',
                'subcategory_slug' => 'speech-presentation',
                'is_paid' => true,
                'price' => 2.99,
                'download_type' => 'pdf',
                'preview_summary' => 'High-energy, formal, and panel introduction scripts formatted with cue marks.',
            ],
            'ab-test-sample-calc' => [
                'name' => 'CRO A/B Test Statistical Power Calculator',
                'category_slug' => 'marketing',
                'subcategory_slug' => 'conversion-marketing',
                'is_paid' => true,
                'price' => 4.99,
                'download_type' => 'excel',
                'preview_summary' => 'Minimum detectable effect (MDE), significance, and runtime forecast model.',
            ],
        ];

        foreach ($premiumToolsConfig as $slug => $data) {
            Tool::updateOrCreate(
                ['slug' => $slug],
                [
                    'name' => $data['name'],
                    'category_slug' => $data['category_slug'],
                    'subcategory_slug' => $data['subcategory_slug'],
                    'is_paid' => true,
                    'price' => $data['price'],
                    'currency' => 'USD',
                    'download_enabled' => true,
                    'download_type' => $data['download_type'],
                    'preview_summary' => $data['preview_summary'],
                    'view_count' => rand(120, 850),
                    'use_count' => rand(45, 320),
                    'purchase_count' => rand(5, 42),
                ]
            );
        }

        // 4. Create sample completed purchase for demo user
        Purchase::firstOrCreate(
            ['transaction_id' => 'TXN_DEMO_SAMPLE01'],
            [
                'user_id' => $demoUser->id,
                'tool_slug' => 'invoice-generator',
                'amount' => 4.99,
                'currency' => 'USD',
                'payment_gateway' => 'sandbox',
                'status' => 'completed',
                'download_token' => 'DL_' . Str::random(40),
                'download_limit' => 20,
                'download_count' => 1,
                'expires_at' => now()->addDays(365),
                'metadata' => ['tool_name' => 'Professional Invoice Generator'],
            ]
        );
    }
}
