"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Edit, Trash2 } from "lucide-react"

interface ActionButtonsProps {
  editHref?: string
  onDelete?: () => void
  showEdit?: boolean
  showDelete?: boolean
}

export function ActionButtons({ editHref, onDelete, showEdit = true, showDelete = true }: ActionButtonsProps) {
  return (
    <div className="flex gap-2 pt-2 border-t">
      {showEdit && editHref && (
        <Link href={editHref} className="flex-1">
          <Button variant="ghost" size="sm" className="w-full hover:bg-gray-200 hover:text-foreground">
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Button>
        </Link>
      )}
      {showDelete && (
        <Button variant="ghost" size="sm" className="flex-1 hover:bg-gray-200 hover:text-foreground" onClick={onDelete}>
          <Trash2 className="h-4 w-4 mr-1" />
          Delete
        </Button>
      )}
    </div>
  )
}
