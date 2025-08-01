import { create } from 'zustand';
import { UserState, UserDto } from '@/types';

interface UserStore extends UserState {
  // Actions
  setUsers: (users: UserDto[]) => void;
  setCurrentUser: (user: UserDto | null) => void;
  addUser: (user: UserDto) => void;
  updateUser: (userId: number, userData: Partial<UserDto>) => void;
  removeUser: (userId: number) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearUsers: () => void;
}

export const useUserStore = create<UserStore>((set, get) => ({
  // Initial state
  users: [],
  currentUser: null,
  isLoading: false,
  error: null,

  // Actions
  setUsers: (users: UserDto[]) => {
    set({ users, error: null });
  },

  setCurrentUser: (user: UserDto | null) => {
    set({ currentUser: user });
  },

  addUser: (user: UserDto) => {
    set((state) => ({
      users: [...state.users, user],
      error: null,
    }));
  },

  updateUser: (userId: number, userData: Partial<UserDto>) => {
    set((state) => ({
      users: state.users.map((user) =>
        user.id === userId ? { ...user, ...userData } : user
      ),
      currentUser:
        state.currentUser?.id === userId
          ? { ...state.currentUser, ...userData }
          : state.currentUser,
      error: null,
    }));
  },

  removeUser: (userId: number) => {
    set((state) => ({
      users: state.users.filter((user) => user.id !== userId),
      currentUser: state.currentUser?.id === userId ? null : state.currentUser,
      error: null,
    }));
  },

  setLoading: (isLoading: boolean) => {
    set({ isLoading });
  },

  setError: (error: string | null) => {
    set({ error });
  },

  clearUsers: () => {
    set({
      users: [],
      currentUser: null,
      isLoading: false,
      error: null,
    });
  },
}));