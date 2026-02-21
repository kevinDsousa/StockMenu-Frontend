# Rotas

O projeto usa **TanStack React Router** com roteamento baseado em arquivos. O layout principal (menu lateral e header) fica no root; as páginas são renderizadas no `<Outlet />`.

## Como funciona

- **Pasta:** `src/routes/`
- **Root:** `__root.tsx` – layout com AppShell (header “StockMenu”, navbar com links).
- **Páginas:** cada arquivo define uma rota:
  - `index.tsx` → `/`
  - `companies.tsx` → `/companies`
  - `inventory.tsx` → `/inventory`

O plugin do Vite gera `src/routeTree.gen.ts` a partir desses arquivos. Não edite o arquivo gerado manualmente.

## Como criar uma nova rota

1. Crie um arquivo em `src/routes/`, por exemplo `products.tsx`.
2. Use `createFileRoute('/products')` e exporte `Route` com um `component`:

```tsx
import { createFileRoute } from '@tanstack/react-router'
import { PageContainer } from '@/components'

export const Route = createFileRoute('/products')({
  component: ProductsPage,
})

function ProductsPage() {
  return <PageContainer title="Produtos">...</PageContainer>
}
```

3. Rode o dev server; o plugin atualiza o `routeTree.gen.ts`.
4. Adicione o link no menu em `src/routes/__root.tsx` (NavLink com `to="/products"` e um ícone).

## Navegação

- **Link:** use o componente `Link` do TanStack Router (já usado no root com `NavLink component={Link}`):

```tsx
import { Link } from '@tanstack/react-router'
<Link to="/companies">Empresas</Link>
```

- **Programática:** use o hook `useNavigate()`:

```tsx
import { useNavigate } from '@tanstack/react-router'
const navigate = useNavigate()
navigate({ to: '/companies' })
```

## Onde fica o menu

O menu lateral e o header são definidos em `src/routes/__root.tsx`. Para adicionar ou alterar itens do menu, edite os `NavLink` dentro de `AppShell.Navbar`. Use o componente `<Icon name="..." />` para os ícones.
