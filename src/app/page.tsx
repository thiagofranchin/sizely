"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Archive, Camera, ChevronRight, ImagePlus, Shirt, Sparkles } from "lucide-react";
import { ActionCard } from "@/components/ui/action-card";
import { Header } from "@/components/ui/header";
import { InstructionBox } from "@/components/ui/instruction-box";
import { buttonVariants } from "@/components/ui/button";
import { CameraCaptureInput } from "@/components/measurement/camera-capture-input";
import { ImageUploader } from "@/components/measurement/image-uploader";
import { InstallPromptButton } from "@/components/pwa/install-prompt-button";
import { cn } from "@/lib/utils";
import { saveDraft } from "@/lib/storage/draft";
import type { SourceKind } from "@/lib/types/measurement";

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  function handleFileSelected(file: File, sourceKind: SourceKind) {
    if (!file.type.startsWith("image/")) {
      setErrorMessage("Selecione uma imagem válida para iniciar a medição.");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    const reader = new FileReader();

    reader.onload = () => {
      const result = reader.result;

      if (typeof result !== "string") {
        setIsLoading(false);
        setErrorMessage("Não foi possível ler a imagem selecionada.");
        return;
      }

      saveDraft({
        imageDataUrl: result,
        sourceName: file.name || "Imagem sem nome",
        sourceKind,
        createdAt: new Date().toISOString(),
      });
      router.push("/medir");
    };

    reader.onerror = () => {
      setIsLoading(false);
      setErrorMessage("Falha ao carregar a imagem.");
    };

    reader.readAsDataURL(file);
  }

  return (
    <main className="luxury-shell">
      <section className="luxury-panel px-5 py-5 sm:px-7">
        <Header
          title="Medidor de peças por referência"
          description="Uma ferramenta de bancada digital para medir roupas e objetos com rigor visual, sem backend e direto no navegador."
          rightSlot={<InstallPromptButton />}
        />
      </section>

      {errorMessage ? (
        <InstructionBox title="Não foi possível iniciar" description={errorMessage} tone="warning" />
      ) : null}

      <section className="luxury-panel relative overflow-hidden px-5 py-8 sm:px-8 sm:py-10">
        <div className="absolute inset-y-0 right-0 hidden w-1/2 bg-[radial-gradient(circle_at_top_right,_rgba(183,101,77,0.16),_transparent_58%)] lg:block" />
        <div className="relative">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border-soft)] bg-white/75 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-[var(--text-muted)] dark:bg-card/80">
              <Sparkles className="size-3.5 text-primary" />
              Precisão editorial
            </div>
            <div className="space-y-4">
              <h2 className="max-w-3xl text-4xl leading-tight text-[var(--text-strong)] sm:text-5xl luxury-title">
                Transforme qualquer foto plana em uma ficha de medidas clara e elegante.
              </h2>
              <p className="max-w-2xl text-sm leading-7 text-[var(--text-soft)] sm:text-base">
                Calibre uma referência real na imagem, adicione quantas medidas quiser e copie os
                resultados em texto limpo para produção, catálogo ou conferência.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/medir"
                className={cn(
                  buttonVariants({ variant: "default" }),
                  "h-12 rounded-full px-5 text-sm shadow-sm",
                )}
              >
                Abrir medidor
                <ChevronRight className="size-4" />
              </Link>
              <Link
                href="/historico"
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "h-12 rounded-full bg-white/75 px-5 text-sm dark:bg-card/80",
                )}
              >
                <Archive className="size-4" />
                Ver histórico
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr] [&>*]:min-w-0">
        <ActionCard
          eyebrow="Captura"
          icon={<Camera className="size-6" />}
          title="Nova medição"
          description="Escolha entre câmera e galeria. O Sizely abre a imagem em uma prancheta de medição com referência manual e pontos editáveis."
          action={
            <div className="grid gap-3 xl:grid-cols-2">
              <CameraCaptureInput
                onFileSelected={(file) => handleFileSelected(file, "camera")}
              />
              <ImageUploader
                onFileSelected={(file) => handleFileSelected(file, "upload")}
              />
            </div>
          }
        />

        <ActionCard
          eyebrow="Arquivo"
          icon={<Archive className="size-6" />}
          title="Histórico local"
          description="Mantenha uma coleção privada das últimas medições, pronta para revisão e cópia rápida no mesmo dispositivo."
          action={
            <Link
              href="/historico"
              className={cn(
                buttonVariants({ variant: "outline" }),
                "h-12 rounded-full bg-white/75 px-5 text-sm dark:bg-card/80",
              )}
            >
              Abrir histórico
              <ChevronRight className="size-4" />
            </Link>
          }
        />
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        {[
          {
            icon: <ImagePlus className="size-5 text-primary" />,
            title: "Imagem limpa",
            description:
              "Melhor resultado com foto frontal, roupa plana e objeto de referência no mesmo plano visual.",
          },
          {
            icon: <Shirt className="size-5 text-primary" />,
            title: "Visual de atelier",
            description:
              "Interface pensada para uso prático no celular, mas com apresentação refinada para rotina de produto e catálogo.",
          },
          {
            icon: <Sparkles className="size-5 text-primary" />,
            title: "Saída pronta",
            description:
              "Resultados em centímetros, texto fácil de copiar e histórico leve salvo localmente no dispositivo.",
          },
        ].map((item) => (
          <div key={item.title} className="luxury-panel p-5 sm:p-6">
            <div className="flex h-11 w-11 items-center justify-center rounded-[1.2rem] border border-[var(--border-soft)] bg-white/75 dark:bg-card/80">
              {item.icon}
            </div>
            <h3 className="mt-4 text-2xl text-[var(--text-strong)] luxury-title">{item.title}</h3>
            <p className="mt-3 text-sm leading-6 text-[var(--text-soft)]">{item.description}</p>
          </div>
        ))}
      </section>

      {isLoading ? (
        <p className="text-sm text-[var(--text-soft)]">Preparando imagem para medição...</p>
      ) : null}
    </main>
  );
}
