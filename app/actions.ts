"use server";

import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { ResultSetHeader, RowDataPacket } from "mysql2";

import { pool } from "@/lib/db";
import { findUserForLogin, getCartItems, userExists } from "@/lib/data";
import { hashPassword, verifyPassword } from "@/lib/passwords";
import { clearSession, getSession, setSession } from "@/lib/session";
import type { OrderStatus, UserRole } from "@/types/database";

function formText(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function fail(pathname: string, message: string): never {
  redirect(`${pathname}?error=${encodeURIComponent(message)}`);
}

function redirectForRole(role: UserRole) {
  if (role === "admin") return "/admin/dashboard";
  if (role === "chef") return "/chef/dashboard";
  return "/products";
}

async function requireRoles(roles: UserRole[]) {
  const session = await getSession();

  if (!session || !roles.includes(session.role)) {
    redirect("/login");
  }

  return session;
}

async function requireRole(role: UserRole) {
  return requireRoles([role]);
}

export async function loginAction(formData: FormData) {
  const value = formText(formData, "email_or_username");
  const password = formText(formData, "password");

  if (!value || !password) {
    fail("/login", "Please enter your username or email and password.");
  }

  const user = await findUserForLogin(value);

  if (!user || !(await verifyPassword(password, user.password))) {
    fail("/login", "Invalid login details.");
  }

  await setSession({
    id: user.id,
    name: user.full_name ?? user.username,
    email: user.email,
    role: user.user_type
  });

  redirect(redirectForRole(user.user_type));
}

export async function registerCustomerAction(formData: FormData) {
  const username = formText(formData, "username");
  const email = formText(formData, "email");
  const password = formText(formData, "password");
  const confirmPassword = formText(formData, "confirmPassword");

  if (!username || !email || !password || !confirmPassword) {
    fail("/login", "Please fill all registration fields.");
  }

  if (password !== confirmPassword) {
    fail("/login", "Passwords do not match.");
  }

  if (await userExists(username, email)) {
    fail("/login", "Username or email already exists.");
  }

  const hashedPassword = await hashPassword(password);

  await pool.execute<ResultSetHeader>(
    `INSERT INTO users (username, email, password, user_type, full_name)
     VALUES (:username, :email, :password, 'customer', :fullName)`,
    { username, email, password: hashedPassword, fullName: username }
  );

  redirect("/login?created=1");
}

export async function logoutAction() {
  await clearSession();
  redirect("/");
}

export async function addToCartAction(formData: FormData) {
  const session = await requireRole("customer");
  const dishId = Number(formText(formData, "dish_id"));
  const quantity = Math.max(1, Number(formText(formData, "quantity") || 1));

  if (!dishId) {
    redirect("/products");
  }

  await pool.execute<ResultSetHeader>(
    `INSERT INTO cart (user_id, dish_id, quantity)
     VALUES (:userId, :dishId, :quantity)
     ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity)`,
    { userId: session.id, dishId, quantity }
  );

  revalidatePath("/cart");
  redirect("/cart");
}

export async function updateCartItemAction(formData: FormData) {
  const session = await requireRole("customer");
  const cartId = Number(formText(formData, "cart_id"));
  const quantity = Number(formText(formData, "quantity"));

  if (!cartId) {
    redirect("/cart");
  }

  if (quantity < 1) {
    await pool.execute<ResultSetHeader>(
      "DELETE FROM cart WHERE id = :cartId AND user_id = :userId",
      { cartId, userId: session.id }
    );
  } else {
    await pool.execute<ResultSetHeader>(
      "UPDATE cart SET quantity = :quantity WHERE id = :cartId AND user_id = :userId",
      { quantity, cartId, userId: session.id }
    );
  }

  revalidatePath("/cart");
  redirect("/cart");
}

export async function removeCartItemAction(formData: FormData) {
  const session = await requireRole("customer");
  const cartId = Number(formText(formData, "cart_id"));

  if (cartId) {
    await pool.execute<ResultSetHeader>(
      "DELETE FROM cart WHERE id = :cartId AND user_id = :userId",
      { cartId, userId: session.id }
    );
  }

  revalidatePath("/cart");
  redirect("/cart");
}

export async function checkoutAction(formData: FormData) {
  const session = await requireRole("customer");
  const deliveryDate = formText(formData, "delivery_date");
  const address = formText(formData, "address");
  const phone = formText(formData, "phone");
  const paymentMethod = formText(formData, "payment_method");
  const instructions = formText(formData, "instructions");

  if (!deliveryDate || !address || !phone || !paymentMethod) {
    fail("/checkout", "Please fill all required checkout fields.");
  }

  const cartItems = await getCartItems(session.id);
  if (cartItems.length === 0) {
    redirect("/products");
  }

  const deliveryCost = 4;
  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0) + deliveryCost;
  const orderNumber = `ORD-${Math.floor(Date.now() / 1000)}-${Math.floor(100 + Math.random() * 900)}`;
  const connection = await pool.getConnection();
  let orderId = 0;

  try {
    await connection.beginTransaction();

    const [orderResult] = await connection.execute<ResultSetHeader>(
      `INSERT INTO orders
       (order_number, user_id, total_amount, status, payment_method, payment_status, order_date, delivery_date, special_instructions, delivery_address, customer_phone, delivery_cost)
       VALUES
       (:orderNumber, :userId, :total, 'pending', :paymentMethod, 'pending', NOW(), :deliveryDate, :instructions, :address, :phone, :deliveryCost)`,
      {
        orderNumber,
        userId: session.id,
        total,
        paymentMethod,
        deliveryDate,
        instructions,
        address,
        phone,
        deliveryCost
      }
    );

    orderId = orderResult.insertId;

    for (const item of cartItems) {
      await connection.execute<ResultSetHeader>(
        `INSERT INTO order_items (order_id, dish_id, quantity, price_at_time)
         VALUES (:orderId, :dishId, :quantity, :price)`,
        {
          orderId,
          dishId: item.dish_id,
          quantity: item.quantity,
          price: item.price
        }
      );
    }

    await connection.execute<ResultSetHeader>("DELETE FROM cart WHERE user_id = :userId", {
      userId: session.id
    });

    await connection.commit();
  } catch (error) {
    await connection.rollback();
    console.error(error);
    fail("/checkout", "Could not place the order. Please try again.");
  } finally {
    connection.release();
  }

  revalidatePath("/cart");
  revalidatePath("/chef/dashboard");
  revalidatePath("/admin/dashboard");
  redirect(`/order-success?orderId=${orderId}`);
}

