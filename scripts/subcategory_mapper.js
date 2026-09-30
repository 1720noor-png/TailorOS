import fs from 'fs';
import path from 'path';

// Existing subcategories from the 31 already structured categories
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

// Read all existing tools
const regPath = path.resolve('src/data/registry.js');
const regContent = fs.readFileSync(regPath, 'utf8');

const toolsStartIndex = regContent.indexOf('export const tools = [');
const toolsEndIndex = regContent.indexOf('\nexport const related = ', toolsStartIndex);
let toolsText = regContent.substring(toolsStartIndex + 'export const tools = '.length, toolsEndIndex).trim();
const safeToolsText = toolsText.replace(/Component:\s*([A-Za-z0-9_]+)/g, 'Component: "$1"');
const rawTools = new Function(`return ${safeToolsText};`)();
const tools = rawTools.filter(Boolean);

console.log('Tools loaded:', tools.length);
