# Tema e cores

O tema da aplicação é definido com Mantine e usa um sistema de constantes de cores centralizado.

## Sistema de constantes de cores

As cores estão definidas em **`src/theme/colors.ts`** e já integradas ao tema via `theme.other`. Use essas constantes para manter consistência visual.

### Cores disponíveis

**Cores da marca:**
- `BRAND_PRIMARY` – cor primária do sistema
- `BRAND_SECONDARY` – cor secundária

**Cores semânticas:**
- `SUCCESS` – verde para sucesso
- `ERROR` – vermelho para erros
- `WARNING` – amarelo para avisos
- `INFO` – azul para informações

**Cores de status (pedidos, mesas):**
- `STATUS_AVAILABLE` – disponível
- `STATUS_OCCUPIED` – ocupado
- `STATUS_RESERVED` – reservado
- `STATUS_CLOSED` – fechado

**Cores pastéis para estados de mesas:**
- `TABLE_OPEN_PASTEL` – verde pastel (#d3f9d8) - mesa aberta
- `TABLE_REQUESTING_ORDER_PASTEL` – amarelo pastel (#fff3bf) - mesa solicitando pedido
- `TABLE_REQUESTING_CLOSE_PASTEL` – vermelho pastel (#ffe0e0) - mesa solicitando encerramento de conta

**Cores de texto e fundo:**
- `TEXT_PRIMARY`, `TEXT_SECONDARY`, `TEXT_DISABLED` – cores para light mode
- `TEXT_PRIMARY_DARK`, `TEXT_SECONDARY_DARK` – cores para dark mode
- `BG_PRIMARY`, `BG_SECONDARY`, `BG_DARK`
- `BORDER_COLOR`

### Como usar as constantes

**Opção 1: Importar diretamente**

```tsx
import { SUCCESS, ERROR, TABLE_OPEN_PASTEL } from '@/theme/colors'

<Badge color={SUCCESS}>Ativo</Badge>
<div style={{ color: ERROR }}>Erro</div>
<Card style={{ backgroundColor: TABLE_OPEN_PASTEL }}>Mesa aberta</Card>
```

**Opção 2: Via tema Mantine (recomendado)**

```tsx
import { useMantineTheme } from '@mantine/core'

const theme = useMantineTheme()
<Badge color={theme.other?.success}>Sucesso</Badge>
```

**Opção 3: Em estilos inline ou CSS**

```tsx
import { STATUS_AVAILABLE } from '@/theme/colors'

<div style={{ backgroundColor: STATUS_AVAILABLE }}>...</div>
```

**Opção 4: Cores adaptadas ao dark mode**

Para componentes que precisam ajustar a cor do texto baseado no tema:

```tsx
import { useMantineColorScheme } from '@mantine/core'
import { TEXT_PRIMARY, TEXT_PRIMARY_DARK } from '@/theme/colors'

const { colorScheme } = useMantineColorScheme()
const textColor = colorScheme === 'dark' ? TEXT_PRIMARY_DARK : TEXT_PRIMARY

<div style={{ color: textColor }}>Texto adaptado ao tema</div>
```

Veja exemplo completo em `src/components/ui/Table.example.tsx`.

## Onde alterar

- **Constantes de cores:** `src/theme/colors.ts` – edite os valores hex aqui.
- **Tema Mantine:** `src/theme/theme.ts`
  - `primaryColor`: cor primária (ex.: `'blue'`, `'green'`).
  - `primaryShade`: tom (0–9); 6 é o padrão.
  - `fontFamily`: fonte global.
  - `other`: já inclui todas as cores de `colors.ts`.

## Variáveis CSS (opcional)

Em `src/index.css` você pode definir variáveis e referenciá-las no tema ou em componentes:

```css
:root {
  --app-bg: #ffffff;
  --app-text: #1a1a1a;
}
```

## Modo escuro/claro

O app está configurado com **dark mode** como padrão em `src/App.tsx`:

```tsx
<MantineProvider theme={theme} defaultColorScheme="dark">
```

- Para usar **light** como padrão, troque para `defaultColorScheme="light"`.
- Para seguir a preferência do sistema: `defaultColorScheme="auto"`.
- Para alternar em runtime, use o hook `useMantineColorScheme()`. **Exemplo:** no header do app já existe um botão (ícone sol/lua) que chama `toggleColorScheme()` – ver `src/routes/__root.tsx`:

```tsx
import { useMantineColorScheme } from '@mantine/core'

const { colorScheme, toggleColorScheme } = useMantineColorScheme()
// toggleColorScheme() alterna entre light e dark
// colorScheme é 'light' | 'dark' | 'auto'
```

## Adicionar novas cores

1. **Adicione a constante** em `src/theme/colors.ts`:

```ts
export const MINHA_COR = '#ff5733'
```

2. **Adicione ao `themeColors`** no mesmo arquivo:

```ts
export const themeColors = {
  // ... cores existentes
  minhaCor: MINHA_COR,
}
```

3. **Use no código:**

```tsx
import { MINHA_COR } from '@/theme/colors'
// ou
const theme = useMantineTheme()
theme.other?.minhaCor
```

**Alternativa:** Para cores simples, use a paleta do Mantine diretamente nos componentes: `c="red"`, `c="green"`, etc.
