import { useEffect, useState } from "react";
import { AlertTriangle, RefreshCcw } from "lucide-react";

import { useServiceStatus } from "@/components/ServiceStatusProvider";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function ServiceStatusBanner() {
  const {
    state: phase,
    message,
    nextRetryAt,
    retry,
    isChecking,
  } = useServiceStatus();
  const [secondsRemaining, setSecondsRemaining] = useState<number | null>(null);

  useEffect(() => {
    if (phase !== "degraded" || !nextRetryAt) {
      setSecondsRemaining(null);
      return;
    }

    const update = () => {
      const diff = Math.ceil((nextRetryAt - Date.now()) / 1000);
      setSecondsRemaining(diff > 0 ? diff : 0);
    };

    update();
    const intervalId = window.setInterval(update, 1_000);
    return () => {
      window.clearInterval(intervalId);
    };
  }, [nextRetryAt, phase]);

  if (phase !== "degraded") {
    return null;
  }

  const description =
    message ??
    "Сервіс тимчасово недоступний. Спробуємо повторити запит трішки пізніше.";

  return (
    <div className="px-4 pt-4">
      <Alert variant="destructive" className="mx-auto w-full max-w-3xl">
        <AlertTriangle className="h-4 w-4" />
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <AlertTitle>Сервіс тимчасово недоступний</AlertTitle>
            <AlertDescription>
              {description}
              {secondsRemaining !== null && secondsRemaining > 0 && (
                <span className="ml-1 text-xs text-muted-foreground">
                  Наступна спроба через {secondsRemaining} с.
                </span>
              )}
            </AlertDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={retry}
            disabled={isChecking}
            className="sm:self-start"
          >
            <RefreshCcw className="mr-2 h-4 w-4" />
            {isChecking ? "Перевіряємо…" : "Спробувати зараз"}
          </Button>
        </div>
      </Alert>
    </div>
  );
}
