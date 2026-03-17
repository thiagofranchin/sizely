import Link from "next/link";
import { Header } from "@/components/ui/header";
import { InstructionBox } from "@/components/ui/instruction-box";

export default function OfflinePage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      <section className="rounded-[32px] border border-[var(--border-soft)] bg-[var(--surface)] px-5 py-6 shadow-[var(--shadow-card)] sm:px-7">
        <Header
          title="Você está offline"
          description="O shell do Sizely continua disponível, mas carregar novas imagens ou navegar para páginas ainda não armazenadas pode depender da conexão."
          showBackLink
        />
      </section>
      <InstructionBox
        title="O que ainda funciona"
        description="Páginas já armazenadas e o histórico local podem continuar acessíveis. Quando a conexão voltar, o app retoma o comportamento normal."
      />
      <Link
        href="/historico"
        className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-[var(--border-strong)] px-4 text-sm font-medium text-[var(--text-strong)] transition hover:bg-[var(--surface-alt)]"
      >
        Abrir histórico salvo
      </Link>
    </main>
  );
}
