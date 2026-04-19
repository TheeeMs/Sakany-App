import axios from "axios";
import { create } from "zustand";
import {
  getCurrentUser,
  loginWithPhone,
  loginWithEmail,
  register,
  refreshAccessToken,
  sendOtp,
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
  sendOtpToPhone: (phoneNumber: string) => Promise<void>;
  loginWithPhoneOtp: (phoneNumber: string, otp: string) => Promise<void>;
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
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const requestUrl = error.config?.url || "";
    const dataMessage =
      typeof error.response?.data === "object" && error.response?.data !== null
        ? "message" in error.response.data &&
          typeof error.response.data.message === "string"
          ? error.response.data.message
          : null
        : null;

    if (dataMessage) {
      return dataMessage;
    }

    if (status === 409) {
      if (requestUrl.includes("/auth/send-otp")) {
        return "OTP already sent. Check your messages or try again in a minute.";
      }
      if (requestUrl.includes("/auth/login/phone")) {
        return "This OTP is invalid or expired. Please request a new code.";
      }
      if (requestUrl.includes("/auth/register")) {
        return "This account already exists. Try logging in instead.";
      }
    }
  }

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

  sendOtpToPhone: async (phoneNumber) => {
    set({ isLoading: true, error: null });

    try {
      await sendOtp({ phoneNumber });
      set({ isLoading: false });
    } catch (error) {
      set({
        isLoading: false,
        error: readErrorMessage(error),
      });
      throw error;
    }
  },

  loginWithPhoneOtp: async (phoneNumber, otp) => {
    set({ isLoading: true, error: null });

    try {
      const auth = await loginWithPhone({ phoneNumber, otp });
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
      const auth = await register({
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
