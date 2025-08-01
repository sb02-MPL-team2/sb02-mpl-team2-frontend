"use client"

import { useState } from "react"

import { MainLayout } from "@/components/main-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

const mockAdminUsers = [
  { id: "user1", name: "woody", email: "woody@playlist.io", isAdmin: false, isLocked: false, joinDate: "2025. 1. 1" },
  { id: "user2", name: "buzz", email: "buzz@playlist.io", isAdmin: true, isLocked: false, joinDate: "2025. 1. 2" },
  { id: "user3", name: "jessie", email: "jessie@playlist.io", isAdmin: false, isLocked: true, joinDate: "2025. 1. 3" },
  { id: "user4", name: "rex", email: "rex@playlist.io", isAdmin: false, isLocked: false, joinDate: "2025. 1. 4" },
  { id: "user5", name: "slinky", email: "slinky@playlist.io", isAdmin: true, isLocked: false, joinDate: "2025. 1. 5" },
  { id: "user6", name: "potatohead", email: "potatohead@playlist.io", isAdmin: false, isLocked: false, joinDate: "2025. 1. 6" },
]

export default function UserManagementPage() {
  const [users, setUsers] = useState(mockAdminUsers)
  const [searchQuery, setSearchQuery] = useState("")
  const [attributeFilter, setAttributeFilter] = useState("")

  const handleToggleLock = (userId: string) => {
    setUsers(users.map((user) => (user.id === userId ? { ...user, isLocked: !user.isLocked } : user)))
    const user = users.find((u) => u.id === userId)
    if (user) {
      alert(`${user.name}님의 계정이 ${user.isLocked ? "잠금 해제" : "잠금"}되었습니다.`)
    }
  }

  const handleToggleAdmin = (userId: string) => {
    setUsers(users.map((user) => (user.id === userId ? { ...user, isAdmin: !user.isAdmin } : user)))
    const user = users.find((u) => u.id === userId)
    if (user) {
      alert(`${user.name}님의 관리자 권한이 ${user.isAdmin ? "해제" : "부여"}되었습니다.`)
    }
  }

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesAttribute =
      attributeFilter === "" ||
      attributeFilter === "all" ||
      (attributeFilter === "locked" && user.isLocked) ||
      (attributeFilter === "unlocked" && !user.isLocked)

    return matchesSearch && matchesAttribute
  })

  return (
    <MainLayout activeRoute="/admin/users">
      <div className="space-y-6">
        {/* Page Title */}
        <div>
          <h2 className="text-3xl font-bold text-gray-900">사용자 관리</h2>
          <p className="text-gray-600 mt-2">시스템의 모든 사용자를 관리하고 모니터링하세요.</p>
        </div>

        {/* Filters Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
          {/* Search Input */}
          <div className="space-y-2">
            <Label htmlFor="search" className="text-sm font-medium text-gray-700">
              Search
            </Label>
            <Input
              id="search"
              type="text"
              placeholder="Name, email, etc..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Attribute Filter */}
          <div className="space-y-2">
            <Label htmlFor="attribute" className="text-sm font-medium text-gray-700">
              Attribute
            </Label>
            <Select value={attributeFilter} onValueChange={setAttributeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Property" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">모든 사용자</SelectItem>
                <SelectItem value="locked">잠금된 계정</SelectItem>
                <SelectItem value="unlocked">활성 계정</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* User List Table */}
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>이름</TableHead>
                <TableHead>이메일</TableHead>
                <TableHead>관리자 권한</TableHead>
                <TableHead>계정 잠금 상태</TableHead>
                <TableHead>가입일</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant={user.isAdmin ? "default" : "secondary"}>
                      {user.isAdmin ? "관리자" : "일반 사용자"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.isLocked ? "destructive" : "secondary"}>
                      {user.isLocked ? "잠금됨" : "활성"}
                    </Badge>
                  </TableCell>
                  <TableCell>{user.joinDate}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant={user.isAdmin ? "outline" : "default"}
                        size="sm"
                        onClick={() => handleToggleAdmin(user.id)}
                        className={user.isAdmin ? "" : "bg-purple-600 hover:bg-purple-700"}
                      >
                        {user.isAdmin ? "관리자 권한 해제" : "관리자 권한 부여"}
                      </Button>
                      <Button
                        variant={user.isLocked ? "default" : "destructive"}
                        size="sm"
                        onClick={() => handleToggleLock(user.id)}
                      >
                        {user.isLocked ? "잠금 해제" : "계정 잠금"}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Empty State */}
          {filteredUsers.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">검색 조건에 맞는 사용자가 없습니다.</p>
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="text-sm text-gray-600">
          총 {users.length}명의 사용자 중 {filteredUsers.length}명 표시
        </div>
      </div>
    </MainLayout>
  )
}