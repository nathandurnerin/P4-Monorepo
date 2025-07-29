import { supabase } from '../../../database/supabase';

export type Gallery = {
  id: number;
  title: string;
};

export const galleryRepository = {

  // Le C du CRUD - Create
  async create(gallery: Omit<Gallery, "id">): Promise<number> {
    const { data, error } = await supabase
      .from('galleries')
      .insert([gallery])
      .select('id')  // On récupère uniquement l'id
      .single();     // Pour éviter un tableau

    if (error) throw error;
    return data.id;
  },

   // Le R du CRUD - Read
    async read(id: number): Promise<Gallery | null> {
      const { data, error } = await supabase
        .from('galleries')
        .select('*')
        .eq('id', id)
        .single();
  
      if (error?.code === 'PGRST116') return null; // Not found
      if (error) throw error;
      return data;
    },

  async readAll(): Promise<Gallery[]> {
    const { data, error } = await supabase
      .from('galleries')
      .select('*');

    if (error) throw error;
    return data;
  },

  // Le U du CRUD - Update
    async update(gallery: Gallery): Promise<number> {
      const { data, error } = await supabase
        .from('galleries')
        .update({
          title: gallery.title,
        })
        .eq('id', gallery.id)
        .select('id'); // Pour vérifier qu’on a bien mis à jour quelque chose
  
      if (error) throw error;
      return data?.length ?? 0; // nombre de lignes affectées (0 ou 1)
    },

    // Le D du CRUD - Delete
  async delete(id: number): Promise<boolean> {
    const { error, count } = await supabase
      .from('galleries')
      .delete()
      .eq('id', id)
      .select('id');

    if (error) throw error;
    return (count ?? 0) > 0;
  },
};

export default galleryRepository;
