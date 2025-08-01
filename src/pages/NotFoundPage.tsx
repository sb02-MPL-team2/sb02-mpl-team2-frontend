"use client"

import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Bot, Home } from "lucide-react"

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center space-y-8 max-w-md">
        {/* Central Icon */}
        <div className="flex justify-center">
          <Bot size={96} className="text-gray-400" />
        </div>

        {/* Error Title and Message */}
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-gray-900">404: Page Not Found</h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            앗! 요청하신 페이지를 찾을 수 없어요. 지금 열심히 만들고 있거나, 다른 행성으로 이사갔을 수도 있어요.
          </p>
        </div>

        {/* Call to Action */}
        <div className="pt-4">
          <Link to="/login">
            <Button className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3">
              <Home size={20} />
              로그인으로 돌아가기
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}