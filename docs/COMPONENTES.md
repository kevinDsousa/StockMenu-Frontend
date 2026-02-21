# Componentes

A UI é construída sobre o Mantine. Componentes reutilizáveis ficam em `src/components/` para padronizar estilo e comportamento.

## Estrutura

- **`components/ui/`** – wrappers de componentes Mantine (Button, Card, etc.).
- **`components/layout/`** – layout de página (PageContainer, etc.).
- **`components/icons/`** – ver [ICONES.md](./ICONES.md).

Importação centralizada:

```tsx
import { Button, Card, PageContainer } from '@/components'
```

## Componentes disponíveis

### UI

- **Button** – botão com radius padrão; aceita todas as props do Mantine Button.
- **Card** – card com borda, sombra e radius; aceita todas as props do Mantine Card.

### Layout

- **PageContainer** – bloco de página com título e área de conteúdo.
  - Props: `title: string`, `children`, e quaisquer props de `Box` do Mantine.

Exemplo:

```tsx
<PageContainer title="Minha página">
  <Card>Conteúdo aqui.</Card>
</PageContainer>
```

## Como criar um novo componente

1. **UI:** criar em `src/components/ui/NomeDoComponente.tsx`, exportar no `src/components/ui/index.ts` e no `src/components/index.ts`.
2. **Layout:** criar em `src/components/layout/`, seguir o mesmo padrão de export.
3. Usar o componente Mantine como base e re-exportar com props padronizadas (ex.: radius, variant).
4. Manter acessibilidade (labels, roles) quando aplicar.

## Convenções

- Um componente por arquivo.
- Nome do arquivo em PascalCase.
- Props tipadas com interfaces exportadas quando útil para o consumidor.
- Preferir reutilizar Mantine em vez de reinventar; o wrapper serve para tema e defaults.
