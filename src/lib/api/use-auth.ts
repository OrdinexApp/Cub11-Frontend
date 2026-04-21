"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { api } from "./client";
import { useAuthStore, type AuthUser } from "@/lib/stores/auth-store";
import type { TokenResponseDTO, UserDTO } from "./types";

export const meKey = ["me"] as const;

export function useMe() {
  const token = useAuthStore((s) => s.accessToken);
  const setUser = useAuthStore((s) => s.setUser);
  return useQuery<AuthUser>({
    queryKey: meKey,
    enabled: !!token,
    queryFn: async () => {
      const dto = await api<UserDTO>("/users/me");
      const user: AuthUser = {
        id: dto.id,
        email: dto.email,
        full_name: dto.full_name ?? null,
        credits_remaining: dto.credits_remaining,
      };
      setUser(user);
      return user;
    },
    staleTime: 15_000,
  });
}

export function useLogin() {
  const router = useRouter();
  const setTokens = useAuthStore((s) => s.setTokens);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (vars: { email: string; password: string }) => {
      const form = new URLSearchParams();
      form.set("username", vars.email);
      form.set("password", vars.password);
      const tokens = await api<TokenResponseDTO>("/auth/login", {
        method: "POST",
        form,
        auth: false,
      });
      setTokens(tokens.access_token, tokens.refresh_token);
      const me = await api<UserDTO>("/auth/me");
      useAuthStore.getState().setUser({
        id: me.id,
        email: me.email,
        full_name: me.full_name ?? null,
        credits_remaining: me.credits_remaining,
      });
      qc.invalidateQueries({ queryKey: meKey });
      return tokens;
    },
    onSuccess: () => {
      router.replace("/projects");
    },
  });
}

export function useRegister() {
  const router = useRouter();
  const setTokens = useAuthStore((s) => s.setTokens);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (vars: {
      email: string;
      password: string;
      full_name?: string;
    }) => {
      await api("/auth/register", {
        method: "POST",
        body: vars,
        auth: false,
      });
      const form = new URLSearchParams();
      form.set("username", vars.email);
      form.set("password", vars.password);
      const tokens = await api<TokenResponseDTO>("/auth/login", {
        method: "POST",
        form,
        auth: false,
      });
      setTokens(tokens.access_token, tokens.refresh_token);
      const me = await api<UserDTO>("/auth/me");
      useAuthStore.getState().setUser({
        id: me.id,
        email: me.email,
        full_name: me.full_name ?? null,
        credits_remaining: me.credits_remaining,
      });
      qc.invalidateQueries({ queryKey: meKey });
      return tokens;
    },
    onSuccess: () => {
      router.replace("/projects");
    },
  });
}

export function useLogout() {
  const router = useRouter();
  const qc = useQueryClient();
  return () => {
    useAuthStore.getState().clear();
    qc.clear();
    router.replace("/auth/login");
  };
}
