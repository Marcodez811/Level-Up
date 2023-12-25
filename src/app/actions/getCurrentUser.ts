import { auth } from "@/lib/auth";

const getCurrentUser = async () => {
    const session = await auth();
    if (session?.user) {
        return session.user;
    }
    return null;
}

export default getCurrentUser;