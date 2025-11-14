import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useServiceStatus } from "@/components/ServiceStatusProvider";
import { Button } from "@/components/MuiButton";
import { Input } from "@/components/MuiInput";
import { Label } from "@/components/MuiLabel";
import { Alert, AlertDescription } from "@/components/MuiAlert";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/MuiCard";
import { isValidEmail } from "@/lib/utils";
import { AlertTriangle, Loader2, Sparkles } from "lucide-react";
import { Box, Container } from "@mui/material";

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
      
      localStorage.setItem("userId", data.userId);
      localStorage.setItem("userEmail", email);

      if (data.profileComplete) {
        setLocation("/profile");
      } else {
        setLocation("/register");
      }
    } catch (err: any) {
      setError(err.message || "Помилка з'єднання з сервером");
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          py: 4,
        }}
      >
        <Card sx={{ width: "100%", boxShadow: 3 }}>
          <CardContent>
            <Box sx={{ textAlign: "center", mb: 4 }}>
              <Box
                sx={{
                  mx: "auto",
                  width: 80,
                  height: 80,
                  background: "linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)",
                  borderRadius: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: 3,
                  mb: 3,
                }}
              >
                <Sparkles style={{ width: 40, height: 40, color: "white" }} />
              </Box>
              <CardTitle sx={{ fontSize: "2rem", mb: 1 }}>
                Привіт!
              </CardTitle>
              <CardDescription sx={{ fontSize: "1rem" }}>
                Введіть свою email адресу, щоб продовжити
              </CardDescription>
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {serviceUnavailable && (
                <Alert severity="error">
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <AlertTriangle style={{ width: 16, height: 16 }} />
                    <AlertDescription>{unavailableMessage}</AlertDescription>
                  </Box>
                </Alert>
              )}

              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                <Box>
                  <Label htmlFor="email" sx={{ display: "block", mb: 1, fontWeight: 500 }}>
                    Email адреса
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading || serviceUnavailable}
                    autoFocus
                    inputProps={{ "data-testid": "input-email" }}
                    fullWidth
                    size="medium"
                  />
                  {error && (
                    <Box sx={{ color: "error.main", fontSize: "0.875rem", mt: 1 }} data-testid="text-error">
                      {error}
                    </Box>
                  )}
                </Box>

                <Button
                  type="submit"
                  fullWidth
                  size="large"
                  variant="contained"
                  disabled={loading || serviceUnavailable}
                  sx={{
                    background: loading || serviceUnavailable ? undefined : "linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)",
                  }}
                  data-testid="button-submit"
                >
                  {loading ? (
                    <>
                      <Loader2 style={{ marginRight: 8, width: 20, height: 20, animation: "spin 1s linear infinite" }} />
                      Завантаження...
                    </>
                  ) : serviceUnavailable ? (
                    "Сервіс недоступний"
                  ) : (
                    "Продовжити"
                  )}
                </Button>
              </form>

              <Box sx={{ textAlign: "center", fontSize: "0.75rem", color: "text.secondary" }}>
                Це тестова версія. Авторизація тільки через email.
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}
