import { supabase } from "../../../database/supabase";

export type Order = {
  id: number;
  user_id: number;
  total_price: number;
  status: string;
  created_at: string;
};

export type OrderItem = {
  id: number;
  order_id: number;
  id_photo: number;
  quantity: number;
  unit_price: number;
};

const ordersRepository = {
  // CREATE une commande
  async create(userId: number): Promise<number> {
    const { data, error } = await supabase
      .from("orders")
      .insert({ user_id: userId, status: "en attente", total_price: 0 })
      .select("id")
      .single();

    if (error) throw error;
    return data.id;
  },

  // READ une commande + ses items
  async read(orderId: number): Promise<(Order & { items: OrderItem[] }) | null> {
    const { data: order, error } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .single();

    if (error?.code === "PGRST116") return null;
    if (error) throw error;

    const { data: items, error: itemError } = await supabase
      .from("order_items")
      .select("*")
      .eq("order_id", orderId);

    if (itemError) throw itemError;

    return {
      ...order,
      items,
    };
  },

  // READ ALL (admin)
  async readAll(): Promise<Order[]> {
    const { data, error } = await supabase.from("orders").select("*");
    if (error) throw error;
    return data;
  },

  // READ les commandes d’un utilisateur
  async readByUser(userId: number): Promise<Order[]> {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("user_id", userId);

    if (error) throw error;
    return data;
  },

  // UPDATE le statut d’une commande
  async updateStatus(orderId: number, status: string): Promise<boolean> {
    const { error, data } = await supabase
      .from("orders")
      .update({ status })
      .eq("id", orderId)
      .select("id");

    if (error) throw error;
    return !!data.length;
  },
};

export default ordersRepository;
