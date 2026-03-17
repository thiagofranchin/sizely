"use client";

import { useEffect, useState } from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

export function InstallPromptButton() {
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(
    typeof window !== "undefined"
      ? window.matchMedia("(display-mode: standalone)").matches
      : false,
  );

  useEffect(() => {
    function handleBeforeInstallPrompt(event: Event) {
      event.preventDefault();
      setInstallEvent(event as BeforeInstallPromptEvent);
    }

    function handleInstalled() {
      setIsInstalled(true);
      setInstallEvent(null);
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleInstalled);
    };
  }, []);

  if (isInstalled) {
    return null;
  }

  if (!installEvent) {
    return null;
  }

  return (
    <Button
      type="button"
      variant="outline"
      onClick={async () => {
        await installEvent.prompt();
        await installEvent.userChoice;
        setInstallEvent(null);
      }}
      className="h-10 rounded-full bg-white/70 px-3 dark:bg-card/80 sm:h-11 sm:px-4"
    >
      <Download className="size-4" />
      Instalar app
    </Button>
  );
}