export async function updateOrderStatusAction(formData: FormData) {
  const session = await requireRoles(["admin", "chef"]);
  const orderId = Number(formText(formData, "order_id"));
  const status = formText(formData, "status") as OrderStatus;
  const allowedStatuses: OrderStatus[] = ["confirmed", "rejected"];

  if (orderId && allowedStatuses.includes(status)) {
    await pool.execute<ResultSetHeader>("UPDATE orders SET status = :status WHERE id = :orderId", {
      status,
      orderId
    });
  }

  revalidatePath("/chef/dashboard");
  revalidatePath("/admin/dashboard");
  redirect(redirectForRole(session.role));
}

export async function createDishAction(formData: FormData) {
  const session = await requireRoles(["admin", "chef"]);
  const name = formText(formData, "name");
  const description = formText(formData, "description");
  const price = Number(formText(formData, "price"));
  const category = formText(formData, "category") || "pastry";
  const ingredients = formText(formData, "ingredients");
  const preparationTime = Number(formText(formData, "preparation_time") || 0) || null;

  if (!name || !price || price <= 0) {
    fail("/chef/products/new", "Dish name and a valid price are required.");
  }

  const file = formData.get("photo");
  let imageUrl: string | null = null;

  if (file && typeof file === "object" && "arrayBuffer" in file && "name" in file && "size" in file) {
    const uploadedFile = file as File;

    if (uploadedFile.size > 0) {
      const extension = uploadedFile.name.split(".").pop()?.toLowerCase() ?? "";
      const allowed = ["jpg", "jpeg", "png", "gif", "webp"];

      if (!allowed.includes(extension)) {
        fail("/chef/products/new", "Please upload a valid image file.");
      }

      const fileName = `dish_${Date.now()}_${randomUUID().slice(0, 8)}.${extension}`;
      const uploadDir = path.join(process.cwd(), "public", "uploads");
      await mkdir(uploadDir, { recursive: true });
      await writeFile(path.join(uploadDir, fileName), Buffer.from(await uploadedFile.arrayBuffer()));
      imageUrl = `uploads/${fileName}`;
    }
  }

  await pool.execute<ResultSetHeader>(
    `INSERT INTO dishes
     (name, description, price, category, image_url, available, ingredients, preparation_time, chef_id)
     VALUES
     (:name, :description, :price, :category, :imageUrl, 1, :ingredients, :preparationTime, :chefId)`,
    {
      name,
      description,
      price,
      category,
      imageUrl,
      ingredients,
      preparationTime,
      chefId: session.id
    }
  );

  revalidatePath("/products");
  revalidatePath("/chef/products");
  revalidatePath("/admin/dashboard");
  redirect("/chef/products");
}

export async function deleteDishAction(formData: FormData) {
  await requireRoles(["admin", "chef"]);
  const dishId = Number(formText(formData, "dish_id"));

  if (!dishId) {
    redirect("/chef/products");
  }

  const [rows] = await pool.query<(RowDataPacket & { image_url: string | null })[]>(
    "SELECT image_url FROM dishes WHERE id = :dishId LIMIT 1",
    { dishId }
  );

  await pool.execute<ResultSetHeader>("DELETE FROM dishes WHERE id = :dishId", { dishId });

  const imageUrl = rows[0]?.image_url;
  if (imageUrl?.startsWith("uploads/")) {
    try {
      await unlink(path.join(process.cwd(), "public", imageUrl));
    } catch {
      // The database row is the source of truth; a missing local image should not block deletion.
    }
  }

  revalidatePath("/products");
  revalidatePath("/chef/products");
  revalidatePath("/admin/dashboard");
  redirect("/chef/products");
}

export async function createChefAction(formData: FormData) {
  await requireRole("admin");
  const fullName = formText(formData, "full_name");
  const username = formText(formData, "username");
  const email = formText(formData, "email");
  const password = formText(formData, "password");
  const phone = formText(formData, "phone");

  if (!fullName || !username || !email || !password) {
    fail("/admin/dashboard", "Chef name, username, email, and password are required.");
  }

  if (await userExists(username, email)) {
    fail("/admin/dashboard", "A user with this username or email already exists.");
  }

  const hashedPassword = await hashPassword(password);

  await pool.execute<ResultSetHeader>(
    `INSERT INTO users (username, email, password, user_type, full_name, phone)
     VALUES (:username, :email, :password, 'chef', :fullName, :phone)`,
    {
      username,
      email,
      password: hashedPassword,
      fullName,
      phone: phone || null
    }
  );

  revalidatePath("/admin/dashboard");
  redirect("/admin/dashboard?chefCreated=1");
}
