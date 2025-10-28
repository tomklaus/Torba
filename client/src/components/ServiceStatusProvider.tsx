import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

const DEFAULT_UNAVAILABLE_MESSAGE =
  "Сервіс тимчасово недоступний. Ми повторимо спробу автоматично.";
const MAX_BACKOFF = 30_000;
const BASE_DELAY = 2_000;
const SUCCESS_RECHECK_DELAY = 60_000;

function getBackoffDelay(attempt: number): number {
  const exponent = Math.max(0, Math.min(attempt - 1, 4));
  return Math.min(MAX_BACKOFF, BASE_DELAY * Math.pow(2, exponent));
}

type ServicePhase = "checking" | "online" | "degraded";

interface ServiceStatusState {
  state: ServicePhase;
  message: string | null;
  lastChecked: number | null;
  nextRetryAt: number | null;
  isChecking: boolean;
}

interface ServiceStatusContextValue extends ServiceStatusState {
  isServiceAvailable: boolean;
  retry: () => void;
}

const INITIAL_STATE: ServiceStatusState = {
  state: "checking",
  message: null,
  lastChecked: null,
  nextRetryAt: null,
  isChecking: true,
};

const ServiceStatusContext = createContext<ServiceStatusContextValue | undefined>(
  undefined,
);

function normaliseNetworkError(error: unknown): string {
  if (error instanceof DOMException && error.name === "AbortError") {
    return "Сервер не відповідає. Спробуємо знову автоматично.";
  }

  const raw =
    typeof error === "string"
      ? error
      : error instanceof Error
      ? error.message
      : null;

  if (!raw) {
    return DEFAULT_UNAVAILABLE_MESSAGE;
  }

  const lower = raw.toLowerCase();

  if (lower.includes("failed to fetch") || lower.includes("network")) {
    return "Не вдалося з'єднатися з сервером. Перевірте підключення до інтернету.";
  }

  if (lower.includes("timeout") || lower.includes("abort")) {
    return "Сервер не відповідає. Спробуємо знову автоматично.";
  }

  return raw;
}

async function extractResponseMessage(
  res: Response,
  fallback: string,
): Promise<string> {
  try {
    const data = await res.json();
    const message = (data as any)?.message;
    if (typeof message === "string" && message.trim().length > 0) {
      return message;
    }
  } catch {
    // ignore JSON parsing errors
  }

  return fallback;
}

export function ServiceStatusProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ServiceStatusState>(INITIAL_STATE);
  const manualCheckRef = useRef<() => void>(() => {});
  const lastLoggedMessageRef = useRef<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    let timeoutId: number | null = null;
    let attempt = 0;

    const clearScheduled = () => {
      if (timeoutId !== null) {
        window.clearTimeout(timeoutId);
        timeoutId = null;
      }
    };

    const scheduleNext = (delay: number) => {
      if (cancelled) {
        return;
      }

      clearScheduled();
      timeoutId = window.setTimeout(() => {
        void runCheck();
      }, delay);
    };

    async function runCheck() {
      if (cancelled) {
        return;
      }

      setState((prev) => ({
        ...prev,
        isChecking: true,
        nextRetryAt: prev.state === "degraded" ? null : prev.nextRetryAt,
      }));

      const controller = new AbortController();
      const abortTimeout = window.setTimeout(() => controller.abort(), 4_000);

      try {
        const res = await fetch("/api/auth/check", {
          cache: "no-store",
          credentials: "include",
          headers: { Accept: "application/json" },
          signal: controller.signal,
        });

        if (cancelled) {
          return;
        }

        if (res.status === 503) {
          attempt += 1;
          const delay = getBackoffDelay(attempt);
          const message = await extractResponseMessage(
            res,
            DEFAULT_UNAVAILABLE_MESSAGE,
          );

          if (message !== lastLoggedMessageRef.current) {
            lastLoggedMessageRef.current = message;
            console.warn("[ServiceStatus] API недоступний (503):", message);
          }

          setState({
            state: "degraded",
            message,
            lastChecked: Date.now(),
            nextRetryAt: Date.now() + delay,
            isChecking: false,
          });

          scheduleNext(delay);
          return;
        }

        if (!res.ok) {
          attempt += 1;
          const delay = getBackoffDelay(attempt);
          const message = await extractResponseMessage(
            res,
            `Сервіс відповів зі статусом ${res.status}`,
          );

          if (message !== lastLoggedMessageRef.current) {
            lastLoggedMessageRef.current = message;
            console.warn(
              "[ServiceStatus] Неочікувана відповідь:",
              res.status,
              message,
            );
          }

          setState({
            state: "degraded",
            message,
            lastChecked: Date.now(),
            nextRetryAt: Date.now() + delay,
            isChecking: false,
          });

          scheduleNext(delay);
          return;
        }

        if (lastLoggedMessageRef.current !== null) {
          console.info("[ServiceStatus] Сервіс відновлено");
        }

        lastLoggedMessageRef.current = null;
        attempt = 0;

        setState({
          state: "online",
          message: null,
          lastChecked: Date.now(),
          nextRetryAt: Date.now() + SUCCESS_RECHECK_DELAY,
          isChecking: false,
        });

        scheduleNext(SUCCESS_RECHECK_DELAY);
      } catch (error) {
        if (cancelled) {
          return;
        }

        attempt += 1;
        const delay = getBackoffDelay(attempt);
        const message = normaliseNetworkError(error);

        if (message !== lastLoggedMessageRef.current) {
          lastLoggedMessageRef.current = message;
          console.warn(
            "[ServiceStatus] Помилка перевірки доступності:",
            message,
            error,
          );
        }

        setState({
          state: "degraded",
          message,
          lastChecked: Date.now(),
          nextRetryAt: Date.now() + delay,
          isChecking: false,
        });

        scheduleNext(delay);
      } finally {
        window.clearTimeout(abortTimeout);
      }
    }

    manualCheckRef.current = () => {
      attempt = 0;
      clearScheduled();
      setState((prev) => ({ ...prev, isChecking: true, nextRetryAt: null }));
      void runCheck();
    };

    void runCheck();

    return () => {
      cancelled = true;
      clearScheduled();
    };
  }, []);

  const retry = useCallback(() => {
    manualCheckRef.current();
  }, []);

  const value = useMemo<ServiceStatusContextValue>(
    () => ({
      ...state,
      isServiceAvailable: state.state !== "degraded",
      retry,
    }),
    [state, retry],
  );

  return (
    <ServiceStatusContext.Provider value={value}>
      {children}
    </ServiceStatusContext.Provider>
  );
}

export function useServiceStatus(): ServiceStatusContextValue {
  const context = useContext(ServiceStatusContext);
  if (!context) {
    throw new Error("useServiceStatus must be used within a ServiceStatusProvider");
  }
  return context;
}
