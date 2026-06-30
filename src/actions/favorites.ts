"use server";

import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export interface FavoriteItem {
  id: string;
  name: string;
  userId: string | null;
  userEmail: string | null;
  data: string;
  createdAt: Date;
}

interface RawFavoriteRow {
  id: string;
  name: string;
  userId: string | null;
  data: string;
  createdAt: string;
  email: string | null;
}

export async function addFavorite(input: {
  name: string;
  data: string;
}): Promise<{ success: boolean; error?: string; id?: string }> {
  const session = await getSession();

  if (!session) {
    return { success: false, error: "You must be signed in to add favorites" };
  }

  const id = `c${Date.now().toString(36)}${Math.random().toString(36).slice(2)}`;

  try {
    await prisma.$executeRaw`
      INSERT INTO "Favorite" ("id", "name", "userId", "data", "createdAt")
      VALUES (${id}, ${input.name}, ${session.userId}, ${input.data}, datetime('now'))
    `;

    return { success: true, id };
  } catch (error) {
    console.error("Failed to add favorite:", error);
    return { success: false, error: "Failed to save favorite" };
  }
}

export async function removeFavorite(
  favoriteId: string
): Promise<{ success: boolean; error?: string }> {
  const session = await getSession();

  if (!session) {
    return { success: false, error: "You must be signed in to remove favorites" };
  }

  try {
    await prisma.$executeRaw`
      DELETE FROM "Favorite"
      WHERE "id" = ${favoriteId} AND "userId" = ${session.userId}
    `;

    return { success: true };
  } catch (error) {
    console.error("Failed to remove favorite:", error);
    return { success: false, error: "Failed to remove favorite" };
  }
}

export async function getAllFavorites(): Promise<FavoriteItem[]> {
  try {
    const rows = await prisma.$queryRaw<RawFavoriteRow[]>`
      SELECT f.id, f.name, f.userId, f.data, f.createdAt, u.email
      FROM "Favorite" f
      LEFT JOIN "User" u ON f.userId = u.id
      ORDER BY f.createdAt DESC
    `;

    return rows.map((row) => ({
      id: row.id,
      name: row.name,
      userId: row.userId,
      userEmail: row.email,
      data: row.data,
      createdAt: new Date(row.createdAt),
    }));
  } catch (error) {
    console.error("Failed to get favorites:", error);
    return [];
  }
}
