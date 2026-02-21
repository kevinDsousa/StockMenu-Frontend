# API e rotas (backend)

A camada de API usa **Axios** como cliente HTTP e **React Query** para cache e mutações. Todas as chamadas passam pelo client configurado em `src/api/client.ts`.

## Variável de ambiente

- **`VITE_API_BASE_URL`** – URL base do backend (ex.: `http://localhost:8080/api`). Se não estiver definida, o client usa `'/api'` (útil com proxy no Vite). Veja `.env.example`.

## Client (`src/api/client.ts`)

- Instância Axios com `baseURL` e `Content-Type: application/json`.
- Interceptors:
  - **Request:** preparado para adicionar token e/ou header de tenant (company_id) quando houver autenticação; hoje comentado.
  - **Response:** tratamento global de erro (ex.: 401 → login); hoje apenas rejeita a promise.

Para converter snake_case do backend em camelCase no front, use uma lib (ex.: camelcase-keys) no interceptor de response ou em cada módulo da API.

## Módulos por recurso

Cada recurso tem um arquivo em `src/api/` que exporta funções que chamam o client:

| Arquivo             | Recurso        | Funções típicas                          |
|---------------------|----------------|------------------------------------------|
| companies.ts        | Empresas       | getCompanies, getCompanyById, create, update, delete |
| subscriptions.ts    | Assinaturas    | idem                                     |
| primary-products.ts | Insumos        | idem                                     |
| products.ts         | Produtos       | idem                                     |
| venue-tables.ts     | Mesas          | idem                                     |
| payment-methods.ts  | Pagamento      | idem                                     |
| orders.ts           | Pedidos        | idem                                     |
| order-items.ts      | Itens do pedido| getOrderItems(orderId), create, update, delete |

As funções retornam Promises com os tipos definidos em `src/entities/` e `src/types/dto/`.

## Como adicionar um novo endpoint

1. **Novo método em recurso existente:** em `src/api/<recurso>.ts`, crie uma função que chame `apiClient.get/post/patch/delete` e retorne o tipo adequado.
2. **Novo recurso:** crie `src/api/<nome>.ts` com as funções, importe `apiClient` de `./client` e os tipos de `@/entities` e `@/types/dto`. Exporte no `src/api/index.ts`.
3. **Hook React Query:** em `src/hooks/`, crie `use<Recurso>.ts` com:
   - `useQuery` para listagem/detalhe (queryKey consistente, queryFn chamando a API).
   - `useMutation` para create/update/delete, com `onSuccess` invalidando as queryKeys relevantes (ex.: `queryClient.invalidateQueries({ queryKey: ['companies'] })`).
4. Use o hook nas páginas; não chame a API diretamente nos componentes.

## Resumo

- **baseURL:** `VITE_API_BASE_URL` ou `'/api'`.
- **Novo endpoint:** função em `src/api/<recurso>.ts` + hook em `src/hooks/use<Recurso>.ts` com invalidação.
- **Tipos:** entidades em `src/entities/`, DTOs em `src/types/dto/`.
