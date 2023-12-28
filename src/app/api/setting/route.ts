import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import bcrypt from "bcryptjs";
import { usersTable } from "@/db/schema";
import getCurrentUser from "@/app/actions/getCurrentUser";

export async function POST(
  request: Request,
) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const body = await request.json();
    const {
      username,
      password,
      newPassword,
      image,
    } = body;

    const updateObject = {};
    if (image) {
        Object.assign(updateObject, { image });
    }
    if (username) {
        Object.assign(updateObject, { username });
    }
    if (password) {
        Object.assign(updateObject, { hashedPassword: await bcrypt.hash(newPassword, 12) });
    }
    const [updatedUser] = await db.update(usersTable)
                                  .set(updateObject)
                                  .where(eq(usersTable.id, currentUser.id))
                                  .returning();
    return NextResponse.json(updatedUser);
  } catch (error) {
    console.log(error, 'ERROR_MESSAGES')
    return new NextResponse('Error', { status: 500 });
  }
}