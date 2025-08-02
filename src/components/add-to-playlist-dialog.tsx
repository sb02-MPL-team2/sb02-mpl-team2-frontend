"use client"
import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { playlistService } from "@/services/playlistService"
import { useAuthStore } from "@/stores/authStore"
import { QUERY_KEYS } from "@/lib/constants"
import { Content } from "@/types"

interface AddToPlaylistDialogProps {
  content: Content
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddToPlaylistDialog({ content, open, onOpenChange }: AddToPlaylistDialogProps) {
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(null)
  const [isCreatingNew, setIsCreatingNew] = useState(false)
  const [newPlaylistTitle, setNewPlaylistTitle] = useState("")
  const [newPlaylistDescription, setNewPlaylistDescription] = useState("")
  const { user } = useAuthStore()

  // 사용자 플레이리스트 조회
  const { data: playlistData, isLoading: isLoadingPlaylists } = useQuery({
    queryKey: QUERY_KEYS.USER_PLAYLISTS(user?.id || 0),
    queryFn: () => user ? playlistService.getUserPlaylists(user.id) : Promise.resolve({ 
      content: [], size: 0, hasNext: false, nextCursor: null 
    }),
    enabled: !!user?.id && open, // 다이얼로그가 열릴 때만 쿼리 실행
  })

  const myPlaylists = playlistData?.content || []

  const handleAddToPlaylist = async () => {
    if (selectedPlaylistId) {
      try {
        const playlist = myPlaylists.find((p) => p.id.toString() === selectedPlaylistId)
        await playlistService.addContentToPlaylist(parseInt(selectedPlaylistId), content.id)
        
        alert(`"${content.title}" 콘텐츠가 "${playlist?.title}" 플레이리스트에 추가되었습니다!`)
        resetAndClose()
      } catch (error) {
        console.error('플레이리스트 추가 실패:', error)
        alert('플레이리스트 추가에 실패했습니다.')
      }
    } else {
      alert("플레이리스트를 선택해주세요.")
    }
  }

  const handleCreateNewPlaylist = async () => {
    if (!newPlaylistTitle.trim()) {
      alert("플레이리스트 제목을 입력해주세요.")
      return
    }

    try {
      // 새 플레이리스트 생성
      const newPlaylist = await playlistService.createPlaylist({
        title: newPlaylistTitle.trim(),
        description: newPlaylistDescription.trim()
      })

      // 생성된 플레이리스트에 콘텐츠 추가
      await playlistService.addContentToPlaylist(newPlaylist.id, content.id)

      alert(`새 플레이리스트 "${newPlaylist.title}"가 생성되고 "${content.title}" 콘텐츠가 추가되었습니다!`)
      resetAndClose()
    } catch (error) {
      console.error('새 플레이리스트 생성 실패:', error)
      alert('새 플레이리스트 생성에 실패했습니다.')
    }
  }

  const resetAndClose = () => {
    setSelectedPlaylistId(null)
    setIsCreatingNew(false)
    setNewPlaylistTitle("")
    setNewPlaylistDescription("")
    onOpenChange(false)
  }

  const handleCancel = () => {
    if (isCreatingNew) {
      setIsCreatingNew(false)
      setNewPlaylistTitle("")
      setNewPlaylistDescription("")
    } else {
      resetAndClose()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isCreatingNew ? "새 플레이리스트 만들기" : "플레이리스트에 추가"}
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          {isCreatingNew ? (
            // 새 플레이리스트 생성 폼
            <>
              <div className="space-y-2">
                <label htmlFor="playlist-title" className="text-sm font-medium">
                  플레이리스트 제목 *
                </label>
                <Input
                  id="playlist-title"
                  placeholder="예: 감동적인 영화 모음"
                  value={newPlaylistTitle}
                  onChange={(e) => setNewPlaylistTitle(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="playlist-description" className="text-sm font-medium">
                  설명 (선택사항)
                </label>
                <Input
                  id="playlist-description"
                  placeholder="플레이리스트에 대한 간단한 설명"
                  value={newPlaylistDescription}
                  onChange={(e) => setNewPlaylistDescription(e.target.value)}
                />
              </div>
            </>
          ) : (
            // 기존 플레이리스트 선택
            <>
              <Select onValueChange={setSelectedPlaylistId} value={selectedPlaylistId || ""}>
                <SelectTrigger>
                  <SelectValue placeholder="추가할 플레이리스트를 선택하세요..." />
                </SelectTrigger>
                <SelectContent>
                  {isLoadingPlaylists ? (
                    <div className="p-2 text-center text-gray-500">플레이리스트를 불러오는 중...</div>
                  ) : myPlaylists.length > 0 ? (
                    myPlaylists.map((playlist) => (
                      <SelectItem key={playlist.id} value={playlist.id.toString()}>
                        {playlist.title}
                      </SelectItem>
                    ))
                  ) : (
                    <div className="p-2 text-center text-gray-500">생성된 플레이리스트가 없습니다.</div>
                  )}
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                onClick={() => setIsCreatingNew(true)}
                className="mt-2"
              >
                + 새 플레이리스트 만들기
              </Button>
            </>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            {isCreatingNew ? "뒤로" : "취소"}
          </Button>
          <Button
            onClick={isCreatingNew ? handleCreateNewPlaylist : handleAddToPlaylist}
            className="bg-purple-600 hover:bg-purple-700"
          >
            {isCreatingNew ? "생성하고 추가" : "추가"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}