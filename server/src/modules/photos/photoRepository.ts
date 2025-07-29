import { supabase } from '../../../database/supabase';

export type Photo = {
  id: number;
  title: string;
  url: string;
  price: number;
  gallery_id: number;
  location_id: number;
};

export const PhotoRepository = {
  // Le C du CRUD - Create
  async create(photo: Omit<Photo, "id">): Promise<number> {
    const { data, error } = await supabase
      .from('photos')
      .insert([photo])
      .select('id')  // On récupère uniquement l'id
      .single();     // Pour éviter un tableau

    if (error) throw error;
    return data.id;
  },

  // Le U du CRUD - Update
  async update(photo: Photo): Promise<number> {
    const { data, error } = await supabase
      .from('photos')
      .update({
        title: photo.title,
        url: photo.url,
        price: photo.price,
        gallery_id: photo.gallery_id,
        location_id: photo.location_id
      })
      .eq('id', photo.id)
      .select('id'); // Pour vérifier qu’on a bien mis à jour quelque chose

    if (error) throw error;
    return data.length; // nombre de lignes affectées (0 ou 1)
  },

  // Le R du CRUD - Read
  async read(id: number): Promise<Photo | null> {
    const { data, error } = await supabase
      .from('photos')
      .select('*')
      .eq('id', id)
      .single();

    if (error?.code === 'PGRST116') return null; // Not found
    if (error) throw error;
    return data;
  },
  
  async readAll(): Promise<Photo[]> {
    const { data, error } = await supabase
      .from('photos')
      .select('*');

    if (error) throw error;
    return data;
  },

  // Le D du CRUD - Delete
  async delete(id: number): Promise<boolean> {
    const { error, count } = await supabase
      .from('photos')
      .delete()
      .eq('id', id)
      .select('id');

    if (error) throw error;
    return (count ?? 0) > 0;
  },
};

export default PhotoRepository;