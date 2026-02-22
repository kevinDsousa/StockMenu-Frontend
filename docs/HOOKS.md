# Hooks

Os hooks em `src/hooks/` encapsulam a chamada à API e o cache do **React Query**. Use sempre esses hooks nas páginas em vez de chamar as funções de `src/api/` diretamente.

## Hooks disponíveis

Cada recurso que tem módulo em `src/api/` pode ter um arquivo em `src/hooks/` com o mesmo padrão:

| Arquivo | Hooks | Uso |
|---------|--------|-----|
| `useCompanies.ts` | `useCompanies`, `useCompany`, `useCreateCompany`, `useUpdateCompany`, `useDeleteCompany` | Listagem, detalhe e CRUD de empresas |
| `usePrimaryProducts.ts` | `usePrimaryProducts`, `usePrimaryProduct`, `useCreatePrimaryProduct`, `useUpdatePrimaryProduct`, `useDeletePrimaryProduct` | Insumos (estoque bruto) |
| `useOrders.ts` | `useOrders`, `useOrder`, `useCreateOrder`, `useUpdateOrder`, `useDeleteOrder` | Pedidos |

Importe de `@/hooks`:

```tsx
import { useCompanies, useCompany, useCreateCompany } from '@/hooks'
```

## Como usar os hooks

### Listagem (useQuery)

```tsx
function CompaniesPage() {
  const { data: companies, isLoading, error } = useCompanies()

  if (isLoading) return <div>Carregando...</div>
  if (error) return <div>Erro ao carregar</div>

  return (
    <ul>
      {companies?.map((c) => <li key={c.id}>{c.tradeName}</li>)}
    </ul>
  )
}
```

- `data`: array (ou undefined enquanto carrega).
- `isLoading`, `isError`, `error`, `refetch` também estão disponíveis.

### Detalhe por ID (useQuery com parâmetro)

```tsx
function CompanyDetailPage() {
  const { companyId } = Route.useParams()
  const { data: company, isLoading } = useCompany(companyId)

  if (isLoading) return <div>Carregando...</div>
  if (!company) return <div>Não encontrado</div>

  return <div>{company.tradeName}</div>
}
```

O hook só dispara a requisição quando `companyId` existe (`enabled: !!id`).

### Criar / atualizar / excluir (useMutation)

```tsx
function CreateCompanyForm() {
  const createCompany = useCreateCompany()

  const handleSubmit = (values: CreateCompanyDto) => {
    createCompany.mutate(values, {
      onSuccess: () => {
        // opcional: notificação, redirect
      },
      onError: (err) => {
        // opcional: toast de erro
      },
    })
  }

  return (
    <form onSubmit={...}>
      {/* ... */}
      <Button type="submit" loading={createCompany.isPending}>
        Salvar
      </Button>
    </form>
  )
}
```

- `mutate(payload)` ou `mutateAsync(payload)` para disparar a mutação.
- `isPending`: true enquanto a requisição está em andamento.
- Após `onSuccess`, o hook já invalida as queries combinadas (ex.: lista de empresas), então a lista atualiza sozinha.

Atualizar e excluir seguem o mesmo padrão; para update o payload costuma ser `{ id, dto }`.

## Como criar um novo hook (novo recurso)

Siga o padrão de `src/hooks/useCompanies.ts`:

1. **Definir query keys** – constante `keys` para listagem e detalhe:

```ts
const keys = {
  all: ['meu-recurso'] as const,
  list: (filtro?: string) => [...keys.all, 'list', filtro] as const,
  detail: (id: string) => [...keys.all, 'detail', id] as const,
}
```

2. **useQuery para listagem** – `queryKey` e `queryFn` chamando a API:

```ts
export function useMeuRecursos(filtro?: string) {
  return useQuery({
    queryKey: keys.list(filtro),
    queryFn: () => meuRecursoApi.getList(filtro),
  })
}
```

3. **useQuery para detalhe** – receber `id` e usar `enabled: !!id`:

```ts
export function useMeuRecurso(id: string | undefined) {
  return useQuery({
    queryKey: keys.detail(id ?? ''),
    queryFn: () => meuRecursoApi.getById(id!),
    enabled: !!id,
  })
}
```

4. **useMutation para create/update/delete** – usar `useQueryClient()` e invalidar no `onSuccess`:

```ts
export function useCreateMeuRecurso() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (dto: CreateMeuRecursoDto) => meuRecursoApi.create(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.all })
    },
  })
}
```

Para update/delete, invalide também o detalhe se precisar: `queryClient.invalidateQueries({ queryKey: keys.detail(id) })`.

5. **Exportar** – adicione o novo arquivo em `src/hooks/index.ts`:

```ts
export * from './useMeuRecurso'
```

Assim as páginas importam de `@/hooks` e o cache fica consistente com as regras de invalidação.
