import fs from 'fs';
import path from 'path';

// Existing 62 subcategories in the 31 structured categories:
const existingSubcatSlugs = new Set([
  'loan-debt', 'investment-savings', 'body-energy', 'workout-performance',
  'typography-layout', 'css-graphics', 'unit-converters', 'geometry-statistics',
  'trip-travel', 'everyday-utilities', 'message-utilities', 'communication-planning',
  'audio-utilities', 'sound-analysis', 'music-theory', 'practice-composition',
  'pet-planning', 'pet-information', 'vehicle-costs', 'vehicle-planning',
  'visual-accessibility', 'text-accessibility', 'physics-utilities', 'scientific-measurement',
  'space-calculators', 'astronomy-utilities', 'privacy-utilities', 'digital-safety',
  'geographic-calculations', 'location-planning', 'plant-care', 'garden-planning',
  'camera-settings', 'photo-planning', 'home-projects', 'maintenance-schedules',
  'circuit-calculators', 'component-references', 'milestone-tracking', 'family-planning',
  'party-planning', 'event-budgeting', 'fabric-calculators', 'craft-measurements',
  'training-paces', 'game-stats', 'weather-planning', 'climate-utilities',
  'material-estimation', 'project-calculations', 'room-planning', 'furniture-fitting',
  'pricing-costing', 'operations-planning', 'home-organization', 'digital-organization',
  'cleaning-schedules', 'home-inventory', 'vocabulary-building', 'study-tracking',
  'trip-prep', 'gear-planning'
]);

// Read dump
const dump = JSON.parse(fs.readFileSync('scripts/cat_tools_dump.json', 'utf8'));

