"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ActionCard } from "@/components/ui/action-card";
import { Header } from "@/components/ui/header";
import { InstructionBox } from "@/components/ui/instruction-box";
import { CameraCaptureInput } from "@/components/measurement/camera-capture-input";
import { ImageUploader } from "@/components/measurement/image-uploader";
import { InstallPromptButton } from "@/components/pwa/install-prompt-button";
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
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      <section className="rounded-[32px] border border-[var(--border-soft)] bg-[var(--surface)] px-5 py-5 shadow-[var(--shadow-card)] sm:px-7">
        <Header
          title="Medidor por referência"
          description="Carregue uma imagem, calibre a escala com qualquer objeto conhecido e marque quantas medidas quiser no próprio navegador."
          rightSlot={<InstallPromptButton />}
        />
      </section>

      {errorMessage ? (
        <InstructionBox title="Não foi possível iniciar" description={errorMessage} tone="warning" />
      ) : null}

      <section className="grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
        <ActionCard
          icon="📷"
          title="Nova medição"
          description=""
          action={
            <div className="grid gap-3 sm:grid-cols-2">
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
          icon="🗂️"
          title="Histórico local"
          description="Revise medições salvas, copie novamente os resultados e mantenha um histórico leve no próprio dispositivo."
          action={
            <Link
              href="/historico"
              className="flex min-h-12 items-center justify-center rounded-2xl border border-[var(--border-strong)] px-4 text-sm font-medium text-[var(--text-strong)] transition hover:bg-[var(--surface-alt)]"
            >
              Abrir histórico
            </Link>
          }
        />
      </section>

      {isLoading ? (
        <p className="text-sm text-[var(--text-soft)]">Preparando imagem para medição...</p>
      ) : null}
    </main>
  );
}
