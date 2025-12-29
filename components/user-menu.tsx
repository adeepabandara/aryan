"use client"

import { useSession } from "next-auth/react"
import { User } from "lucide-react"

export function UserMenu({ isCollapsed }: { isCollapsed: boolean }) {
  const { data: session } = useSession()

  if (!session?.user) return null

  return (
    <div className="border-t p-4">
      <div className={`flex items-center gap-3 ${isCollapsed ? "justify-center" : ""}`}>
        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
          <User className="h-4 w-4 text-primary" />
        </div>
        {!isCollapsed && (
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{session.user.name}</p>
            <p className="text-xs text-muted-foreground truncate">{session.user.email}</p>
          </div>
        )}
      </div>
    </div>
  )
}
