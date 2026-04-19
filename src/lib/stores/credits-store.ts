import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CreditEntry } from "@/types/project";

interface CreditsState {
  balance: number;
  history: CreditEntry[];
  charge: (amount: number, note: string, reason?: CreditEntry["reason"]) => string;
  refund: (entryId: string, note?: string) => void;
  topUp: (amount: number, note?: string) => void;
}

const seed: CreditEntry[] = [
  {
    id: "ce-welcome",
    at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
    amount: 200,
    reason: "welcome",
    note: "Welcome bonus — enjoy Cube11",
  },
  {
    id: "ce-1",
    at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    amount: -12,
    reason: "render",
    note: "HD render — Diwali Sale Hook",
  },
  {
    id: "ce-2",
    at: new Date(Date.now() - 1000 * 60 * 60 * 22).toISOString(),
    amount: 12,
    reason: "refund-failed",
    note: "Auto-refund — generation failed safety check",
    refunded: true,
  },
];

const initialBalance = seed.reduce((sum, e) => sum + e.amount, 0);

export const useCreditsStore = create<CreditsState>()(
  persist(
    (set, get) => ({
      balance: initialBalance,
      history: seed,
      charge: (amount, note, reason = "render") => {
        const id = `ce-${Date.now()}`;
        set((s) => ({
          balance: s.balance - amount,
          history: [
            { id, at: new Date().toISOString(), amount: -amount, reason, note },
            ...s.history,
          ],
        }));
        return id;
      },
      refund: (entryId, note) => {
        const entry = get().history.find((e) => e.id === entryId);
        if (!entry || entry.refunded) return;
        set((s) => ({
          balance: s.balance + Math.abs(entry.amount),
          history: [
            {
              id: `ce-${Date.now()}`,
              at: new Date().toISOString(),
              amount: Math.abs(entry.amount),
              reason: "refund-failed",
              note: note ?? "Auto-refund",
              refunded: true,
            },
            ...s.history.map((e) =>
              e.id === entryId ? { ...e, refunded: true } : e,
            ),
          ],
        }));
      },
      topUp: (amount, note = "Top-up") => {
        set((s) => ({
          balance: s.balance + amount,
          history: [
            {
              id: `ce-${Date.now()}`,
              at: new Date().toISOString(),
              amount,
              reason: "topup",
              note,
            },
            ...s.history,
          ],
        }));
      },
    }),
    { name: "cube11-credits" },
  ),
);
