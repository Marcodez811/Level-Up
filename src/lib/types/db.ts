export type User = {
    id: string;
    username: string;
    email: string;
    provider: "github" | "google" | "credentials";
    image: string | null;
    level: number;
    experience: number;
    totalElapsedTime: string;
    hashedPassword: string | null;
};

export type UserInfo = {
    username: string;
    email: string;
    experience: number;
    level: number;
    image: string | null;
    title: string;
    totalElapsedTime: string;
};

export type Task = {
    id: number;
    content: string;
    createdAt: Date;
    userId: string;
    completed: boolean;
    elapsedTime: string;
};