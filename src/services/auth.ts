import { api } from "./api";
import axios from "axios";

export interface AuthResponse {
  userId?: string | null;
  accessToken: string;
  refreshToken: string;
}

export interface LoginEmailPayload {
  email: string;
  password: string;
}

export interface SendOtpPayload {
  phoneNumber: string;
}

export interface LoginPhonePayload {
  phoneNumber: string;
  otp: string;
}

export interface SendOtpResponse {
  message?: string;
  success?: boolean;
}

export type RegisterLoginMethod = "EMAIL_PASSWORD" | "PHONE_OTP" | "GOOGLE";
export type ResidentType = "PROPERTY_OWNER" | "TENANT" | "FAMILY_MEMBER";

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  password: string;
  type: ResidentType;
  unitId: string;
  loginMethod: RegisterLoginMethod;
}

export interface RefreshPayload {
  refreshToken: string;
}

export interface CurrentUser {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  role: string;
  isActive: boolean;
  isPhoneVerified: boolean;
  loginMethod: string;
}

export async function loginWithEmail(payload: LoginEmailPayload) {
  const { data } = await api.post<AuthResponse>("/auth/login/email", payload);
  return data;
}

export async function sendOtp(payload: SendOtpPayload) {
  const phone = payload.phoneNumber.trim();
  const candidates: Array<Record<string, string>> = [
    { phoneNumber: phone },
    { phone: phone },
    { mobile: phone },
    { msisdn: phone },
  ];

  let lastError: unknown = null;

  for (const body of candidates) {
    try {
      const { data } = await api.post<SendOtpResponse>("/auth/send-otp", body);
      return data;
    } catch (error) {
      lastError = error;

      // Retry with alternative keys only for validation/conflict failures.
      if (
        !axios.isAxiosError(error) ||
        (error.response?.status !== 400 && error.response?.status !== 409)
      ) {
        throw error;
      }
    }
  }

  throw lastError;
}

export async function loginWithPhone(payload: LoginPhonePayload) {
  const candidates: Array<Record<string, string>> = [
    { phoneNumber: payload.phoneNumber, otp: payload.otp },
    { phoneNumber: payload.phoneNumber, code: payload.otp },
    { phoneNumber: payload.phoneNumber, otpCode: payload.otp },
    { phone: payload.phoneNumber, otp: payload.otp },
    { phone: payload.phoneNumber, code: payload.otp },
    { phone: payload.phoneNumber, otpCode: payload.otp },
  ];

  let lastError: unknown = null;

  for (const body of candidates) {
    try {
      const { data } = await api.post<AuthResponse>("/auth/login/phone", body);
      return data;
    } catch (error) {
      lastError = error;

      // Retry with alternative keys only for typical validation/conflict failures.
      if (
        !axios.isAxiosError(error) ||
        (error.response?.status !== 400 && error.response?.status !== 409)
      ) {
        throw error;
      }
    }
  }

  throw lastError;
}

export async function register(payload: RegisterPayload) {
  const { data } = await api.post<AuthResponse>("/auth/register", payload);
  return data;
}

export async function registerWithEmail(payload: RegisterPayload) {
  return register(payload);
}

export async function refreshAccessToken(payload: RefreshPayload) {
  const { data } = await api.post<AuthResponse>("/auth/refresh", payload);
  return data;
}

export async function getCurrentUser() {
  const { data } = await api.get<CurrentUser>("/auth/me");
  return data;
}
