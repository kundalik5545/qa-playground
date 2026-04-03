"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { Send } from "lucide-react";

export default function TelegramBotResourceLink() {
  const { data: session } = authClient.useSession();
  const href = session?.user ? "/study-tracker/resources" : "/login";

  return (
    <Link href={href} prefetch={false} aria-label="Save resources via Telegram bot">
      <Button className="w-full bg-sky-500 hover:bg-sky-600 text-white gap-2">
        <Send size={15} />
        {session?.user ? "Go to Resources" : "Sign In to Start"}
      </Button>
    </Link>
  );
}
