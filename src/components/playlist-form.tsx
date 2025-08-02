"use client"

import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { playlistService } from "@/services/playlistService"
import { QUERY_KEYS } from "@/lib/constants"
import { PlaylistDto } from "@/types"

interface PlaylistFormProps {
  onSuccess?: (playlist: PlaylistDto) => void
  onCancel?: () => void
  submitButtonText?: string
  isSubmitting?: boolean
}

export function PlaylistForm({ 
  onSuccess, 
  onCancel, 
  submitButtonText = "플레이리스트 생성",
  isSubmitting = false 
}: PlaylistFormProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const queryClient = useQueryClient()

  const createPlaylistMutation = useMutation({
    mutationFn: (data: { title: string; description: string }) => 
      playlistService.createPlaylist(data),
    onSuccess: (newPlaylist) => {
      // 관련 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ALL_PLAYLISTS })
      queryClient.invalidateQueries({ queryKey: ['userPlaylists'] })
      
      // 성공 콜백 호출
      onSuccess?.(newPlaylist)
      
      // 폼 초기화
      setTitle("")
      setDescription("")
    },
    onError: (error) => {
      console.error('플레이리스트 생성 실패:', error)
      alert('플레이리스트 생성에 실패했습니다.')
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!title.trim()) {
      alert("플레이리스트 제목을 입력해주세요.")
      return
    }

    createPlaylistMutation.mutate({
      title: title.trim(),
      description: description.trim()
    })
  }

  const handleCancel = () => {
    setTitle("")
    setDescription("")
    onCancel?.()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="playlist-title" className="text-sm font-medium">
          플레이리스트 제목 *
        </label>
        <Input
          id="playlist-title"
          placeholder="예: 감동적인 영화 모음"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={createPlaylistMutation.isPending || isSubmitting}
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="playlist-description" className="text-sm font-medium">
          설명 (선택사항)
        </label>
        <Input
          id="playlist-description"
          placeholder="플레이리스트에 대한 간단한 설명"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={createPlaylistMutation.isPending || isSubmitting}
        />
      </div>

      <div className="flex gap-2 justify-end pt-2">
        {onCancel && (
          <Button 
            type="button" 
            variant="outline" 
            onClick={handleCancel}
            disabled={createPlaylistMutation.isPending || isSubmitting}
          >
            취소
          </Button>
        )}
        <Button
          type="submit"
          className="bg-purple-600 hover:bg-purple-700"
          disabled={createPlaylistMutation.isPending || isSubmitting}
        >
          {createPlaylistMutation.isPending || isSubmitting ? "생성 중..." : submitButtonText}
        </Button>
      </div>
    </form>
  )
}