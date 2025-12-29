import { prisma } from "@/lib/prisma"
import * as bcrypt from "bcryptjs"

export async function verifyCredentials(email: string, password: string) {
  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  })

  if (!user || !user.password) {
    return null
  }

  const isPasswordValid = await bcrypt.compare(password, user.password)

  if (!isPasswordValid) {
    return null
  }

  return {
    id: user.id,
    email: user.email,
    name: user.name,
  }
}
