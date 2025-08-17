import { supabase } from '../lib/supabase';

interface OldStoredLogo {
  id: string;
  name: string;
  color: string;
  imageDataUrl?: string;
  createdAt: string;
}

interface MigrationResult {
  success: boolean;
  migratedCount: number;
  errors: string[];
}

/**
 * Migrates logos from localStorage to Supabase
 * This should be run once when upgrading to the new system
 */
export async function migrateLogosFromLocalStorage(): Promise<MigrationResult> {
  const result: MigrationResult = {
    success: true,
    migratedCount: 0,
    errors: []
  };

  try {
    // Get existing localStorage data
    const localStorageKey = 'trustedlogos.logos.v1';
    const rawData = localStorage.getItem(localStorageKey);
    
    if (!rawData) {
      console.log('No localStorage data found to migrate');
      return result;
    }

    const oldLogos: OldStoredLogo[] = JSON.parse(rawData);
    console.log(`Found ${oldLogos.length} logos to migrate`);

    // Migrate each logo
    for (const oldLogo of oldLogos) {
      try {
        // Convert old format to new format
        const newLogoData = {
          name: oldLogo.name,
          type: 'Wordmarks', // Default type since old data doesn't have this
          industry: 'Technology', // Default industry since old data doesn't have this
          primary_color: oldLogo.color,
          secondary_color: '#ffffff',
          shape: 'rectangle', // Default shape since old data doesn't have this
          information: `Migrated from localStorage. Original ID: ${oldLogo.id}`,
          designer_url: null,
          image_path: null, // We can't migrate imageDataUrl to proper storage easily
          image_name: null,
          file_size: null,
          file_type: null,
          is_public: true,
          downloads: 0,
          likes: 0,
        };

        // Insert into Supabase
        const { error } = await supabase
          .from('logos')
          .insert(newLogoData);

        if (error) {
          throw error;
        }

        result.migratedCount++;
        console.log(`Migrated logo: ${oldLogo.name}`);
      } catch (error) {
        const errorMsg = `Failed to migrate ${oldLogo.name}: ${error instanceof Error ? error.message : 'Unknown error'}`;
        result.errors.push(errorMsg);
        console.error(errorMsg);
      }
    }

    // If migration was successful, optionally clear localStorage
    if (result.errors.length === 0) {
      const shouldClear = confirm(
        `Successfully migrated ${result.migratedCount} logos to Supabase. ` +
        'Do you want to clear the old localStorage data? ' +
        'This is recommended to avoid conflicts.'
      );
      
      if (shouldClear) {
        localStorage.removeItem(localStorageKey);
        console.log('Cleared localStorage data');
      }
    } else {
      result.success = false;
    }

  } catch (error) {
    result.success = false;
    const errorMsg = `Migration failed: ${error instanceof Error ? error.message : 'Unknown error'}`;
    result.errors.push(errorMsg);
    console.error(errorMsg);
  }

  return result;
}

/**
 * Checks if there's localStorage data that needs migration
 */
export function hasLocalStorageDataToMigrate(): boolean {
  const localStorageKey = 'trustedlogos.logos.v1';
  const rawData = localStorage.getItem(localStorageKey);
  
  if (!rawData) return false;
  
  try {
    const data = JSON.parse(rawData);
    return Array.isArray(data) && data.length > 0;
  } catch {
    return false;
  }
}

/**
 * Development helper: Add sample logos to Supabase for testing
 */
export async function addSampleLogos(): Promise<void> {
  const sampleLogos = [
    {
      name: 'Apple',
      type: 'Pictorial Marks',
      industry: 'Technology',
      primary_color: '#000000',
      secondary_color: '#ffffff',
      shape: 'circle',
      information: 'The Apple logo is one of the most recognizable logos in the world. It represents innovation, simplicity, and premium quality. The bitten apple symbolizes knowledge and discovery.',
      designer_url: 'https://www.apple.com',
      is_public: true,
    },
    {
      name: 'Nike',
      type: 'Abstract Marks',
      industry: 'Fashion',
      primary_color: '#000000',
      secondary_color: '#ffffff',
      shape: 'other',
      information: 'The Nike Swoosh represents motion and speed. Designed by Carolyn Davidson in 1971 for just $35, it has become one of the most valuable logos in the world.',
      designer_url: 'https://www.nike.com',
      is_public: true,
    },
    {
      name: 'Google',
      type: 'Wordmarks',
      industry: 'Technology',
      primary_color: '#4285f4',
      secondary_color: '#ea4335',
      shape: 'rectangle',
      information: 'Google\'s colorful wordmark reflects the company\'s playful and innovative spirit. The multicolored letters represent diversity and creativity in technology.',
      designer_url: 'https://www.google.com',
      is_public: true,
    }
  ];

  for (const logo of sampleLogos) {
    const { error } = await supabase
      .from('logos')
      .insert(logo);
    
    if (error) {
      console.error(`Failed to add sample logo ${logo.name}:`, error);
    } else {
      console.log(`Added sample logo: ${logo.name}`);
    }
  }
}