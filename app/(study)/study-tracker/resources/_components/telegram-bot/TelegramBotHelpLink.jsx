import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import React from "react";

const TelegramBotHelpLink = () => {
  return (
    <div>
      <Link
        href="/help/telegram-bot"
        prefetch={false}
        aria-label="View Telegram bot setup guide"
      >
        <Button
          variant="outline"
          size="sm"
          className="w-full gap-1.5 text-sky-600 border-sky-200 hover:bg-sky-50 dark:border-sky-800 dark:hover:bg-sky-950/40"
        >
          <ExternalLink size={13} />
          Setup Guide
        </Button>
      </Link>
    </div>
  );
};

export default TelegramBotHelpLink;
