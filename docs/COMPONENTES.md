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

- **Button** (AppButton) – botão com status (default, success, danger, warning, info) e styleConfig; radius md.
- **Card** – card simples com borda, sombra e radius.
- **AppCard** – card com status e styleConfig (default, success, danger, warning, info).
- **AppInput** – texto com status (default, error, success) e styleConfig; radius md.
- **AppPasswordInput** – senha com mesmo padrão do AppInput.
- **AppSelect** – select com status e styleConfig; radius md.
- **AppCheckbox** – checkbox com status (default, error) e styleConfig; radius sm.
- **AppSwitch** – switch com status (default, error) e styleConfig.
- **AppNumberInput** – número com mesmo padrão do AppInput; radius md.
- **AppTextarea** – textarea com mesmo padrão do AppInput; radius md.
- **AppDataTable**, **AppModal**, **AppTooltip**, **AppLoader**, **AppError** – demais componentes de UI.

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

### Passo a passo (exemplo: wrapper de TextInput)

1. **Decidir a pasta:** componente de formulário/campo → `src/components/ui/`; componente de estrutura de página → `src/components/layout/`.

2. **Criar o arquivo** em `src/components/ui/`, por exemplo `TextInput.tsx`:

```tsx
import { TextInput as MantineTextInput, type TextInputProps } from '@mantine/core'

export function TextInput(props: TextInputProps) {
  return <MantineTextInput radius="md" {...props} />
}
```

Use o componente do Mantine como base e defina defaults (radius, size, variant) em um só lugar.

3. **Exportar no barrel da pasta:** em `src/components/ui/index.ts` adicione:

```ts
export { TextInput } from './TextInput'
```

4. **Exportar no barrel principal:** em `src/components/index.ts` adicione na re-exportação de `ui`:

```ts
export { Button, Card, TextInput } from './ui'
```

5. **Usar na rota ou em outro componente:**

```tsx
import { TextInput } from '@/components'

<TextInput label="Nome" placeholder="Digite o nome" />
```

### Quando usar `ui` vs `layout`

- **ui:** botões, inputs, cards, badges, modais, etc. – coisas que se repetem em várias telas e seguem o mesmo visual.
- **layout:** blocos que definem a estrutura da página (PageContainer, PageHeader, sidebar customizada). Um componente de layout pode usar componentes de `ui` por dentro.

### Dica: props e acessibilidade

- Tipar as props com a interface do Mantine (ex.: `TextInputProps`) e estender com `...props` para não perder opções.
- Para formulários, use `label`, `description`, `error` e, se necessário, `aria-*` para leitores de tela.
- Manter um componente por arquivo e nome do arquivo em PascalCase (ex.: `StatusBadge.tsx`).

## Convenções

- Um componente por arquivo.
- Nome do arquivo em PascalCase.
- Props tipadas com interfaces exportadas quando útil para o consumidor.
- Preferir reutilizar Mantine em vez de reinventar; o wrapper serve para tema e defaults.
