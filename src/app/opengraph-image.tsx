import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "56px",
          background:
            "linear-gradient(135deg, #f4efe4 0%, #e7dcc6 45%, #c88d63 100%)",
          color: "#251b16",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              border: "1px solid rgba(37,27,22,0.18)",
              borderRadius: "999px",
              padding: "10px 18px",
              fontSize: 24,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
            }}
          >
            Sizely
          </div>
          <div style={{ fontSize: 24 }}>https://sizely.vercel.app</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div
            style={{
              display: "flex",
              fontSize: 76,
              fontWeight: 700,
              lineHeight: 1.05,
              maxWidth: 920,
            }}
          >
            Meça roupas e objetos a partir de fotos.
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 32,
              lineHeight: 1.35,
              maxWidth: 860,
              color: "rgba(37,27,22,0.8)",
            }}
          >
            Calibração manual por referência, resultados em centímetros e histórico
            local no navegador.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: 16,
              fontSize: 26,
              color: "rgba(37,27,22,0.82)",
            }}
          >
            <div style={{ display: "flex" }}>Client-side</div>
            <div style={{ display: "flex" }}>PWA</div>
            <div style={{ display: "flex" }}>Next.js 16</div>
          </div>
          <div
            style={{
              display: "flex",
              width: 220,
              height: 220,
              borderRadius: 36,
              background: "rgba(255,255,255,0.56)",
              border: "1px solid rgba(37,27,22,0.12)",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 84,
              fontWeight: 700,
            }}
          >
            cm
          </div>
        </div>
      </div>
    ),
    size,
  );
}
