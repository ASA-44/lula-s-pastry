import "server-only";

import type { RowDataPacket } from "mysql2";

import { pool } from "@/lib/db";
import type { CartItem, Dish, Order, OrderItem, User } from "@/types/database";

type Row<T> = T & RowDataPacket;

function normalizeDish(row: Row<Dish>): Dish {
  return {
    ...row,
    price: Number(row.price),
    available: Number(row.available)
  };
}

function normalizeCartItem(row: Row<CartItem>): CartItem {
  return {
    ...row,
    price: Number(row.price),
    quantity: Number(row.quantity)
  };
}

function normalizeOrder(row: Row<Order>): Order {
  return {
    ...row,
    total_amount: Number(row.total_amount),
    delivery_cost: Number(row.delivery_cost)
  };
}

function normalizeOrderItem(row: Row<OrderItem>): OrderItem {
  return {
    ...row,
    price_at_time: Number(row.price_at_time),
    quantity: Number(row.quantity)
  };
}

export async function findUserForLogin(value: string) {
  const [rows] = await pool.query<Row<User>[]>(
    `SELECT id, username, email, password, user_type, full_name, phone, address, created_at
     FROM users
     WHERE email = :value OR username = :value
     LIMIT 1`,
    { value }
  );

  return rows[0] ?? null;
}

export async function getChefs() {
  const [rows] = await pool.query<Row<User>[]>(
    `SELECT id, username, email, password, user_type, full_name, phone, address, created_at
     FROM users
     WHERE user_type = 'chef'
     ORDER BY created_at DESC, id DESC`
  );

  return rows;
}

export async function userExists(username: string, email: string) {
  const [rows] = await pool.query<Row<{ id: number }>[]>(
    "SELECT id FROM users WHERE username = :username OR email = :email LIMIT 1",
    { username, email }
  );

  return rows.length > 0;
}

export async function emailExists(email: string) {
  const [rows] = await pool.query<Row<{ id: number }>[]>(
    "SELECT id FROM users WHERE email = :email LIMIT 1",
    { email }
  );

  return rows.length > 0;
}

export async function usernameExists(username: string) {
  const [rows] = await pool.query<Row<{ id: number }>[]>(
    "SELECT id FROM users WHERE username = :username LIMIT 1",
    { username }
  );

  return rows.length > 0;
}

export async function getAvailableDishes() {
  const [rows] = await pool.query<Row<Dish>[]>(
    `SELECT id, name, description, price, category, image_url, available, ingredients, preparation_time, created_at, chef_id
     FROM dishes
     WHERE available = 1
     ORDER BY id ASC`
  );

  return rows.map(normalizeDish);
}

export async function getAllDishes() {
  const [rows] = await pool.query<Row<Dish>[]>(
    `SELECT id, name, description, price, category, image_url, available, ingredients, preparation_time, created_at, chef_id
     FROM dishes
     ORDER BY id DESC`
  );

  return rows.map(normalizeDish);
}

export async function getCartItems(userId: number) {
  const [rows] = await pool.query<Row<CartItem>[]>(
    `SELECT c.id AS cart_id, c.dish_id, c.quantity, d.name, d.description, d.price, d.image_url
     FROM cart c
     JOIN dishes d ON c.dish_id = d.id
     WHERE c.user_id = :userId
     ORDER BY c.id DESC`,
    { userId }
  );

  return rows.map(normalizeCartItem);
}

export async function getOrders() {
  const [rows] = await pool.query<Row<Order>[]>(
    `SELECT o.*, u.full_name
     FROM orders o
     LEFT JOIN users u ON o.user_id = u.id
     ORDER BY o.order_date DESC`
  );

  return rows.map(normalizeOrder);
}

export async function getOrderDetails(orderId: number) {
  const [orders] = await pool.query<Row<Order>[]>(
    `SELECT o.*, u.full_name
     FROM orders o
     JOIN users u ON o.user_id = u.id
     WHERE o.id = :orderId
     LIMIT 1`,
    { orderId }
  );

  if (!orders[0]) {
    return null;
  }

  const [items] = await pool.query<Row<OrderItem>[]>(
    `SELECT oi.id, oi.order_id, oi.dish_id, oi.quantity, oi.price_at_time, d.name
     FROM order_items oi
     JOIN dishes d ON oi.dish_id = d.id
     WHERE oi.order_id = :orderId`,
    { orderId }
  );

  return {
    order: normalizeOrder(orders[0]),
    items: items.map(normalizeOrderItem)
  };
}
