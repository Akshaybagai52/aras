import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

const sampleNGOs = [
  {
    name: 'Wildlife SOS Delhi',
    email: 'delhi@wildlifesos.org',
    latitude: 28.6139,
    longitude: 77.2090,
    radius_km: 50
  },
  {
    name: 'Blue Cross of India',
    email: 'contact@bluecrossofindia.org',
    latitude: 13.0827,
    longitude: 80.2707,
    radius_km: 40
  },
  {
    name: 'PETA India',
    email: 'rescue@petaindia.org',
    latitude: 19.0760,
    longitude: 72.8777,
    radius_km: 60
  },
  {
    name: 'Animal Aid Unlimited',
    email: 'help@animalaidunlimited.org',
    latitude: 24.5854,
    longitude: 73.7125,
    radius_km: 45
  },
  {
    name: 'People For Animals Bangalore',
    email: 'bangalore@peopleforanimals.org',
    latitude: 12.9716,
    longitude: 77.5946,
    radius_km: 50
  },
  {
    name: 'Karuna Society for Animals',
    email: 'info@karunasociety.org',
    latitude: 18.5204,
    longitude: 73.8567,
    radius_km: 35
  },
  {
    name: 'Friendicoes SECA',
    email: 'help@friendicoes.org',
    latitude: 28.7041,
    longitude: 77.1025,
    radius_km: 40
  },
  {
    name: 'Visakha SPCA',
    email: 'contact@vspca.org',
    latitude: 17.6869,
    longitude: 83.2185,
    radius_km: 30
  }
];

async function seedNGOs() {
  console.log('Starting NGO seeding...');

  try {
    // Check if NGOs already exist
    const { data: existing, error: checkError } = await supabase
      .from('ngos')
      .select('id')
      .limit(1);

    if (checkError) {
      throw checkError;
    }

    if (existing && existing.length > 0) {
      console.log('NGOs already exist. Skipping seed.');
      return;
    }

    // Insert NGOs
    const { data, error } = await supabase
      .from('ngos')
      .insert(sampleNGOs)
      .select();

    if (error) {
      throw error;
    }

    console.log(`Successfully seeded ${data?.length || 0} NGOs`);
    console.log('NGOs:', data);
  } catch (error) {
    console.error('Error seeding NGOs:', error);
    throw error;
  }
}

// Run the seed function
seedNGOs()
  .then(() => {
    console.log('Seeding completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Seeding failed:', error);
    process.exit(1);
  });
