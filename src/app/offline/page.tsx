import Link from "next/link";
import { Header } from "@/components/ui/header";
import { InstructionBox } from "@/components/ui/instruction-box";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function OfflinePage() {
  return (
    <main className="luxury-shell max-w-5xl">
      <section className="luxury-panel px-5 py-6 sm:px-7">
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
        className={cn(
          buttonVariants({ variant: "outline" }),
          "h-12 rounded-full bg-white/80 px-5 text-sm dark:bg-card/80",
        )}
      >
        Abrir histórico salvo
      </Link>
    </main>
  );
}
