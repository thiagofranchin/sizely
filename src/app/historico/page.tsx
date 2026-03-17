import { HistoryList } from "@/components/measurement/history-list";
import { Header } from "@/components/ui/header";

export default function HistoryPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      <section className="rounded-[32px] border border-[var(--border-soft)] bg-[var(--surface)] px-5 py-6 shadow-[var(--shadow-card)] sm:px-7">
        <Header
          title="Histórico local"
          description="Medições salvas ficam disponíveis neste dispositivo. Você pode revisar detalhes, copiar o texto novamente e excluir itens que não precisa mais."
          showBackLink
        />
      </section>

      <HistoryList />
    </main>
  );
}
