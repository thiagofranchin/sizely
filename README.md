# Sizely

Sizely é uma aplicação web client-side para medição visual de peças, roupas e objetos a partir de fotos. O fluxo foi desenhado para permitir calibração manual por referência, marcação livre de pontos sobre a imagem e geração de resultados em centímetros, tudo diretamente no navegador, sem dependência de backend.

O projeto prioriza uma experiência prática para uso em celular e desktop, com interface refinada, histórico local, suporte a PWA e um fluxo de medição dividido em etapas claras.

## Visão geral

O usuário carrega ou captura uma foto, define uma referência real visível na imagem, informa o tamanho dessa referência em centímetros e, a partir dessa escala, cria quantas medições quiser sobre a peça ou objeto fotografado.

O resultado final é exibido de forma organizada para consulta, cópia e armazenamento local no dispositivo.

## Principais funcionalidades

- Medição manual sobre imagem com marcação de pontos no canvas.
- Calibração por objeto de referência visível na foto.
- Conversão automática de pixels para centímetros após definir a escala.
- Criação de múltiplas medidas com nomes personalizados.
- Ajuste, reposicionamento e remoção de medições.
- Visualização dos nomes ou valores diretamente nas linhas do canvas.
- Histórico local persistido no navegador.
- Fluxo responsivo para mobile e desktop.
- Suporte a PWA para instalação e uso com comportamento de app.
- Funcionamento totalmente client-side, sem backend.

## Fluxo da aplicação

### 1. Captura ou upload

Na tela inicial, o usuário pode:

- tirar uma foto com a câmera do dispositivo;
- enviar uma imagem existente;
- acessar medições salvas localmente.

### 2. Etapa de referência

Na primeira etapa do medidor:

- o usuário marca dois pontos sobre um objeto de tamanho conhecido;
- informa a medida real desse objeto;
- o sistema calcula a escala em `cm/px`.

### 3. Etapa de medições

Na segunda etapa:

- novas linhas de medição podem ser criadas livremente;
- cada medição pode receber um nome;
- os pontos podem ser reposicionados diretamente no canvas;
- os valores são recalculados automaticamente com base na escala definida.

### 4. Resultado

Ao final:

- a aplicação consolida as medidas em uma ficha limpa;
- os dados podem ser salvos no histórico local;
- o usuário pode iniciar um novo fluxo de medição.

## Stack técnica

- `Next.js 16` com App Router
- `React 19`
- `TypeScript`
- `Tailwind CSS 4`
- `Base UI`
- `Lucide React`

## Arquitetura

O projeto está organizado para manter o domínio de medição separado da interface:

- `src/app`
  Responsável pelas rotas, páginas e composição do fluxo principal.
- `src/components`
  Componentes de interface e componentes específicos do domínio de medição.
- `src/lib/measurement`
  Regras matemáticas, formatação e conversão de medidas.
- `src/lib/storage`
  Persistência local de rascunhos e histórico.
- `src/lib/types`
  Tipos de domínio usados ao longo da aplicação.

## Estrutura principal

```text
src/
  app/
    page.tsx
    medir/page.tsx
    historico/page.tsx
  components/
    measurement/
    ui/
    pwa/
  lib/
    measurement/
    storage/
    types/
```

## Execução local

### Pré-requisitos

- `Node.js` `20.9.0` ou superior
- `npm` `10` ou superior

Use a versão definida em [`.nvmrc`](/home/thiago/projectsUbuntu/codex/mini-tools/.nvmrc):

```bash
nvm use
```

### Instalação

```bash
npm install
```

### Ambiente de desenvolvimento

```bash
npm run dev
```

Aplicação disponível em:

```text
http://localhost:3000
```

### Build de produção

```bash
npm run build
```

### Execução da build

```bash
npm run start
```

### Lint

```bash
npm run lint
```

### Testes

```bash
npm run test
```

## Scripts disponíveis

- `npm run dev`
  Inicia o servidor de desenvolvimento.
- `npm run build`
  Gera a build de produção.
- `npm run start`
  Inicia a aplicação com a build gerada.
- `npm run lint`
  Executa a validação estática com ESLint.
- `npm run test`
  Executa os testes unitários das funções utilitárias de medição.

## Contribuição

Para colaborar:

1. Use `nvm use`.
2. Instale dependências com `npm install`.
3. Rode `npm run lint` e `npm run test`.
4. Abra um PR com descrição objetiva da mudança.

Diretrizes adicionais estão em [CONTRIBUTING.md](/home/thiago/projectsUbuntu/codex/mini-tools/CONTRIBUTING.md).

## Persistência de dados

O Sizely salva informações localmente no navegador para suportar:

- rascunho da imagem em edição;
- histórico de medições;
- continuidade do fluxo sem backend.

Isso significa que os dados permanecem no dispositivo atual e não são enviados para um servidor da aplicação.

## Responsividade e usabilidade

O layout foi pensado para:

- funcionar bem em celulares, tablets e desktop;
- reorganizar painéis conforme a largura da viewport;
- evitar overflow horizontal durante redimensionamento;
- manter a área de medição utilizável em telas sensíveis ao toque.

## PWA

O projeto inclui recursos para Progressive Web App, permitindo:

- instalação no dispositivo;
- ícones e manifesto configurados;
- comportamento semelhante a aplicativo em dispositivos compatíveis.

## Casos de uso

O Sizely é útil para cenários como:

- conferência de medidas de roupas;
- preparação de fichas técnicas simples;
- apoio visual em catálogo de produto;
- medição manual de objetos fotografados em bancada;
- rotinas internas de produto, e-commerce ou conteúdo.

## Estado atual do projeto

O sistema está estruturado como uma ferramenta leve, local e orientada à produtividade, com foco em simplicidade operacional e clareza visual. A solução atual cobre o fluxo principal de medição ponta a ponta sem depender de serviços externos.

## Licença

Este projeto está licenciado sob a licença MIT.

O texto completo está em [LICENSE](/home/thiago/projectsUbuntu/codex/mini-tools/LICENSE).
