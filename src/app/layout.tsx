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
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/icon.svg",
    apple: "/apple-icon.svg",
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
