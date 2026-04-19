"use client";

import { Coins, ShieldCheck, Plus } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useCreditsStore } from "@/lib/stores/credits-store";
import { timeAgo, cn } from "@/lib/utils";
import type { CreditEntry } from "@/types/project";

const REASON_LABEL: Record<CreditEntry["reason"], string> = {
  preview: "Preview",
  render: "HD render",
  "refund-failed": "Auto-refund",
  topup: "Top-up",
  welcome: "Welcome bonus",
};

const PACKS = [
  { credits: 200, price: "$5", per: "$0.025/credit", popular: false },
  { credits: 500, price: "$10", per: "$0.020/credit", popular: true },
  { credits: 1500, price: "$25", per: "$0.017/credit", popular: false },
];

export default function AccountPage() {
  const { balance, history, topUp } = useCreditsStore();

  return (
    <div className="mx-auto w-full max-w-4xl px-4 md:px-8 py-8 md:py-12">
      <header className="mb-8 md:mb-10 flex items-center gap-4">
        <Avatar className="h-14 w-14">
          <AvatarFallback>C11</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
            Your account
          </h1>
          <p className="text-sm text-muted-foreground">
            creator@cube11.app · Free plan
          </p>
        </div>
      </header>

      <Card className="overflow-hidden">
        <div className="indigo-gradient">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Coins className="h-5 w-5 text-primary" />
                Credits
              </span>
              <span className="font-mono text-3xl font-semibold">{balance}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="inline-flex items-center gap-1.5 text-xs text-success">
              <ShieldCheck className="h-3.5 w-3.5" />
              We never charge for failed generations. Auto-refund within seconds.
            </p>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {PACKS.map((p) => (
                <button
                  key={p.credits}
                  onClick={() => topUp(p.credits, `Top-up — ${p.credits} credits`)}
                  className={cn(
                    "relative rounded-2xl border bg-card p-4 text-left transition hover:border-primary/40",
                    p.popular ? "border-primary" : "border-border/60",
                  )}
                >
                  {p.popular && (
                    <Badge className="absolute -top-2 right-3">Popular</Badge>
                  )}
                  <p className="font-mono text-xl font-semibold">{p.credits} cr</p>
                  <p className="mt-1 text-sm">{p.price}</p>
                  <p className="text-[11px] text-muted-foreground">{p.per}</p>
                  <Button size="sm" variant="soft" className="mt-3 w-full">
                    <Plus className="h-3.5 w-3.5" />
                    Top up
                  </Button>
                </button>
              ))}
            </div>
          </CardContent>
        </div>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Credit activity</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ul className="divide-y divide-border/60">
            {history.map((e) => (
              <li
                key={e.id}
                className="flex items-start justify-between gap-4 px-6 py-3.5"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium leading-tight">{e.note}</p>
                  <p className="text-[11px] text-muted-foreground">
                    {REASON_LABEL[e.reason]} · {timeAgo(e.at)}
                  </p>
                </div>
                <span
                  className={cn(
                    "shrink-0 font-mono text-sm",
                    e.amount >= 0 ? "text-success" : "text-foreground",
                  )}
                >
                  {e.amount >= 0 ? "+" : ""}
                  {e.amount}
                </span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Separator className="my-10" />

      <div className="text-center text-xs text-muted-foreground">
        Need help? hello@cube11.app
      </div>
    </div>
  );
}
