export type ApiError = { status: number; message: string };

function isDbUnavailableError(err: any): boolean {
  const code = err?.code || err?.errno;
  const msg = String(err?.message || "").toLowerCase();
  return (
    code === "ECONNREFUSED" ||
    code === "ECONNRESET" ||
    code === "ENOTFOUND" ||
    code === "ETIMEDOUT" ||
    msg.includes("econnrefused") ||
    msg.includes("connect timeout") ||
    msg.includes("server closed the connection") ||
    msg.includes("the database system is starting up") ||
    msg.includes("the database system is shutting down") ||
    msg.includes("no pg_hba.conf entry")
  );
}

export function mapApiError(err: any, fallbackMessage = "Помилка сервера"): ApiError {
  if (isDbUnavailableError(err)) {
    return { status: 503, message: "База даних недоступна" };
  }

  const status = err?.status || err?.statusCode || 500;
  const message = err?.message || fallbackMessage;
  return { status, message };
}
