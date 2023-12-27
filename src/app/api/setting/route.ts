import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { usersTable } from "@/db/schema";
import getCurrentUser from "@/app/actions/getCurrentUser";

interface UpdateObject {
  image?: string;
  username?: string;
  password?: string;
  newPassword?: string;
  confirmPassword?: string;
}

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

    const updateObject: UpdateObject = {};
    if (image) {
      updateObject["image"] = image;
    }
    if (username) {
      updateObject["username"] = username;
    }
    if (password) {
      updateObject["password"] = newPassword;
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