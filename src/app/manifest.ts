import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Sizely",
    short_name: "Sizely",
    description:
      "Ferramenta client-side para medir roupas a partir de fotos com calibração manual.",
    start_url: "/",
    display: "standalone",
    background_color: "#eef1ea",
    theme_color: "#eef1ea",
    lang: "pt-BR",
    icons: [
      {
        src: "/icons/icon-192.svg",
        sizes: "192x192",
        type: "image/svg+xml",
        purpose: "maskable",
      },
      {
        src: "/icons/icon-512.svg",
        sizes: "512x512",
        type: "image/svg+xml",
        purpose: "maskable",
      },
    ],
  };
}
