import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { usersTable } from "@/db/schema";
import getCurrentUser from "@/app/actions/getCurrentUser";
