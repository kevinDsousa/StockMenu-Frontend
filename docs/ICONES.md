# Ícones

O projeto usa **um único componente de ícones** para centralizar o uso de `@tabler/icons-react`. Nenhum componente do Tabler deve ser importado diretamente fora de `src/components/icons/Icon.tsx`.

## Uso

```tsx
import { Icon } from '@/components/icons'

<Icon name="home" size={20} />
<Icon name="building" size={24} stroke={2} />
```

## Nomes disponíveis

| Nome        | Uso sugerido   |
|------------|----------------|
| `home`     | Dashboard      |
| `building` | Empresas       |
| `package`  | Estoque        |

Lista completa: ver array `iconNames` em `src/components/icons/Icon.tsx`.

## Como adicionar um novo ícone

1. Em `src/components/icons/Icon.tsx`:
   - Importe o componente do Tabler: `import { IconNovo } from '@tabler/icons-react'`
   - Adicione o nome ao array `iconNames`, por exemplo: `'novo'`
   - Adicione a entrada no `iconMap`: `novo: IconNovo`
2. Use no código: `<Icon name="novo" />`

## Regra

- **Não** importe `@tabler/icons-react` em rotas, páginas ou outros componentes.
- Use sempre `<Icon name="..." />` para manter consistência e facilitar troca futura de biblioteca.
