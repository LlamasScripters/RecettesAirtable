import Airtable from 'airtable';
import dotenv from 'dotenv';

dotenv.config();

// Configuration Airtable
const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID || 'appDPpmW0k6KYVeVe';

// Logs de débogage
console.log('🔧 Configuration Airtable:');
console.log('- API Key présente:', !!AIRTABLE_API_KEY);
console.log('- API Key longueur:', AIRTABLE_API_KEY?.length || 0);
console.log('- Base ID:', AIRTABLE_BASE_ID);

if (!AIRTABLE_API_KEY) {
  throw new Error('AIRTABLE_API_KEY environment variable is required');
}

// Initialisation de la base Airtable
Airtable.configure({
  endpointUrl: 'https://api.airtable.com',
  apiKey: AIRTABLE_API_KEY
});

const base = Airtable.base(AIRTABLE_BASE_ID);

// Export des tables
export const tables = {
  recipes: base('Recettes'),
  ingredients: base('Ingrédients'),
  typesPlats: base('TypesPlats'),
  allergenes: base('Allergènes')
} as const;

export { base };
export default base; 