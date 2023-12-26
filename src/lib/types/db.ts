export type User = {
    id: string;
    email: string;
    username: string;
    experience: number;
    level: number;
    image: string | null;
    provider: "github" | "google" | "credentials";
};

export type Task = {
    userId: string;
    content: string;
    id: number;
    createdAt: string | null;
    completed: boolean | null;
    pause: boolean;
}