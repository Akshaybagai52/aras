import { supabase } from './db';
import { NGO } from '@/types/ngo';

export async function getAllNGOs(): Promise<NGO[]> {
  const { data, error } = await supabase
    .from('ngos')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching NGOs:', error);
    throw new Error('Failed to fetch NGOs');
  }

  return data || [];
}

export async function getNGOById(id: string): Promise<NGO | null> {
  const { data, error } = await supabase
    .from('ngos')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching NGO:', error);
    return null;
  }

  return data;
}
