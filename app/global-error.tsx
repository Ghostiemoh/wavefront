"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          background: "#050505",
          color: "#EAEAF0",
          fontFamily:
            "Geist, ui-sans-serif, system-ui, -apple-system, sans-serif",
          minHeight: "100dvh",
          margin: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px",
        }}
      >
        <div
          style={{
            maxWidth: 420,
            width: "100%",
            textAlign: "center",
            padding: "32px",
            borderRadius: "20px",
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          <p
            style={{
              fontSize: 10,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#505068",
              marginBottom: 8,
              fontFamily: "JetBrains Mono, ui-monospace, monospace",
            }}
          >
            Fatal Signal
          </p>
          <h1
            style={{
              fontSize: 22,
              fontWeight: 700,
              margin: "0 0 8px",
              letterSpacing: "-0.02em",
            }}
          >
            Wavefront crashed.
          </h1>
          <p
            style={{
              fontSize: 14,
              color: "#888898",
              lineHeight: 1.55,
              margin: "0 0 24px",
            }}
          >
            A fatal error reached the root. Reload to try again.
          </p>
          <button
            type="button"
            onClick={() => reset()}
            style={{
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 18px",
              borderRadius: 9999,
              background: "#00D4FF",
              color: "#050505",
              fontWeight: 600,
              fontSize: 13,
              border: "none",
              boxShadow: "0 0 24px rgba(0, 212, 255, 0.15)",
            }}
          >
            Reload
          </button>
        </div>
      </body>
    </html>
  );
}
