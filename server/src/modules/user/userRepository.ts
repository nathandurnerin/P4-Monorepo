import { supabase } from '../../../database/supabase';

export type User = {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  password_hash?: string;
  is_admin: boolean;
  is_actif: boolean;
};

class UserRepository {
  // CREATE
  async create(user: Omit<User, "id">): Promise<number> {
    const { data, error } = await supabase
      .from('users')
      .insert([user])
      .select('id')
      .single();

    if (error) {
      console.error("Erreur d'insertion Supabase :", error);
      throw error;
    }

    return data.id;
  }

  // READ one
  async read(id: number): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error?.code === 'PGRST116') return null; // Not found
    if (error) throw error;

    return data;
  }

  // READ all
  async readAll(): Promise<User[]> {
    const { data, error } = await supabase
      .from('users')
      .select('*');

    if (error) throw error;
    return data;
  }

  // UPDATE
  async update(user: User): Promise<number> {
    const { data, error } = await supabase
      .from('users')
      .update({
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        password_hash: user.password_hash,
        is_actif: user.is_actif,
        is_admin: user.is_admin,
      })
      .eq('id', user.id)
      .select('id');

    if (error) throw error;

    return data.length; // nombre de lignes affectées (0 ou 1)
  }

  // DELETE
  async delete(id: number): Promise<number> {
    const { data, error } = await supabase
      .from('users')
      .delete()
      .eq('id', id)
      .select('id');

    if (error) throw error;

    return data.length;
  }

  async findByEmail(email: string): Promise<User | null> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();

  if (error?.code === 'PGRST116') return null; // utilisateur non trouvé
  if (error) throw error;

  return data;
}
}

export default new UserRepository();
