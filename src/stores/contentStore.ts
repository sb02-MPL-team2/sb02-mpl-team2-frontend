import { create } from 'zustand';
import { ContentState, ContentResponseDto } from '@/types';

interface ContentStore extends ContentState {
  // Actions
  setContents: (contents: ContentResponseDto[]) => void;
  setSelectedContent: (content: ContentResponseDto | null) => void;
  addContent: (content: ContentResponseDto) => void;
  updateContent: (contentId: number, contentData: Partial<ContentResponseDto>) => void;
  removeContent: (contentId: number) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearContents: () => void;
  
  // Utility actions
  getContentById: (contentId: number) => ContentResponseDto | undefined;
  getContentsByCategory: (category: string) => ContentResponseDto[];
}

export const useContentStore = create<ContentStore>((set, get) => ({
  // Initial state
  contents: [],
  selectedContent: null,
  isLoading: false,
  error: null,

  // Actions
  setContents: (contents: ContentResponseDto[]) => {
    set({ contents, error: null });
  },

  setSelectedContent: (content: ContentResponseDto | null) => {
    set({ selectedContent: content });
  },

  addContent: (content: ContentResponseDto) => {
    set((state) => ({
      contents: [...state.contents, content],
      error: null,
    }));
  },

  updateContent: (contentId: number, contentData: Partial<ContentResponseDto>) => {
    set((state) => ({
      contents: state.contents.map((content) =>
        content.id === contentId ? { ...content, ...contentData } : content
      ),
      selectedContent:
        state.selectedContent?.id === contentId
          ? { ...state.selectedContent, ...contentData }
          : state.selectedContent,
      error: null,
    }));
  },

  removeContent: (contentId: number) => {
    set((state) => ({
      contents: state.contents.filter((content) => content.id !== contentId),
      selectedContent: 
        state.selectedContent?.id === contentId ? null : state.selectedContent,
      error: null,
    }));
  },

  setLoading: (isLoading: boolean) => {
    set({ isLoading });
  },

  setError: (error: string | null) => {
    set({ error });
  },

  clearContents: () => {
    set({
      contents: [],
      selectedContent: null,
      isLoading: false,
      error: null,
    });
  },

  // Utility actions
  getContentById: (contentId: number) => {
    const state = get();
    return state.contents.find((content) => content.id === contentId);
  },

  getContentsByCategory: (category: string) => {
    const state = get();
    return state.contents.filter((content) => content.category === category);
  },
}));