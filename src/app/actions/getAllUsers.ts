import { db } from "@/db";
import {
    usersTable,
} from "@/db/schema";
import { desc } from 'drizzle-orm';

export const getAllUsers = async () => {
    // todo: make this function return all the users sorted from highest level to the lowest
    try {
        const result = await db.select().from(usersTable).limit(50).orderBy(desc(usersTable.level));
        return result;
    } catch (e) {
        console.error(e);
        throw new Error("Some error");
    }
}

export default getAllUsers;