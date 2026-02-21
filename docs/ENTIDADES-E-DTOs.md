# Entidades e DTOs

## Entidades

As entidades espelham as tabelas do backend (camelCase no frontend). Ficam em `src/entities/`.

| Arquivo            | Entidade        | Tabela no backend   |
|--------------------|-----------------|----------------------|
| company.ts         | Company         | companies            |
| subscription.ts   | Subscription    | subscriptions        |
| primary-product.ts | PrimaryProduct  | primary_products      |
| product.ts         | Product         | products             |
| venue-table.ts     | VenueTable      | venue_tables         |
| payment-method.ts  | PaymentMethod   | payment_methods      |
| order.ts           | Order           | orders               |
| order-item.ts      | OrderItem       | order_items          |

Import: `import type { Company } from '@/entities'`.

## DTOs

Tipos de request/response da API em `src/types/dto/`. Por entidade:

- `CreateXxxDto` – corpo de POST
- `UpdateXxxDto` – corpo de PATCH/PUT
- `XxxListResponse` – lista retornada pela API (pode ser substituído por tipo com paginação depois)

Import: `import type { CreateCompanyDto } from '@/types/dto'`.

Se o backend usar snake_case, a conversão pode ser feita no client axios (interceptors ou lib como camelcase-keys).

## Schemas Zod

Validação para formulários (e opcionalmente resposta da API) em `src/types/schemas/`. Ex.: `createCompanySchema`, `updateCompanySchema`. Inferir tipos com `z.infer<typeof createCompanySchema>`.

Import: `import { createCompanySchema } from '@/types/schemas'`.
