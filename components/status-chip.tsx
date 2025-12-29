"use client"

interface StatusChipProps {
  status: string
  label?: string
}

export function StatusChip({ status, label }: StatusChipProps) {
  const getStatusStyles = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
        return "bg-green-500 text-white"
      case "due":
        return "bg-yellow-500 text-black"
      case "overdue":
        return "bg-red-600 text-white"
      case "partial":
        return "bg-blue-500 text-white"
      case "completed":
        return "bg-green-500 text-white"
      case "pending":
        return "bg-yellow-500 text-black"
      case "failed":
        return "bg-red-600 text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  const getStatusLabel = (status: string) => {
    if (label) return label
    switch (status.toLowerCase()) {
      case "paid":
        return "Paid"
      case "partial":
        return "Partial Paid"
      case "due":
      case "overdue":
        return "Pending"
      default:
        return status.charAt(0).toUpperCase() + status.slice(1)
    }
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusStyles(status)}`}>
      {getStatusLabel(status)}
    </span>
  )
}
