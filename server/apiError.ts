export type ApiError = { status: number; message: string };

function isDbUnavailableError(err: any): boolean {
  const code = err?.code || err?.errno;
  const msg = String(err?.message || "").toLowerCase();
  return (
    code === "ECONNREFUSED" ||
    code === "ECONNRESET" ||
    code === "ENOTFOUND" ||
    code === "ETIMEDOUT" ||
    code === "SELF_SIGNED_CERT_IN_CHAIN" ||
    code === "DEPTH_ZERO_SELF_SIGNED_CERT" ||
    code === "UNABLE_TO_VERIFY_LEAF_SIGNATURE" ||
    code === "ERR_TLS_CERT_ALTNAME_INVALID" ||
    // Postgres-specific conditions
    code === "57P01" || // admin shutdown
    code === "57P03" || // cannot connect now
    msg.includes("econnrefused") ||
    msg.includes("connect timeout") ||
    msg.includes("timeout connecting") ||
    msg.includes("server closed the connection") ||
    msg.includes("the database system is starting up") ||
    msg.includes("the database system is shutting down") ||
    msg.includes("no pg_hba.conf entry") ||
    // TLS/SSL related messages
    msg.includes("self signed certificate") ||
    msg.includes("self-signed certificate") ||
    msg.includes("self signed certificate in certificate chain") ||
    msg.includes("unable to verify the first certificate") ||
    msg.includes("certificate has expired") ||
    (msg.includes("tls") && msg.includes("certificate")) ||
    (msg.includes("ssl") && msg.includes("certificate"))
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
