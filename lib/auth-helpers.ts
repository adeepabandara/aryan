import { prisma } from "@/lib/prisma"
import * as bcrypt from "bcryptjs"

export async function verifyCredentials(email: string, password: string) {
  console.log("🔍 [AUTH-HELPERS] Starting verification for:", email);
  
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    })

    console.log("👤 [AUTH-HELPERS] User found:", user ? "YES" : "NO");
    
    if (!user || !user.password) {
      console.log("❌ [AUTH-HELPERS] No user or password found for:", email);
      return null
    }

    console.log("🔐 [AUTH-HELPERS] Comparing passwords...");
    console.log("🔐 [AUTH-HELPERS] Stored hash:", user.password.substring(0, 20) + "...");
    console.log("🔐 [AUTH-HELPERS] Input password length:", password.length);
    
    const isPasswordValid = await bcrypt.compare(password, user.password)
    
    console.log("✅ [AUTH-HELPERS] Password valid:", isPasswordValid);

    if (!isPasswordValid) {
      console.log("❌ [AUTH-HELPERS] Password comparison failed");
      return null
    }

    console.log("✅ [AUTH-HELPERS] Authentication successful for:", email);
    return {
      id: user.id,
      email: user.email,
      name: user.name,
    }
  } catch (error) {
    console.error("❌ [AUTH-HELPERS] Error during verification:", error);
    throw error;
  }
}
