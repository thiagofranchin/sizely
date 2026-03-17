import { HistoryList } from "@/components/measurement/history-list";
import { Header } from "@/components/ui/header";

export default function HistoryPage() {
  return (
    <main className="luxury-shell max-w-6xl">
      <section className="luxury-panel px-5 py-6 sm:px-7">
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
