import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { sql, eq, and, desc } from "drizzle-orm";
import { db } from "@/db";
import { tasksTable, usersTable } from "@/db/schema";
import getCurrentUser from "@/app/actions/getCurrentUser";
import levelExperience from '@/lib/utils/levelExperience';
import { Task } from "@/lib/types/db";


const putTaskSchema = z.object({
    // userId: z.string(),
    imgId: z.string(),
});


type PutTaskRequest = z.infer<typeof putTaskSchema>;

export async function PUT(request: NextRequest, { params }: { params: { userId: string }} ) {
  const data = await request.json();
  try {
    putTaskSchema.parse(data);
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); 
    const { imgId } = data as PutTaskRequest;
    await db.update(usersTable).set({image: imgId}).where(eq(usersTable.id, params.userId));
    return new NextResponse(JSON.stringify("OK"), { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}