// Define the comprehensive 41-category subcategory architecture and tool mapping
// Ensure every subcategory has a UNIQUE slug across the ENTIRE system.
const newCategorySubcategories = {
  'career-tools': [
    { slug: 'resume-cv', name: 'Resume & CV' },
    { slug: 'job-applications', name: 'Job Search & Applications' },
    { slug: 'career-planning-prep', name: 'Career Planning & Prep' }
  ],
  'writing-tools': [
    { slug: 'writing-editing', name: 'Writing & Editing' },
    { slug: 'content-creation', name: 'Content Creation' },
    { slug: 'text-formatting-utilities', name: 'Text & Formatting Utilities' },
    { slug: 'style-readability', name: 'Style & Readability' }
  ],
  'pdf-tools': [
    { slug: 'pdf-management', name: 'PDF Management' },
    { slug: 'pdf-conversion-export', name: 'PDF Conversion & Export' },
    { slug: 'pdf-text-security', name: 'PDF Text & Security' }
  ],
  'image-tools': [
    { slug: 'image-editing-effects', name: 'Image Editing & Effects' },
    { slug: 'image-conversion-format', name: 'Image Conversion & Format' },
    { slug: 'image-analysis-ocr', name: 'Image Analysis & OCR' }
  ],
  'media-tools': [
    { slug: 'audio-media-speech', name: 'Audio & Speech Utilities' },
    { slug: 'voice-transcription-media', name: 'Voice & Transcription' }
  ],
  'food-nutrition-tools': [
    { slug: 'cooking-recipes', name: 'Cooking & Recipes' },
    { slug: 'nutrition-meal-planning', name: 'Nutrition & Meal Planning' },
    { slug: 'kitchen-conversions-guides', name: 'Kitchen & Beverage Utilities' }
  ],
  'health-wellness-tools': [
    { slug: 'body-metrics-health', name: 'Body & Metabolic Metrics' },
    { slug: 'wellness-routine-planning', name: 'Wellness & Routine Planning' },
    { slug: 'health-monitoring-tracking', name: 'Health Monitoring & Assessment' }
  ],
  'student-tools': [
    { slug: 'academic-grades-gpa', name: 'Grades & Academic Standing' },
    { slug: 'study-learning-management', name: 'Study & Learning Management' },
    { slug: 'assignments-writing-prep', name: 'Assignments & Writing Prep' },
    { slug: 'classroom-attendance-planning', name: 'Attendance & Classroom Planning' }
  ],
  'developer-tools': [
    { slug: 'code-formatting-transform', name: 'Code Formatting & Conversion' },
    { slug: 'web-frontend-styling', name: 'Web & CSS Styling' },
    { slug: 'encoding-hashing-security', name: 'Encoding, Hashing & Cryptography' },
    { slug: 'network-api-data-inspection', name: 'API, Network & Data Inspection' },
    { slug: 'regex-text-developer-tools', name: 'Regex & String Manipulation' },
    { slug: 'data-generators-mocks', name: 'Data Generators & Mocking' }
  ],
  'office-tools': [
    { slug: 'workplace-compensation-payroll', name: 'Compensation & Payroll' },
    { slug: 'business-communications-forms', name: 'Business Communications & Forms' },
    { slug: 'office-checklists-management', name: 'Checklists & Project Admin' },
    { slug: 'meeting-productivity-tools', name: 'Meeting & Productivity Utilities' }
  ],
  'marketing-tools': [
    { slug: 'seo-content-optimization', name: 'SEO & Content Optimization' },
    { slug: 'campaign-tracking-advertising', name: 'Campaigns & Advertising' },
    { slug: 'branding-social-marketing', name: 'Branding & Social Copy' }
  ],
  'productivity-tools': [
    { slug: 'time-focus-management', name: 'Time & Focus Management' },
    { slug: 'planning-goal-tracking', name: 'Planning & Goal Tracking' },
    { slug: 'workflow-randomizers-utilities', name: 'Workflow Utilities & Randomizers' }
  ],
  'shopping-tools': [
    { slug: 'discounts-savings-calculators', name: 'Discounts & Savings Calculators' },
    { slug: 'tax-fees-shipping-costs', name: 'Taxes, Fees & Shipping' },
    { slug: 'budgeting-shopping-planners', name: 'Budgeting & Value Comparison' }
  ],
  'security-tools': [
    { slug: 'password-credential-generators', name: 'Passwords & Credentials' },
    { slug: 'cryptographic-hashing-ciphers', name: 'Hashing & Encryption' },
    { slug: 'security-auditing-checks', name: 'Security Auditing & Network Checks' }
  ],
  'real-estate-tools': [
    { slug: 'property-valuation-roi', name: 'Property Valuation & ROI' },
    { slug: 'rental-cashflow-landlord', name: 'Rental Cash Flow & Landlord Tools' },
    { slug: 'mortgage-financing-equity', name: 'Mortgage, Equity & Closing Costs' }
  ],
  'insurance-tools': [
    { slug: 'life-health-disability-needs', name: 'Life & Disability Needs' },
    { slug: 'property-auto-coverage', name: 'Auto & Property Coverage' },
    { slug: 'deductibles-costs-planning', name: 'Deductibles & Policy Planning' }
  ],
  'retirement-planning-tools': [
    { slug: 'retirement-milestones-fire', name: 'FIRE & Retirement Milestones' },
    { slug: 'social-security-pension-benefits', name: 'Social Security & Pensions' },
    { slug: 'savings-401k-contributions', name: '401(k), IRA & Contributions' },
    { slug: 'drawdown-rmd-healthcare', name: 'Drawdown, RMD & Healthcare' }
  ],
  'education-tools': [
    { slug: 'grading-curriculum-planning', name: 'Grading & Lesson Planning' },
    { slug: 'classroom-management-attendance', name: 'Classroom & Student Management' },
    { slug: 'academic-study-aids', name: 'Academic & Learning Utilities' }
  ],
  'legal-tools': [
    { slug: 'contract-document-templates', name: 'Agreements & Document Templates' },
    { slug: 'compliance-audit-checklists', name: 'Compliance & Legal Auditing' },
    { slug: 'legal-fee-settlement-calculators', name: 'Fees, Billing & Settlement' }
  ],
  'freelance-tools': [
    { slug: 'pricing-hourly-rates', name: 'Pricing & Rate Calculation' },
    { slug: 'invoicing-payment-contracts', name: 'Invoicing & Client Contracts' },
    { slug: 'freelance-tax-finances', name: 'Taxes & Financial Management' }
  ],
  'social-media-tools': [
    { slug: 'bio-profile-optimization', name: 'Bio & Profile Optimization' },
    { slug: 'captions-hashtag-generation', name: 'Captions & Hashtags' },
    { slug: 'engagement-metrics-analytics', name: 'Engagement & Metrics Analytics' },
    { slug: 'content-scheduling-planners', name: 'Content Strategy & Calendars' }
  ],
  'data-tools': [
    { slug: 'data-cleansing-transformation', name: 'Data Cleansing & Transformation' },
    { slug: 'statistics-correlation-analysis', name: 'Statistical & Correlation Analysis' },
    { slug: 'data-sampling-randomization', name: 'Sampling, Testing & Summary' }
  ],
  'ecommerce-tools': [
    { slug: 'product-pricing-profitability', name: 'Pricing, Margin & Profitability' },
    { slug: 'order-shipping-fulfillment', name: 'Shipping, Fees & Break-Even' },
    { slug: 'inventory-store-operations', name: 'Inventory & Store Operations' }
  ],
  'sustainability-tools': [
    { slug: 'carbon-energy-footprint', name: 'Carbon & Energy Footprint' },
    { slug: 'waste-water-conservation', name: 'Water & Resource Conservation' },
    { slug: 'eco-lifestyle-offsets', name: 'Eco Living & Offsets' }
  ],
  'presentation-tools': [
    { slug: 'speech-timing-pacing', name: 'Speech Timing & Pacing' },
    { slug: 'slide-structure-planning', name: 'Slide & Content Structure' },
    { slug: 'presentation-design-qa', name: 'Visual Layout & Q&A Prep' }
  ],
  'networking-tools': [
    { slug: 'ip-subnetting-addressing', name: 'IP Subnetting & Addressing' },
    { slug: 'bandwidth-latency-transfer', name: 'Bandwidth & Data Transfer' },
    { slug: 'ports-dns-network-diagnostics', name: 'Ports, DNS & Diagnostics' }
  ],
  'typography-tools': [
    { slug: 'font-sizing-type-scale', name: 'Type Scales & Modular Sizing' },
    { slug: 'font-pairing-selection', name: 'Font Pairing & Character Inspection' },
    { slug: 'line-height-paragraph-spacing', name: 'Paragraph & Vertical Spacing' }
  ],
  'baking-tools': [
    { slug: 'recipe-scaling-bakers-math', name: "Baker's Percentages & Yield" },
    { slug: 'pan-size-oven-conversions', name: 'Pan Size & Oven Temperature' },
    { slug: 'ingredient-weight-substitutions', name: 'Ingredient Weights & Yeast Proofing' }
  ],
  'moving-relocation-tools': [
    { slug: 'moving-cost-estimation', name: 'Cost Estimation & Moving Budgets' },
    { slug: 'packing-supplies-inventory', name: 'Packing Supplies & Box Counts' },
    { slug: 'relocation-checklists-planning', name: 'Relocation Timelines & Change of Address' }
  ],
  'mental-health-tools': [
    { slug: 'mindfulness-breathing-exercises', name: 'Mindfulness & Breathing Exercises' },
    { slug: 'mood-emotional-tracking', name: 'Mood & Emotional Tracking' },
    { slug: 'stress-anxiety-management', name: 'Stress & Habit Management' }
  ],
  'wedding-tools': [
    { slug: 'wedding-budgeting-breakdown', name: 'Wedding Budget & Cost Breakdown' },
    { slug: 'guest-list-table-seating', name: 'Guest Lists & Table Layouts' },
    { slug: 'vendor-timeline-planning', name: 'Timeline, Vows & Vendor Planning' }
  ],
  'diy-tools': [
    { slug: 'diy-material-quantities', name: 'Material Quantity & Surface Calculators' },
    { slug: 'workshop-angles-fasteners', name: 'Angles, Miters & Fasteners' },
    { slug: 'paint-finish-project-planning', name: 'Finishes, Lumber & Project Budgets' }
  ],
  'gaming-tools': [
    { slug: 'dice-randomizers-probability', name: 'Dice Rolling & Probability' },
    { slug: 'ttrpg-character-combat', name: 'TTRPG Character & Combat Trackers' },
    { slug: 'boardgame-scorekeeping-tournaments', name: 'Scorekeeping, Timers & Tournaments' }
  ],
  'travel-planning-tools': [
    { slug: 'itinerary-trip-budgets', name: 'Itinerary & Daily Travel Budgets' },
    { slug: 'packing-clothing-lists', name: 'Packing Lists & Weather Prep' },
    { slug: 'timezone-currency-flight-planning', name: 'Timezones, Currency & Flight Prep' }
  ],
  'chemistry-tools': [
    { slug: 'molecular-molar-calculations', name: 'Molar Mass & Stoichiometry' },
    { slug: 'solution-dilution-molarity', name: 'Solutions, Dilutions & Molarity' },
    { slug: 'gas-laws-thermodynamics', name: 'Gas Laws & Thermodynamics' }
  ],
  'hr-tools': [
    { slug: 'recruitment-interview-scorecards', name: 'Recruitment & Interview Scorecards' },
    { slug: 'pto-leave-attendance-management', name: 'PTO, Leave & Attendance' },
    { slug: 'compensation-turnover-analytics', name: 'Compensation, Retention & Cost per Hire' }
  ],
  'crypto-blockchain-tools': [
    { slug: 'staking-yield-mining-returns', name: 'Staking, Yield & Mining Profit' },
    { slug: 'gas-fees-transaction-costs', name: 'Gas Fees & Transaction Costs' },
    { slug: 'dca-portfolio-impermanent-loss', name: 'DCA & Impermanent Loss Calculators' }
  ],
  'agriculture-tools': [
    { slug: 'crop-yield-seeding-rates', name: 'Crop Yield & Seeding Rates' },
    { slug: 'fertilizer-npk-soil-amendments', name: 'Fertilizer, NPK & Soil Amendments' },
    { slug: 'irrigation-livestock-feed', name: 'Irrigation & Livestock Feed' }
  ],
  'printing-tools': [
    { slug: 'resolution-dpi-scaling', name: 'DPI, Print Resolution & Aspect Ratio' },
    { slug: 'page-imposition-booklet-spine', name: 'Booklet Spine & Page Imposition' },
    { slug: 'paper-weight-ink-coverage', name: 'Paper Weight, Reams & Ink Coverage' }
  ],
  'elderly-care-tools': [
    { slug: 'medication-pill-scheduling', name: 'Medication Schedules & Pill Trackers' },
    { slug: 'caregiver-shifts-support-planning', name: 'Caregiver Shifts & Support Planning' },
    { slug: 'home-safety-fall-risk', name: 'Home Safety, Vital Signs & Fall Risk' }
  ],
  'volunteer-tools': [
    { slug: 'volunteer-hours-shift-scheduling', name: 'Volunteer Hours & Shift Scheduling' },
    { slug: 'fundraising-campaign-donations', name: 'Fundraising Goals & Donor Tracking' },
    { slug: 'event-volunteer-coordination', name: 'Event Volunteers & Impact Metrics' }
  ]
};

// Check for slug uniqueness
const allSubcatSlugs = new Set(existingSubcatSlugs);
const collisions = [];
for (const [catSlug, subcats] of Object.entries(newCategorySubcategories)) {
  for (const s of subcats) {
    if (allSubcatSlugs.has(s.slug)) {
      collisions.push({ cat: catSlug, subcat: s.slug });
    }
    allSubcatSlugs.add(s.slug);
  }
}

console.log('Total new subcategories:', Object.values(newCategorySubcategories).reduce((sum, list) => sum + list.length, 0));
console.log('Subcategory slug collisions:', collisions);

fs.writeFileSync('scripts/new_subcategories.json', JSON.stringify(newCategorySubcategories, null, 2));
