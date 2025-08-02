"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { PlaylistForm } from "./playlist-form"
import { PlaylistDto } from "@/types"

interface CreatePlaylistDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: (playlist: PlaylistDto) => void
}

export function CreatePlaylistDialog({ open, onOpenChange, onSuccess }: CreatePlaylistDialogProps) {
  const handleSuccess = (playlist: PlaylistDto) => {
    onSuccess?.(playlist)
    onOpenChange(false)
  }

  const handleCancel = () => {
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>새 플레이리스트 만들기</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <PlaylistForm 
            onSuccess={handleSuccess}
            onCancel={handleCancel}
            submitButtonText="플레이리스트 생성"
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}