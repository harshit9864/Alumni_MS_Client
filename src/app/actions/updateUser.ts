"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";

export async function updateUser(role: "admin" | "alumni" | "student") {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Not authenticated");
  
    const client = await clerkClient();
  
    const res = await client.users.updateUserMetadata(userId, {
      publicMetadata: {role: role },
    });
  
    return { message: res.publicMetadata };
  } catch (error) {
    console.log("error",error)
  }
}
