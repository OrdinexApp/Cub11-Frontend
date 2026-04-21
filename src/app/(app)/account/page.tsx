"use client";

import { Coins, ShieldCheck, Plus, LogOut, Sparkles } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useLogout, useMe } from "@/lib/api/use-auth";
import { cn } from "@/lib/utils";

const PACKS = [
  { credits: 200, price: "$5", per: "$0.025/credit", popular: false },
  { credits: 500, price: "$10", per: "$0.020/credit", popular: true },
  { credits: 1500, price: "$25", per: "$0.017/credit", popular: false },
];

function initialsOf(name?: string | null, email?: string) {
  const src = name || email || "U";
  const parts = src.split(/\s|@/).filter(Boolean);
  return (parts[0]?.[0] ?? "U").toUpperCase() + (parts[1]?.[0] ?? "").toUpperCase();
}

export default function AccountPage() {
  const me = useMe();
  const logout = useLogout();
  const balance = me.data?.credits_remaining ?? 0;

  return (
    <div className="mx-auto w-full max-w-4xl px-4 md:px-8 py-8 md:py-12">
      <header className="mb-8 md:mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="h-14 w-14">
            <AvatarFallback>{initialsOf(me.data?.full_name, me.data?.email)}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
              {me.data?.full_name || "Your account"}
            </h1>
            <p className="text-sm text-muted-foreground">
              {me.data?.email ?? "—"} · Free plan
            </p>
          </div>
        </div>
        <Button variant="outline" size="lg" onClick={logout}>
          <LogOut className="h-4 w-4" />
          Sign out
        </Button>
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
                <div
                  key={p.credits}
                  className={cn(
                    "relative rounded-2xl border bg-card p-4 text-left transition",
                    p.popular ? "border-primary" : "border-border/60",
                  )}
                >
                  {p.popular && (
                    <Badge className="absolute -top-2 right-3">Popular</Badge>
                  )}
                  <p className="font-mono text-xl font-semibold">{p.credits} cr</p>
                  <p className="mt-1 text-sm">{p.price}</p>
                  <p className="text-[11px] text-muted-foreground">{p.per}</p>
                  <Button size="sm" variant="soft" className="mt-3 w-full" disabled>
                    <Plus className="h-3.5 w-3.5" />
                    Top up
                  </Button>
                </div>
              ))}
            </div>
            <p className="mt-3 text-[11px] text-muted-foreground">
              Payments coming soon — top-up via the API once Stripe checkout is wired.
            </p>
          </CardContent>
        </div>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Recent activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid place-items-center rounded-2xl border border-dashed border-border/60 bg-card/30 px-6 py-10 text-center">
            <Sparkles className="h-6 w-6 text-primary" />
            <p className="mt-3 text-sm font-medium">Your credit history will appear here</p>
            <p className="mt-1 max-w-sm text-xs text-muted-foreground">
              Once the backend ledger endpoint is live, every charge, refund, and top-up
              will show up in this list — no surprises.
            </p>
          </div>
        </CardContent>
      </Card>

      <Separator className="my-10" />

      <div className="text-center text-xs text-muted-foreground">
        Need help? hello@cube11.app
      </div>
    </div>
  );
}
