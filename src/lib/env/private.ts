import { z } from "zod";

const privateEnvSchema = z.object({
  POSTGRES_URL: z.string().url(),
  UPLOAD_PRESET: z.string(),
});

type PrivateEnv = z.infer<typeof privateEnvSchema>;

export const privateEnv: PrivateEnv = {
  POSTGRES_URL: process.env.POSTGRES_URL!,
  UPLOAD_PRESET: process.env.UPLOAD_PRESET!,
};

privateEnvSchema.parse(privateEnv);