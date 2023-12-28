import bcrypt from "bcryptjs";
import { db } from "@/db";
import { usersTable } from "@/db/schema";
import { NextResponse } from "next/server";

export async function POST(
    request: Request
) {
    try {
        const body = await request.json();
        const {
            email,
            username,
            password
        } = body;
        if (!email || !username || !password) {
            return new NextResponse('Missing Information', {status: 400});
        }
        const hashedPassword = await bcrypt.hash(password, 12);
        const user = await db
                            .insert(usersTable)
                            .values(
                                {
                                    username,
                                    email,
                                    hashedPassword,
                                }
                            );
        return NextResponse.json(user);
    } catch (error: any) {
        console.error(error, 'REGISTRATION ERROR');
        return new NextResponse('Internal Error', { status: 500 });
    }
}