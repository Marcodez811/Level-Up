export type User = {
    email: string;
    username: string;
    experience: number;
    level: number;
    image: string | null;
    title: string | null;
    id: string;   
    provider: "github" | "google" | "credentials";
};

export type Task = {
    userId: string;
    content: string;
    id: number;
    createdAt: string | null;
    completed: boolean | null;
}