export type UserRole = "admin" | "chef" | "customer";

export type User = {
  id: number;
  username: string;
  email: string;
  password: string;
  user_type: UserRole;
  full_name: string | null;
  phone: string | null;
  address: string | null;
  created_at: Date;
};

export type Dish = {
  id: number;
  name: string;
  description: string | null;
  price: number;
  category: string | null;
  image_url: string | null;
  available: number;
  ingredients: string | null;
  preparation_time: number | null;
  created_at?: Date;
  chef_id?: number | null;
};

export type CartItem = {
  cart_id: number;
  dish_id: number;
  quantity: number;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
};

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "rejected"
  | "preparing"
  | "baking"
  | "ready"
  | "delivered"
  | "cancelled";

export type Order = {
  id: number;
  order_number: string;
  user_id: number;
  total_amount: number;
  status: OrderStatus;
  payment_method: string | null;
  payment_status: "pending" | "paid" | "failed";
  order_date: Date;
  delivery_date: Date | null;
  special_instructions: string | null;
  delivery_address: string | null;
  customer_phone: string | null;
  delivery_cost: number;
  full_name?: string | null;
};

export type OrderItem = {
  id: number;
  order_id: number;
  dish_id: number;
  quantity: number;
  price_at_time: number;
  name: string;
};
