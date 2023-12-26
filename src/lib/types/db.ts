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
    id: number;
    content: string;
    createdAt: Date;
    userId: string;
    completed: boolean;
    elapsedTime: string;
};