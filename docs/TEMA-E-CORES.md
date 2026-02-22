# Tema e cores

O tema da aplicação é definido com Mantine em um único arquivo e opcionalmente com variáveis CSS.

## Onde alterar

- **Arquivo principal:** `src/theme/theme.ts`
  - `primaryColor`: cor primária (ex.: `'blue'`, `'green'`).
  - `primaryShade`: tom (0–9); 6 é o padrão.
  - `fontFamily`: fonte global.

Para cores adicionais ou tokens semânticos use `other` no `createTheme`:

```ts
createTheme({
  primaryColor: 'blue',
  other: {
    appBg: 'var(--app-bg)',
    appText: 'var(--app-text)',
  },
})
```

Depois use em componentes: `theme.other?.appBg`.

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

## Adicionar variantes de cor

Para novas cores além da primária, use a paleta do Mantine (ex.: `c="red"`, `c="green"`) nos componentes. Para nomes customizados, defina em `theme.other` e use onde precisar.
