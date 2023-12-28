import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { usersTable } from "@/db/schema";
import levelTitles from "@/lib/utils/levelTitles";

export async function GET(req: Request, { params }: { params: { userId: string }}) {
  try {
    const { userId } = params;
    const [ user ] = await db.select({
      username: usersTable.username,
      email: usersTable.email,
      experience: usersTable.experience,
      level: usersTable.level,
      image: usersTable.image,
      totalElapsedTime: usersTable.totalElapsedTime,
    })
    .from(usersTable)
    .where(eq(usersTable.id, userId));

    Object.assign(user, {
      title: levelTitles[user.level],
    });
    return NextResponse.json({ user }, {status: 200});
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
} 

