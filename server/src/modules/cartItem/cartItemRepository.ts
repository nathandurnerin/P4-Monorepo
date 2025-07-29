import { supabase } from "../../../database/supabase";

export type CartItem = {
   id: number;
   user_id: number;
   quantity: number;
   unit_price: number;
   photo_id: number;
   status?: string
}

export type CartItemWithPhoto = CartItem & {
  photo: {
    id: number;
    title: string;
    url: string;
    price: number;
  };
};


const CartItemRepository = {
   async create(cartItem: Omit<CartItem, 'id'>): Promise<number> {
  // Vérifie s’il existe déjà un item similaire
  const { data: existingItem, error: readError } = await supabase
    .from('cart_items')
    .select('*')
    .eq('user_id', cartItem.user_id)
    .eq('photo_id', cartItem.photo_id)
    .single();

  if (readError && readError.code !== 'PGRST116') {
    // erreur sauf si c’est juste "not found"
    throw readError;
  }

  if (existingItem) {
    // 🔁 Il existe déjà → on met à jour la quantité
    const newQuantity = existingItem.quantity + cartItem.quantity;

    const { error: updateError } = await supabase
      .from('cart_items')
      .update({ quantity: newQuantity })
      .eq('id', existingItem.id);

    if (updateError) throw updateError;

    return existingItem.id;
  }

  // 🆕 Sinon on insère
  const { data, error } = await supabase
    .from('cart_items')
    .insert([cartItem])
    .select('id')
    .single();

  if (error) throw error;
  return data.id;
},

async readByUser(userId: number): Promise<CartItemWithPhoto[]> {
   const { data, error } = await supabase
   .from("cart_items")
   .select("*, photo:photo_id(*)")
   .eq("user_id", userId)
   .returns<CartItemWithPhoto[]>();

   if (error) throw error;
   return data ?? [];
},

async updateStatus(cartItemId: number, status: string): Promise<boolean> {
    const { error, data } = await supabase
      .from("cart_items")
      .update({ status })
      .eq("id", cartItemId)
      .select("id");

    if (error) throw error;
    return !!data.length;
  },

  async updateQuantity(cartItemId: number, quantity: number): Promise<boolean> {
  const { data, error } = await supabase
    .from("cart_items")
    .update({ quantity })
    .eq("id", cartItemId)
    .select("id");

  if (error) throw error;
  return !!data?.length;
},


async delete(cartItem: number): Promise<boolean> {
   const { data, error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', cartItem)
      .select('id');

   if (error) throw error;
   return !!data?.length;
   },

   async clearByUser(userId: number): Promise<boolean> {
   const { data, error } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', userId)
      .select('id');

   if (error) throw error;
   return !!data?.length;
   },
};

export default CartItemRepository;