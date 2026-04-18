import { create } from "zustand";
import {
  getCurrentUser,
  loginWithEmail,
  registerWithEmail,
  refreshAccessToken,
  type CurrentUser,
  type RegisterLoginMethod,
  type ResidentType,
} from "../services/auth";
import { setApiAccessToken } from "../services/api";

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: CurrentUser | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  loginWithEmailPassword: (email: string, password: string) => Promise<void>;
  registerWithEmailPassword: (params: {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
    password: string;
    type: ResidentType;
    unitId: string;
    loginMethod: RegisterLoginMethod;
  }) => Promise<void>;
  fetchCurrentUser: () => Promise<void>;
  tryRefreshSession: () => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
}

function readErrorMessage(error: unknown) {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    typeof error.response === "object" &&
    error.response !== null &&
    "data" in error.response &&
    typeof error.response.data === "object" &&
    error.response.data !== null &&
    "message" in error.response.data &&
    typeof error.response.data.message === "string"
  ) {
    return error.response.data.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong. Please try again.";
}

export const useAuthStore = create<AuthState>((set, get) => ({
  accessToken: null,
  refreshToken: null,
  user: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,

  loginWithEmailPassword: async (email, password) => {
    set({ isLoading: true, error: null });

    try {
      const auth = await loginWithEmail({ email, password });
      setApiAccessToken(auth.accessToken);

      set({
        accessToken: auth.accessToken,
        refreshToken: auth.refreshToken,
        isAuthenticated: true,
      });

      const me = await getCurrentUser();
      set({ user: me, isLoading: false });
    } catch (error) {
      setApiAccessToken(null);
      set({
        accessToken: null,
        refreshToken: null,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: readErrorMessage(error),
      });
      throw error;
    }
  },

  registerWithEmailPassword: async ({
    firstName,
    lastName,
    phoneNumber,
    email,
    password,
    type,
    unitId,
    loginMethod,
  }) => {
    set({ isLoading: true, error: null });

    try {
      const auth = await registerWithEmail({
        firstName,
        lastName,
        phoneNumber,
        email,
        password,
        type,
        unitId,
        loginMethod,
      });

      setApiAccessToken(auth.accessToken);
      set({
        accessToken: auth.accessToken,
        refreshToken: auth.refreshToken,
        isAuthenticated: true,
      });

      const me = await getCurrentUser();
      set({ user: me, isLoading: false });
    } catch (error) {
      setApiAccessToken(null);
      set({
        accessToken: null,
        refreshToken: null,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: readErrorMessage(error),
      });
      throw error;
    }
  },

  fetchCurrentUser: async () => {
    const token = get().accessToken;
    if (!token) {
      return;
    }

    set({ isLoading: true, error: null });

    try {
      setApiAccessToken(token);
      const me = await getCurrentUser();
      set({ user: me, isLoading: false, isAuthenticated: true });
    } catch (error) {
      set({
        isLoading: false,
        error: readErrorMessage(error),
      });
    }
  },

  tryRefreshSession: async () => {
    const refreshToken = get().refreshToken;

    if (!refreshToken) {
      return false;
    }

    set({ isLoading: true, error: null });

    try {
      const auth = await refreshAccessToken({ refreshToken });
      setApiAccessToken(auth.accessToken);

      const me = await getCurrentUser();

      set({
        accessToken: auth.accessToken,
        refreshToken: auth.refreshToken,
        user: me,
        isAuthenticated: true,
        isLoading: false,
      });

      return true;
    } catch {
      setApiAccessToken(null);
      set({
        accessToken: null,
        refreshToken: null,
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
      return false;
    }
  },

  logout: () => {
    setApiAccessToken(null);
    set({
      accessToken: null,
      refreshToken: null,
      user: null,
      error: null,
      isAuthenticated: false,
    });
  },

  clearError: () => set({ error: null }),
}));
