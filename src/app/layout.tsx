import type { Metadata } from "next";
import { IBM_Plex_Mono, Libre_Baskerville, Poppins } from "next/font/google";
import "./globals.css";
import { ServiceWorkerRegister } from "@/components/pwa/service-worker-register";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const libreBaskerville = Libre_Baskerville({
  variable: "--font-libre-baskerville",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Sizely",
  description:
    "Ferramenta client-side para medir roupas a partir de fotos com calibração manual por referência.",
  applicationName: "Sizely",
  metadataBase: new URL("https://sizely.vercel.app"),
  alternates: {
    canonical: "/",
  },
  keywords: [
    "medição",
    "roupas",
    "medidas",
    "foto",
    "next.js",
    "pwa",
  ],
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/icon.svg",
    apple: "/apple-icon.svg",
  },
  openGraph: {
    type: "website",
    url: "https://sizely.vercel.app/",
    title: "Sizely",
    description:
      "Medição visual de roupas e objetos a partir de fotos, com calibração manual e histórico local.",
    siteName: "Sizely",
    locale: "pt_BR",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Sizely, ferramenta para medir roupas e objetos a partir de fotos.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sizely",
    description:
      "Medição visual de roupas e objetos a partir de fotos, com calibração manual e histórico local.",
    images: ["/twitter-image"],
  },
  appleWebApp: {
    capable: true,
    title: "Sizely",
    statusBarStyle: "default",
  },
  formatDetection: {
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${poppins.variable} ${libreBaskerville.variable} ${ibmPlexMono.variable}`}
    >
      <body>
        <ServiceWorkerRegister />
        {children}
      </body>
    </html>
  );
}
