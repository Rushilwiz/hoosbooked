"use server";

import { AuthError } from "next-auth";
import { signIn } from "@/auth";

export async function login(
  _prev: string | undefined,
  formData: FormData,
): Promise<string | undefined> {
  try {
    formData.set("redirectTo", "/");
    await signIn("credentials", formData);
  } catch (error) {
    if (error instanceof AuthError) {
      return "Login failed. Please check your credentials and try again.";
    }
    throw error;
  }
}
