import fs from 'fs';
import path from 'path';

const localesDir = './src/i18n/locales';
const enFile = path.join(localesDir, 'en.json');
const ruFile = path.join(localesDir, 'ru.json');

// Read EN and RU files
const enData = JSON.parse(fs.readFileSync(enFile, 'utf8'));
const ruData = JSON.parse(fs.readFileSync(ruFile, 'utf8'));

// Get the pricing structure from EN
const enPricing = enData.landing.pricing;

// Get files to update (all except en and ru)
const files = fs.readdirSync(localesDir).filter(f => f.endsWith('.json') && f !== 'en.json' && f !== 'ru.json');

for (const file of files) {
  const filePath = path.join(localesDir, file);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  // Add EN pricing as fallback if not present
  if (!data.landing || !data.landing.pricing) {
    if (!data.landing) data.landing = {};
    data.landing.pricing = JSON.parse(JSON.stringify(enPricing));
  }
  
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
  console.log(`Updated: ${file}`);
}

console.log('Done! All language files updated with pricing translations.');
