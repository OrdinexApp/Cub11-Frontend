"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowRight,
  Loader2,
  Eye,
  EyeOff,
  Sparkles,
  Check,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRegister } from "@/lib/api/use-auth";

const PERKS = [
  "Free preview — pay only when you love it",
  "Reels, Shorts & TikToks in seconds",
  "No credit card required",
];

export default function RegisterPage() {
  const register = useRegister();
  const [fullName, setFullName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    register.mutate({
      email,
      password,
      full_name: fullName || undefined,
    });
  }

  return (
    <div className="relative">
      {/* Eyebrow badge */}
      <div className="mb-5 flex justify-center">
        <span className="inline-flex items-center gap-1.5 rounded-sm border border-violet-600/15 bg-violet-600/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#7C3AED]">
          <Sparkles className="h-3 w-3" />
          Start free
        </span>
      </div>

      <div className="mb-6 text-center">
        <h1 className="text-[clamp(1.875rem,4.5vw,2.5rem)] font-semibold leading-[1.05] tracking-tight text-gray-900">
          Create your <span className="text-[#7C3AED]">Cubell</span> account
        </h1>
        <p className="mt-3 text-sm text-gray-600">
          Free preview, paid only when you accept.
        </p>
      </div>

      {/* Perks */}
      <ul className="mx-auto mb-6 flex max-w-[360px] flex-col gap-1.5">
        {PERKS.map((perk) => (
          <li
            key={perk}
            className="flex items-start gap-2 text-[13px] text-gray-700"
          >
            <span className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-emerald-500/15 text-emerald-600">
              <Check className="h-3 w-3" strokeWidth={3} />
            </span>
            {perk}
          </li>
        ))}
      </ul>

      {/* Glass card */}
      <div className="rounded-2xl border border-white/60 bg-white/60 p-6 shadow-[0_8px_32px_rgba(0,0,0,0.06)] backdrop-blur-md md:p-7">
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <div className="grid gap-1.5">
            <Label htmlFor="full_name" className="text-[13px] font-medium text-gray-800">
              Name
            </Label>
            <Input
              id="full_name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Aarav Patel"
              autoComplete="name"
              className="h-11 rounded-xl border-gray-200 bg-white/80 text-[15px] shadow-sm focus-visible:ring-[#7C3AED]/40"
            />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="email" className="text-[13px] font-medium text-gray-800">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="h-11 rounded-xl border-gray-200 bg-white/80 text-[15px] shadow-sm focus-visible:ring-[#7C3AED]/40"
            />
          </div>

          <div className="grid gap-1.5">
            <Label
              htmlFor="password"
              className="text-[13px] font-medium text-gray-800"
            >
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters"
                minLength={8}
                required
                className="h-11 rounded-xl border-gray-200 bg-white/80 pr-10 text-[15px] shadow-sm focus-visible:ring-[#7C3AED]/40"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute inset-y-0 right-0 grid w-10 place-items-center text-gray-500 transition-colors hover:text-gray-700"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {register.isError && (
            <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-[12.5px] text-rose-700">
              {(register.error as Error).message ?? "Registration failed"}
            </div>
          )}

          <button
            type="submit"
            disabled={register.isPending}
            className="mt-1 inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[#7C3AED] px-6 text-[15px] font-semibold text-white shadow-[0_10px_15px_-3px_rgba(124,58,237,0.3)] transition-all hover:-translate-y-0.5 hover:bg-[#6D28D9] hover:shadow-[0_20px_25px_-5px_rgba(124,58,237,0.3)] disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
          >
            {register.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Creating account…
              </>
            ) : (
              <>
                Create account
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>
      </div>

      <p className="mt-6 text-center text-sm text-gray-600">
        Already have an account?{" "}
        <Link href="/auth/login" className="font-semibold text-[#7C3AED] hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
