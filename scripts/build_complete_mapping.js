import fs from 'fs';

const toolsByCat = JSON.parse(fs.readFileSync('scripts/all_tools_for_41_cats.json', 'utf8'));
const newSubcats = JSON.parse(fs.readFileSync('scripts/new_subcategories.json', 'utf8'));

// Build classification rules per category using keyword & slug heuristics with fallback
const completeToolMap = {};

for (const [catSlug, toolsList] of Object.entries(toolsByCat)) {
  const subcatList = newSubcats[catSlug];
  if (!subcatList || subcatList.length === 0) continue;

  for (let i = 0; i < toolsList.length; i++) {
    const t = toolsList[i];
    const text = `${t.slug} ${t.name} ${t.desc || ''} ${t.keywords || ''} ${t.why || ''}`.toLowerCase();
    
    // Choose the best matching subcategory
    let chosenSubcat = subcatList[0]; // default
    
    if (catSlug === 'career-tools') {
      if (text.includes('resume') || text.includes('cv')) chosenSubcat = subcatList.find(s => s.slug === 'resume-cv') || subcatList[0];
      else if (text.includes('interview') || text.includes('salary') || text.includes('negotiation') || text.includes('coach') || text.includes('prep')) chosenSubcat = subcatList.find(s => s.slug === 'career-planning-prep') || subcatList[0];
      else chosenSubcat = subcatList.find(s => s.slug === 'job-applications') || subcatList[0];
    } else if (catSlug === 'writing-tools') {
      if (text.includes('blog') || text.includes('article') || text.includes('headline') || text.includes('prompt')) chosenSubcat = subcatList.find(s => s.slug === 'content-creation') || subcatList[0];
      else if (text.includes('grammar') || text.includes('spelling') || text.includes('paraphras') || text.includes('summar') || text.includes('email') || text.includes('writer')) chosenSubcat = subcatList.find(s => s.slug === 'writing-editing') || subcatList[0];
      else if (text.includes('density') || text.includes('passive') || text.includes('readability') || text.includes('cliche') || text.includes('sentence-analyzer') || text.includes('syllable')) chosenSubcat = subcatList.find(s => s.slug === 'style-readability') || subcatList[0];
      else chosenSubcat = subcatList.find(s => s.slug === 'text-formatting-utilities') || subcatList[0];
    } else if (catSlug === 'pdf-tools') {
      if (text.includes('convert') || text.includes('images-to-pdf') || text.includes('pdf-to-images')) chosenSubcat = subcatList.find(s => s.slug === 'pdf-conversion-export') || subcatList[0];
      else if (text.includes('text') || text.includes('extract') || text.includes('password') || text.includes('security')) chosenSubcat = subcatList.find(s => s.slug === 'pdf-text-security') || subcatList[0];
      else chosenSubcat = subcatList.find(s => s.slug === 'pdf-management') || subcatList[0];
    } else if (catSlug === 'image-tools') {
      if (text.includes('convert') || text.includes('compress') || text.includes('format') || text.includes('svg') || text.includes('base64')) chosenSubcat = subcatList.find(s => s.slug === 'image-conversion-format') || subcatList[0];
      else if (text.includes('ocr') || text.includes('palette') || text.includes('color') || text.includes('extract')) chosenSubcat = subcatList.find(s => s.slug === 'image-analysis-ocr') || subcatList[0];
      else chosenSubcat = subcatList.find(s => s.slug === 'image-editing-effects') || subcatList[0];
    } else if (catSlug === 'media-tools') {
      if (text.includes('speech') || text.includes('tts') || text.includes('audio') || text.includes('reader')) chosenSubcat = subcatList.find(s => s.slug === 'audio-media-speech') || subcatList[0];
      else chosenSubcat = subcatList.find(s => s.slug === 'voice-transcription-media') || subcatList[0];
    } else if (catSlug === 'food-nutrition-tools') {
      if (text.includes('meal') || text.includes('calorie') || text.includes('diet') || text.includes('nutrition')) chosenSubcat = subcatList.find(s => s.slug === 'nutrition-meal-planning') || subcatList[0];
      else if (text.includes('recipe') || text.includes('servings') || text.includes('wine') || text.includes('pizza') || text.includes('substitut')) chosenSubcat = subcatList.find(s => s.slug === 'cooking-recipes') || subcatList[0];
      else chosenSubcat = subcatList.find(s => s.slug === 'kitchen-conversions-guides') || subcatList[0];
    } else if (catSlug === 'health-wellness-tools') {
      if (text.includes('bmi') || text.includes('bmr') || text.includes('tdee') || text.includes('body-fat') || text.includes('ideal-body') || text.includes('navy')) chosenSubcat = subcatList.find(s => s.slug === 'body-metrics-health') || subcatList[0];
      else if (text.includes('blood-pressure') || text.includes('heart-rate') || text.includes('period') || text.includes('ovulation') || text.includes('pregnancy') || text.includes('smoke-free')) chosenSubcat = subcatList.find(s => s.slug === 'health-monitoring-tracking') || subcatList[0];
      else chosenSubcat = subcatList.find(s => s.slug === 'wellness-routine-planning') || subcatList[0];
    } else if (catSlug === 'student-tools') {
      if (text.includes('gpa') || text.includes('grade') || text.includes('percentage') || text.includes('test-score') || text.includes('scale') || text.includes('curve')) chosenSubcat = subcatList.find(s => s.slug === 'academic-grades-gpa') || subcatList[0];
      else if (text.includes('attendance') || text.includes('college-cost') || text.includes('student-loan') || text.includes('group-project') || text.includes('deadline') || text.includes('timetable')) chosenSubcat = subcatList.find(s => s.slug === 'classroom-attendance-planning') || subcatList[0];
      else if (text.includes('citation') || text.includes('essay') || text.includes('bibliography') || text.includes('lecture-notes') || text.includes('word-count')) chosenSubcat = subcatList.find(s => s.slug === 'assignments-writing-prep') || subcatList[0];
      else chosenSubcat = subcatList.find(s => s.slug === 'study-learning-management') || subcatList[0];
    } else if (catSlug === 'developer-tools') {
      if (text.includes('css') || text.includes('color') || text.includes('shadow') || text.includes('gradient') || text.includes('favicon') || text.includes('open-graph') || text.includes('meta-tag') || text.includes('html') || text.includes('svg') || text.includes('px-to-rem') || text.includes('robots')) chosenSubcat = subcatList.find(s => s.slug === 'web-frontend-styling') || subcatList[0];
      else if (text.includes('hash') || text.includes('base64') || text.includes('url-encode') || text.includes('key-gen') || text.includes('cipher') || text.includes('crypto')) chosenSubcat = subcatList.find(s => s.slug === 'encoding-hashing-security') || subcatList[0];
      else if (text.includes('regex') || text.includes('diff') || text.includes('unicode') || text.includes('string-escape') || text.includes('text')) chosenSubcat = subcatList.find(s => s.slug === 'regex-text-developer-tools') || subcatList[0];
      else if (text.includes('jwt') || text.includes('user-agent') || text.includes('http-status') || text.includes('cron') || text.includes('curl') || text.includes('git') || text.includes('chmod') || text.includes('timestamp') || text.includes('semver') || text.includes('htaccess')) chosenSubcat = subcatList.find(s => s.slug === 'network-api-data-inspection') || subcatList[0];
      else if (text.includes('uuid') || text.includes('lorem') || text.includes('random') || text.includes('schema') || text.includes('placeholder')) chosenSubcat = subcatList.find(s => s.slug === 'data-generators-mocks') || subcatList[0];
      else chosenSubcat = subcatList.find(s => s.slug === 'code-formatting-transform') || subcatList[0];
    } else if (catSlug === 'office-tools') {
      if (text.includes('salary') || text.includes('wage') || text.includes('hourly') || text.includes('payroll') || text.includes('timesheet') || text.includes('payslip') || text.includes('overtime') || text.includes('expense') || text.includes('per-diem') || text.includes('mileage') || text.includes('petty-cash') || text.includes('comp-time')) chosenSubcat = subcatList.find(s => s.slug === 'workplace-compensation-payroll') || subcatList[0];
      else if (text.includes('meeting') || text.includes('agenda') || text.includes('minutes')) chosenSubcat = subcatList.find(s => s.slug === 'meeting-productivity-tools') || subcatList[0];
      else if (text.includes('leave') || text.includes('pto') || text.includes('checklist') || text.includes('onboarding') || text.includes('document-checklist')) chosenSubcat = subcatList.find(s => s.slug === 'office-checklists-management') || subcatList[0];
      else chosenSubcat = subcatList.find(s => s.slug === 'business-communications-forms') || subcatList[0];
    } else if (catSlug === 'marketing-tools') {
      if (text.includes('meta') || text.includes('title') || text.includes('keyword') || text.includes('seo')) chosenSubcat = subcatList.find(s => s.slug === 'seo-content-optimization') || subcatList[0];
      else if (text.includes('utm') || text.includes('qr') || text.includes('ad-copy') || text.includes('cpc') || text.includes('roas') || text.includes('ctr') || text.includes('cpm') || text.includes('conversion') || text.includes('budget') || text.includes('a-b-test')) chosenSubcat = subcatList.find(s => s.slug === 'campaign-tracking-advertising') || subcatList[0];
      else chosenSubcat = subcatList.find(s => s.slug === 'branding-social-marketing') || subcatList[0];
    } else if (catSlug === 'productivity-tools') {
      if (text.includes('habit') || text.includes('planner') || text.includes('checklist') || text.includes('goals') || text.includes('eisenhower') || text.includes('matrix') || text.includes('streak') || text.includes('to-do') || text.includes('priority')) chosenSubcat = subcatList.find(s => s.slug === 'planning-goal-tracking') || subcatList[0];
      else if (text.includes('timer') || text.includes('stopwatch') || text.includes('countdown') || text.includes('clock') || text.includes('pomodoro') || text.includes('break') || text.includes('standup') || text.includes('focus') || text.includes('time-zone')) chosenSubcat = subcatList.find(s => s.slug === 'time-focus-management') || subcatList[0];
      else chosenSubcat = subcatList.find(s => s.slug === 'workflow-randomizers-utilities') || subcatList[0];
    } else if (catSlug === 'shopping-tools') {
      if (text.includes('tax') || text.includes('vat') || text.includes('tip') || text.includes('shipping') || text.includes('fuel')) chosenSubcat = subcatList.find(s => s.slug === 'tax-fees-shipping-costs') || subcatList[0];
      else if (text.includes('discount') || text.includes('markup') || text.includes('margin') || text.includes('coupon') || text.includes('bulk')) chosenSubcat = subcatList.find(s => s.slug === 'discounts-savings-calculators') || subcatList[0];
      else chosenSubcat = subcatList.find(s => s.slug === 'budgeting-shopping-planners') || subcatList[0];
    } else if (catSlug === 'security-tools') {
      if (text.includes('password') || text.includes('passphrase') || text.includes('pin')) chosenSubcat = subcatList.find(s => s.slug === 'password-credential-generators') || subcatList[0];
      else if (text.includes('hash') || text.includes('cipher') || text.includes('encryption')) chosenSubcat = subcatList.find(s => s.slug === 'cryptographic-hashing-ciphers') || subcatList[0];
      else chosenSubcat = subcatList.find(s => s.slug === 'security-auditing-checks') || subcatList[0];
    } else if (catSlug === 'real-estate-tools') {
      if (text.includes('mortgage') || text.includes('rent-vs-buy') || text.includes('equity') || text.includes('closing') || text.includes('tax-escrow')) chosenSubcat = subcatList.find(s => s.slug === 'mortgage-financing-equity') || subcatList[0];
      else if (text.includes('rental') || text.includes('lease') || text.includes('late-fee') || text.includes('vacancy') || text.includes('property-management') || text.includes('landlord')) chosenSubcat = subcatList.find(s => s.slug === 'rental-cashflow-landlord') || subcatList[0];
      else chosenSubcat = subcatList.find(s => s.slug === 'property-valuation-roi') || subcatList[0];
    } else if (catSlug === 'insurance-tools') {
      if (text.includes('life') || text.includes('disability') || text.includes('health') || text.includes('oop')) chosenSubcat = subcatList.find(s => s.slug === 'life-health-disability-needs') || subcatList[0];
      else if (text.includes('auto') || text.includes('homeowner') || text.includes('renter')) chosenSubcat = subcatList.find(s => s.slug === 'property-auto-coverage') || subcatList[0];
      else chosenSubcat = subcatList.find(s => s.slug === 'deductibles-costs-planning') || subcatList[0];
    } else if (catSlug === 'retirement-planning-tools') {
      if (text.includes('social-security') || text.includes('pension')) chosenSubcat = subcatList.find(s => s.slug === 'social-security-pension-benefits') || subcatList[0];
      else if (text.includes('401k') || text.includes('ira') || text.includes('savings-rate') || text.includes('catch-up') || text.includes('match')) chosenSubcat = subcatList.find(s => s.slug === 'savings-401k-contributions') || subcatList[0];
      else if (text.includes('rmd') || text.includes('withdrawal') || text.includes('healthcare') || text.includes('income')) chosenSubcat = subcatList.find(s => s.slug === 'drawdown-rmd-healthcare') || subcatList[0];
      else chosenSubcat = subcatList.find(s => s.slug === 'retirement-milestones-fire') || subcatList[0];
    } else if (catSlug === 'education-tools') {
      if (text.includes('seating') || text.includes('attendance') || text.includes('classroom-timer') || text.includes('behavior') || text.includes('parent-teacher')) chosenSubcat = subcatList.find(s => s.slug === 'classroom-management-attendance') || subcatList[0];
      else if (text.includes('rubric') || text.includes('lesson-plan') || text.includes('test-weight') || text.includes('grade-dist') || text.includes('curriculum') || text.includes('report-card')) chosenSubcat = subcatList.find(s => s.slug === 'grading-curriculum-planning') || subcatList[0];
      else chosenSubcat = subcatList.find(s => s.slug === 'academic-study-aids') || subcatList[0];
    } else if (catSlug === 'legal-tools') {
      if (text.includes('compliance') || text.includes('cookie') || text.includes('privacy-policy') || text.includes('trademark') || text.includes('statute')) chosenSubcat = subcatList.find(s => s.slug === 'compliance-audit-checklists') || subcatList[0];
      else if (text.includes('deadline') || text.includes('severance') || text.includes('billing') || text.includes('settlement')) chosenSubcat = subcatList.find(s => s.slug === 'legal-fee-settlement-calculators') || subcatList[0];
      else chosenSubcat = subcatList.find(s => s.slug === 'contract-document-templates') || subcatList[0];
    } else if (catSlug === 'freelance-tools') {
      if (text.includes('rate') || text.includes('cost-estimator') || text.includes('retainer') || text.includes('revision-fee') || text.includes('utilization')) chosenSubcat = subcatList.find(s => s.slug === 'pricing-hourly-rates') || subcatList[0];
      else if (text.includes('tax') || text.includes('emergency-fund') || text.includes('margin') || text.includes('mileage') || text.includes('pto')) chosenSubcat = subcatList.find(s => s.slug === 'freelance-tax-finances') || subcatList[0];
      else chosenSubcat = subcatList.find(s => s.slug === 'invoicing-payment-contracts') || subcatList[0];
    } else if (catSlug === 'social-media-tools') {
      if (text.includes('bio')) chosenSubcat = subcatList.find(s => s.slug === 'bio-profile-optimization') || subcatList[0];
      else if (text.includes('engagement') || text.includes('influencer') || text.includes('audit') || text.includes('click-through') || text.includes('growth')) chosenSubcat = subcatList.find(s => s.slug === 'engagement-metrics-analytics') || subcatList[0];
      else if (text.includes('calendar') || text.includes('schedule') || text.includes('post-preview') || text.includes('best-time') || text.includes('aspect-ratio') || text.includes('length')) chosenSubcat = subcatList.find(s => s.slug === 'content-scheduling-planners') || subcatList[0];
      else chosenSubcat = subcatList.find(s => s.slug === 'captions-hashtag-generation') || subcatList[0];
    } else if (catSlug === 'data-tools') {
      if (text.includes('delimiter') || text.includes('deduplicat') || text.includes('sorter') || text.includes('normaliz')) chosenSubcat = subcatList.find(s => s.slug === 'data-cleansing-transformation') || subcatList[0];
      else if (text.includes('sample') || text.includes('sampler') || text.includes('boxplot') || text.includes('summary')) chosenSubcat = subcatList.find(s => s.slug === 'data-sampling-randomization') || subcatList[0];
      else chosenSubcat = subcatList.find(s => s.slug === 'statistics-correlation-analysis') || subcatList[0];
    } else if (catSlug === 'ecommerce-tools') {
      if (text.includes('pricing') || text.includes('margin') || text.includes('roas') || text.includes('cac') || text.includes('aov') || text.includes('bundle')) chosenSubcat = subcatList.find(s => s.slug === 'product-pricing-profitability') || subcatList[0];
      else if (text.includes('fee') || text.includes('shipping') || text.includes('break-even') || text.includes('fba') || text.includes('shopify') || text.includes('etsy') || text.includes('ebay')) chosenSubcat = subcatList.find(s => s.slug === 'order-shipping-fulfillment') || subcatList[0];
      else chosenSubcat = subcatList.find(s => s.slug === 'inventory-store-operations') || subcatList[0];
    } else if (catSlug === 'sustainability-tools') {
      if (text.includes('water') || text.includes('food-waste') || text.includes('plastic') || text.includes('rainwater') || text.includes('compost') || text.includes('paper')) chosenSubcat = subcatList.find(s => s.slug === 'waste-water-conservation') || subcatList[0];
      else if (text.includes('car') || text.includes('offset') || text.includes('tree') || text.includes('insulation') || text.includes('diet') || text.includes('eco-footprint')) chosenSubcat = subcatList.find(s => s.slug === 'eco-lifestyle-offsets') || subcatList[0];
      else chosenSubcat = subcatList.find(s => s.slug === 'carbon-energy-footprint') || subcatList[0];
    } else if (catSlug === 'presentation-tools') {
      if (text.includes('speech') || text.includes('timer') || text.includes('pitch') || text.includes('poll') || text.includes('icebreaker')) chosenSubcat = subcatList.find(s => s.slug === 'speech-timing-pacing') || subcatList[0];
      else if (text.includes('slide-count') || text.includes('outline') || text.includes('summary') || text.includes('keynote')) chosenSubcat = subcatList.find(s => s.slug === 'slide-structure-planning') || subcatList[0];
      else chosenSubcat = subcatList.find(s => s.slug === 'presentation-design-qa') || subcatList[0];
    } else if (catSlug === 'networking-tools') {
      if (text.includes('bandwidth') || text.includes('download') || text.includes('latency') || text.includes('ping') || text.includes('mtu') || text.includes('voip')) chosenSubcat = subcatList.find(s => s.slug === 'bandwidth-latency-transfer') || subcatList[0];
      else if (text.includes('port') || text.includes('dns') || text.includes('mac-address') || text.includes('wifi')) chosenSubcat = subcatList.find(s => s.slug === 'ports-dns-network-diagnostics') || subcatList[0];
      else chosenSubcat = subcatList.find(s => s.slug === 'ip-subnetting-addressing') || subcatList[0];
    } else if (catSlug === 'typography-tools') {
      if (text.includes('scale') || text.includes('golden') || text.includes('fluid') || text.includes('cap-height')) chosenSubcat = subcatList.find(s => s.slug === 'font-sizing-type-scale') || subcatList[0];
      else if (text.includes('line-height') || text.includes('characters-per-line') || text.includes('vertical-rhythm')) chosenSubcat = subcatList.find(s => s.slug === 'line-height-paragraph-spacing') || subcatList[0];
      else chosenSubcat = subcatList.find(s => s.slug === 'font-pairing-selection') || subcatList[0];
    } else if (catSlug === 'baking-tools') {
      if (text.includes('percentage') || text.includes('hydration') || text.includes('sourdough') || text.includes('dough-temp')) chosenSubcat = subcatList.find(s => s.slug === 'recipe-scaling-bakers-math') || subcatList[0];
      else if (text.includes('pan') || text.includes('oven')) chosenSubcat = subcatList.find(s => s.slug === 'pan-size-oven-conversions') || subcatList[0];
      else chosenSubcat = subcatList.find(s => s.slug === 'ingredient-weight-substitutions') || subcatList[0];
    } else if (catSlug === 'moving-relocation-tools') {
      if (text.includes('cost') || text.includes('budget') || text.includes('truck') || text.includes('tip')) chosenSubcat = subcatList.find(s => s.slug === 'moving-cost-estimation') || subcatList[0];
      else if (text.includes('box') || text.includes('label') || text.includes('storage')) chosenSubcat = subcatList.find(s => s.slug === 'packing-supplies-inventory') || subcatList[0];
      else chosenSubcat = subcatList.find(s => s.slug === 'relocation-checklists-planning') || subcatList[0];
    } else if (catSlug === 'mental-health-tools') {
      if (text.includes('breathing') || text.includes('gratitude') || text.includes('affirmation')) chosenSubcat = subcatList.find(s => s.slug === 'mindfulness-breathing-exercises') || subcatList[0];
      else if (text.includes('mood') || text.includes('self-care') || text.includes('burnout')) chosenSubcat = subcatList.find(s => s.slug === 'mood-emotional-tracking') || subcatList[0];
      else chosenSubcat = subcatList.find(s => s.slug === 'stress-anxiety-management') || subcatList[0];
    } else if (catSlug === 'wedding-tools') {
      if (text.includes('budget') || text.includes('alcohol') || text.includes('tipping')) chosenSubcat = subcatList.find(s => s.slug === 'wedding-budgeting-breakdown') || subcatList[0];
      else if (text.includes('guest') || text.includes('seating') || text.includes('invitation')) chosenSubcat = subcatList.find(s => s.slug === 'guest-list-table-seating') || subcatList[0];
      else chosenSubcat = subcatList.find(s => s.slug === 'vendor-timeline-planning') || subcatList[0];
    } else if (catSlug === 'diy-tools') {
      if (text.includes('angle') || text.includes('miter') || text.includes('screw') || text.includes('drill')) chosenSubcat = subcatList.find(s => s.slug === 'workshop-angles-fasteners') || subcatList[0];
      else if (text.includes('sandpaper') || text.includes('paint') || text.includes('epoxy') || text.includes('budget')) chosenSubcat = subcatList.find(s => s.slug === 'paint-finish-project-planning') || subcatList[0];
      else chosenSubcat = subcatList.find(s => s.slug === 'diy-material-quantities') || subcatList[0];
    } else if (catSlug === 'gaming-tools') {
      if (text.includes('dice') || text.includes('probability') || text.includes('encounter') || text.includes('loot')) chosenSubcat = subcatList.find(s => s.slug === 'dice-randomizers-probability') || subcatList[0];
      else if (text.includes('initiative') || text.includes('stat') || text.includes('point-buy') || text.includes('spell') || text.includes('npc')) chosenSubcat = subcatList.find(s => s.slug === 'ttrpg-character-combat') || subcatList[0];
      else chosenSubcat = subcatList.find(s => s.slug === 'boardgame-scorekeeping-tournaments') || subcatList[0];
    } else if (catSlug === 'travel-planning-tools') {
      if (text.includes('packing') || text.includes('luggage') || text.includes('card') || text.includes('plug')) chosenSubcat = subcatList.find(s => s.slug === 'packing-clothing-lists') || subcatList[0];
      else if (text.includes('currency') || text.includes('jet-lag') || text.includes('flight')) chosenSubcat = subcatList.find(s => s.slug === 'timezone-currency-flight-planning') || subcatList[0];
      else chosenSubcat = subcatList.find(s => s.slug === 'itinerary-trip-budgets') || subcatList[0];
    } else if (catSlug === 'chemistry-tools') {
      if (text.includes('solution') || text.includes('dilution') || text.includes('molarity') || text.includes('ph') || text.includes('buffer')) chosenSubcat = subcatList.find(s => s.slug === 'solution-dilution-molarity') || subcatList[0];
      else if (text.includes('gas') || text.includes('half-life') || text.includes('enthalpy')) chosenSubcat = subcatList.find(s => s.slug === 'gas-laws-thermodynamics') || subcatList[0];
      else chosenSubcat = subcatList.find(s => s.slug === 'molecular-molar-calculations') || subcatList[0];
    } else if (catSlug === 'hr-tools') {
      if (text.includes('pto') || text.includes('attendance') || text.includes('bradford') || text.includes('fmla')) chosenSubcat = subcatList.find(s => s.slug === 'pto-leave-attendance-management') || subcatList[0];
      else if (text.includes('cost-per-hire') || text.includes('turnover') || text.includes('salary-range') || text.includes('retention') || text.includes('overtime')) chosenSubcat = subcatList.find(s => s.slug === 'compensation-turnover-analytics') || subcatList[0];
      else chosenSubcat = subcatList.find(s => s.slug === 'recruitment-interview-scorecards') || subcatList[0];
    } else if (catSlug === 'crypto-blockchain-tools') {
      if (text.includes('gas') || text.includes('wallet') || text.includes('satoshi')) chosenSubcat = subcatList.find(s => s.slug === 'gas-fees-transaction-costs') || subcatList[0];
      else if (text.includes('impermanent') || text.includes('dca') || text.includes('tax') || text.includes('fear')) chosenSubcat = subcatList.find(s => s.slug === 'dca-portfolio-impermanent-loss') || subcatList[0];
      else chosenSubcat = subcatList.find(s => s.slug === 'staking-yield-mining-returns') || subcatList[0];
    } else if (catSlug === 'agriculture-tools') {
      if (text.includes('fertilizer') || text.includes('soil') || text.includes('spray') || text.includes('pesticide')) chosenSubcat = subcatList.find(s => s.slug === 'fertilizer-npk-soil-amendments') || subcatList[0];
      else if (text.includes('irrigation') || text.includes('livestock') || text.includes('pasture')) chosenSubcat = subcatList.find(s => s.slug === 'irrigation-livestock-feed') || subcatList[0];
      else chosenSubcat = subcatList.find(s => s.slug === 'crop-yield-seeding-rates') || subcatList[0];
    } else if (catSlug === 'printing-tools') {
      if (text.includes('bleed') || text.includes('dpi') || text.includes('poster')) chosenSubcat = subcatList.find(s => s.slug === 'resolution-dpi-scaling') || subcatList[0];
      else if (text.includes('booklet') || text.includes('spine')) chosenSubcat = subcatList.find(s => s.slug === 'page-imposition-booklet-spine') || subcatList[0];
      else chosenSubcat = subcatList.find(s => s.slug === 'paper-weight-ink-coverage') || subcatList[0];
    } else if (catSlug === 'elderly-care-tools') {
      if (text.includes('medication') || text.includes('pill')) chosenSubcat = subcatList.find(s => s.slug === 'medication-pill-scheduling') || subcatList[0];
      else if (text.includes('shift') || text.includes('emergency') || text.includes('cost') || text.includes('appointment')) chosenSubcat = subcatList.find(s => s.slug === 'caregiver-shifts-support-planning') || subcatList[0];
      else chosenSubcat = subcatList.find(s => s.slug === 'home-safety-fall-risk') || subcatList[0];
    } else if (catSlug === 'volunteer-tools') {
      if (text.includes('hours') || text.includes('shift') || text.includes('community')) chosenSubcat = subcatList.find(s => s.slug === 'volunteer-hours-shift-scheduling') || subcatList[0];
      else if (text.includes('event') || text.includes('impact')) chosenSubcat = subcatList.find(s => s.slug === 'event-volunteer-coordination') || subcatList[0];
      else chosenSubcat = subcatList.find(s => s.slug === 'fundraising-campaign-donations') || subcatList[0];
    } else {
      // Fallback: cycle through subcategories evenly
      chosenSubcat = subcatList[i % subcatList.length];
    }

    completeToolMap[t.slug] = {
      subcat: chosenSubcat.slug,
      subcatName: chosenSubcat.name
    };
  }
}

// Verify every tool in 41 categories has an assignment and each subcategory has >= 1 tool
let allToolsAssigned = true;
const subcatCounts = {};
for (const [catSlug, toolsList] of Object.entries(toolsByCat)) {
  const subcatList = newSubcats[catSlug];
  for (const s of subcatList) {
    subcatCounts[s.slug] = 0;
  }
  for (const t of toolsList) {
    const assigned = completeToolMap[t.slug];
    if (!assigned) {
      console.error(`Tool ${t.slug} in ${catSlug} not assigned!`);
      allToolsAssigned = false;
    } else {
      subcatCounts[assigned.subcat] = (subcatCounts[assigned.subcat] || 0) + 1;
    }
  }
}

console.log('All tools assigned successfully?', allToolsAssigned);
const emptySubcats = Object.entries(subcatCounts).filter(([_, count]) => count === 0);
console.log('Empty subcategories count:', emptySubcats.length);
if (emptySubcats.length > 0) {
  console.log('Empty subcategories:', emptySubcats);
}

fs.writeFileSync('scripts/complete_tool_mapping.json', JSON.stringify(completeToolMap, null, 2));
console.log('Saved scripts/complete_tool_mapping.json with', Object.keys(completeToolMap).length, 'entries.');
