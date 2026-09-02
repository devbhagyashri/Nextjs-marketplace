"use client";

import { useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { Check, Loader2 } from "lucide-react";

type ExpressInterestButtonProps = {
  companyId: string;
  sellerId: string;
  alreadyInterested?: boolean;
  className?: string;
};

export function ExpressInterestButton({
  companyId,
  sellerId,
  alreadyInterested = false,
  className,
}: ExpressInterestButtonProps) {
  const { user, loading } = useAuth();
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(alreadyInterested);
  const [message, setMessage] = useState("");
  const supabase = useMemo(() => createClient(), []);

  const isOwner = Boolean(user && user.id === sellerId);

  async function handleClick() {
    if (!user) {
      setMessage("Sign in to express interest.");
      return;
    }

    if (isOwner || sent) {
      return;
    }

    setSending(true);
    setMessage("");

    const { error } = await supabase.from("company_interests").insert({
      user_id: user.id,
      company_id: companyId,
      buyer_email: user.email,
    });

    setSending(false);

    if (error) {
      if (error.code === "23505") {
        setSent(true);
        setMessage("You already expressed interest.");
        return;
      }
      setMessage(error.message);
      return;
    }

    setSent(true);
    setMessage("Interest sent to the seller.");
  }

  if (loading) {
    return (
      <Button disabled className={className}>
        <Loader2 className="animate-spin" />
      </Button>
    );
  }

  if (!user) {
    return (
      <div className={className}>
        <Button disabled variant="secondary" className="w-full">
          Sign in to express interest
        </Button>
      </div>
    );
  }

  if (isOwner) {
    return (
      <Button disabled variant="secondary" className={className}>
        Your listing
      </Button>
    );
  }

  return (
    <div className={className}>
      <Button className="w-full" onClick={handleClick} disabled={sending || sent}>
        {sending ? (
          <Loader2 className="animate-spin" />
        ) : sent ? (
          <>
            <Check />
            Interest sent
          </>
        ) : (
          "Express interest"
        )}
      </Button>
      {message && <p className="mt-2 text-xs text-muted-foreground">{message}</p>}
    </div>
  );
}
