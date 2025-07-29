import { supabase } from '../../../database/supabase';

export type Location = {
  id: number;
  title: string;
};

export const locationRepository = {

  // Le C du CRUD - Create
  async create(location: Omit<Location, "id">): Promise<number> {
    const { data, error } = await supabase
      .from('location')
      .insert([location])
      .select('id')  // On récupère uniquement l'id
      .single();     // Pour éviter un tableau

    if (error) throw error;
    return data.id;
  },

   // Le R du CRUD - Read
    async read(id: number): Promise<Location | null> {
      const { data, error } = await supabase
        .from('location')
        .select('*')
        .eq('id', id)
        .single();
  
      if (error?.code === 'PGRST116') return null; // Not found
      if (error) throw error;
      return data;
    },

  async readAll(): Promise<Location[]> {
    const { data, error } = await supabase
      .from('location')
      .select('*');

    if (error) throw error;
    return data;
  },

  // Le U du CRUD - Update
    async update(location: Location): Promise<number> {
      const { data, error } = await supabase
        .from('location')
        .update({
          title: location.title,
        })
        .eq('id', location.id)
        .select('id'); // Pour vérifier qu’on a bien mis à jour quelque chose
  
      if (error) throw error;
      return data?.length ?? 0; // nombre de lignes affectées (0 ou 1)
    },

    // Le D du CRUD - Delete
  async delete(id: number): Promise<boolean> {
    const { error, count } = await supabase
      .from('location')
      .delete()
      .eq('id', id)
      .select('id');

    if (error) throw error;
    return (count ?? 0) > 0;
  },
};

export default locationRepository;
