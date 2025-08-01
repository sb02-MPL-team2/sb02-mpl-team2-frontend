"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, User } from "lucide-react"

interface ReviewItemProps {
  review: {
    id: string
    user: {
      name: string
      avatar: string
    }
    rating: number
    text: string
  }
}

export function ReviewItem({ review }: ReviewItemProps) {
  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={review.user.avatar || "/placeholder.svg"} alt={review.user.name} />
            <AvatarFallback className="bg-purple-100">
              <User className="h-5 w-5 text-purple-600" />
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-900">{review.user.name}</span>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span className="text-sm font-medium text-gray-700">{review.rating}</span>
              </div>
            </div>
            <p className="text-gray-700 leading-relaxed">{review.text}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
