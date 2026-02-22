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

## Rota com parâmetro (ex.: detalhe por ID)

Para uma URL como `/companies/123` ou `/orders/456`, use um **segmento dinâmico** no nome do arquivo com `$` + nome do parâmetro.

### Exemplo: detalhe de empresa por ID

1. Crie o arquivo **`src/routes/companies.$companyId.tsx`** (o `$companyId` vira um parâmetro na URL):

```tsx
import { createFileRoute } from '@tanstack/react-router'
import { PageContainer } from '@/components'
import { useCompany } from '@/hooks'

export const Route = createFileRoute('/companies/$companyId')({
  component: CompanyDetailPage,
})

function CompanyDetailPage() {
  const { companyId } = Route.useParams()
  const { data: company, isLoading } = useCompany(companyId)

  if (isLoading) return <div>Carregando...</div>
  if (!company) return <div>Empresa não encontrada</div>

  return (
    <PageContainer title={company.tradeName}>
      {/* conteúdo do detalhe */}
    </PageContainer>
  )
}
```

2. A URL fica: `/companies/abc-123-uuid` (onde `companyId` = `abc-123-uuid`).
3. Para **linkar** para essa rota com parâmetro:

```tsx
import { Link } from '@tanstack/react-router'

<Link to="/companies/$companyId" params={{ companyId: company.id }}>
  Ver empresa
</Link>
```

4. Navegação programática:

```tsx
const navigate = useNavigate()
navigate({ to: '/companies/$companyId', params: { companyId: 'uuid-aqui' } })
```

### Convenção de nomes de arquivo

- `$parametro` no nome do arquivo = segmento dinâmico na URL.
- Um único parâmetro: ex. `companies.$companyId.tsx` → `/companies/:companyId`.
- Vários parâmetros: ex. `orders.$orderId.items.$itemId.tsx` → `/orders/:orderId/items/:itemId`; use `Route.useParams()` e destructure `orderId`, `itemId`.

Após criar ou renomear arquivos com `$`, rode o dev server para o plugin regenerar o `routeTree.gen.ts` (os tipos de `params` passam a ser inferidos).

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
