import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useServiceStatus } from "@/components/ServiceStatusProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { isValidEmail } from "@/lib/utils";
import { AlertTriangle, Loader2, Sparkles } from "lucide-react";

export default function LoginPage() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { isServiceAvailable, message: serviceStatusMessage } = useServiceStatus();
  const serviceUnavailable = !isServiceAvailable;
  const unavailableMessage =
    serviceStatusMessage ?? "Сервіс тимчасово недоступний. Спробуйте трохи пізніше.";

  useEffect(() => {
    if (!serviceUnavailable && error === unavailableMessage) {
      setError("");
    }
  }, [serviceUnavailable, error, unavailableMessage]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !isValidEmail(email)) {
      setError("Введіть коректну email адресу");
      return;
    }

    if (serviceUnavailable) {
      setError(unavailableMessage);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Помилка авторізації");
      }

      const data = await response.json();
      
      // Зберігаємо userId і email в localStorage
      localStorage.setItem("userId", data.userId);
      localStorage.setItem("userEmail", email);

      // Якщо профіль завершений - редірект на профіль
      if (data.profileComplete) {
        setLocation("/profile");
      } else {
        // Якщо профіль не завершений - редірект на реєстрацію
        setLocation("/register");
      }
    } catch (err: any) {
      setError(err.message || "Помилка з'єднання з сервером");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900/20 via-background to-blue-900/20 px-4">
      <Card className="w-full max-w-md border-card-border shadow-xl">
        <CardHeader className="space-y-4 text-center pb-8">
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Привіт!
          </CardTitle>
          <CardDescription className="text-base text-muted-foreground">
            Введіть свою email адресу, щоб продовжити
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {serviceUnavailable && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{unavailableMessage}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email адреса
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 text-base"
                  disabled={loading || serviceUnavailable}
                  autoFocus
                  data-testid="input-email"
                />
                {error && (
                  <p className="text-sm text-destructive" data-testid="text-error">
                    {error}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full h-12 text-base font-medium bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                disabled={loading || serviceUnavailable}
                data-testid="button-submit"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Завантаження...
                  </>
                ) : serviceUnavailable ? (
                  "Сервіс недоступний"
                ) : (
                  "Продовжити"
                )}
              </Button>
            </form>

            <p className="text-xs text-muted-foreground text-center">
              Це тестова версія. Авторизація тільки через email.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
