"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, User } from "lucide-react"
import type { ReviewDto } from "@/types"

interface ReviewItemProps {
  review: ReviewDto
}

export function ReviewItem({ review }: ReviewItemProps) {
  return (
    <div className="border-b pb-4 last:border-0">
      <div className="flex items-start gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage 
            src={review.author.profileUrl || "/placeholder.svg"} 
            alt={review.author.username} 
          />
          <AvatarFallback className="bg-purple-100">
            <User className="h-5 w-5 text-purple-600" />
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <div>
              <span className="font-medium">{review.author.username}</span>
              <div className="flex items-center gap-1 mt-1">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`h-4 w-4 ${
                      i < review.rating 
                        ? "text-yellow-400 fill-current" 
                        : "text-gray-300"
                    }`} 
                  />
                ))}
              </div>
            </div>
            <span className="text-sm text-gray-500">
              {new Date(review.createdAt).toLocaleDateString('ko-KR')}
            </span>
          </div>
          
          <p className="text-gray-700">{review.comment}</p>
        </div>
      </div>
    </div>
  )
}
