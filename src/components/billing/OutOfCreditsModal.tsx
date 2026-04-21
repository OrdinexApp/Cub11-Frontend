"use client";

import * as React from "react";
import Link from "next/link";
import { Coins, ShieldCheck } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { billingBus } from "@/lib/api/billing-bus";

export function OutOfCreditsModal() {
  const [open, setOpen] = React.useState(false);
  const [message, setMessage] = React.useState<string | undefined>();

  React.useEffect(() => {
    return billingBus.onOutOfCredits(({ message }) => {
      setMessage(message);
      setOpen(true);
    });
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto mb-2 grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/20">
            <Coins className="h-6 w-6" />
          </div>
          <DialogTitle className="text-center text-xl">Out of credits</DialogTitle>
          <DialogDescription className="text-center">
            {message ?? "You don't have enough credits to render this video. Top up to keep creating."}
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-xl border border-success/20 bg-success/5 p-3 text-xs text-success flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 shrink-0" />
          We never charge for failed generations. Auto-refund within seconds.
        </div>

        <DialogFooter className="sm:justify-center gap-2">
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Not now
          </Button>
          <Button asChild onClick={() => setOpen(false)}>
            <Link href="/account">Top up credits</Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
