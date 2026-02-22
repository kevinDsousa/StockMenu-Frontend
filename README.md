# StockMenu Frontend

Frontend do sistema StockMenu: gestão de pedidos, mesas, estoque e empresas (multi-tenant). Desenvolvido com React 19, Vite 7, TypeScript, Mantine 8, TanStack Router e React Query.

## Scripts

- `pnpm dev` – servidor de desenvolvimento
- `pnpm build` – build de produção
- `pnpm preview` – preview do build
- `pnpm lint` – ESLint

## Variáveis de ambiente

Copie `.env.example` para `.env` e defina `VITE_API_BASE_URL` com a URL base do backend (ex.: `http://localhost:8080/api`). Se não for definida, o client usa `'/api'`.

## Documentação do projeto

Guias de referência na pasta `docs/`:

| Documento | Conteúdo |
|-----------|----------|
| [docs/ROTAS.md](docs/ROTAS.md) | Rotas (nova rota, rota com parâmetro), navegação, menu |
| [docs/COMPONENTES.md](docs/COMPONENTES.md) | Componentes UI/layout, como criar e usar |
| [docs/HOOKS.md](docs/HOOKS.md) | Hooks React Query: uso e como criar novo hook |
| [docs/TEMA-E-CORES.md](docs/TEMA-E-CORES.md) | Tema Mantine, dark mode, cores e tokens |
| [docs/ICONES.md](docs/ICONES.md) | Componente Icon centralizado, como adicionar ícone |
| [docs/API-E-ROTAS.md](docs/API-E-ROTAS.md) | Client API, endpoints, hooks, env |
| [docs/ENTIDADES-E-DTOs.md](docs/ENTIDADES-E-DTOs.md) | Entidades e DTOs do domínio |
| [docs/NOVAS-FEATURES.md](docs/NOVAS-FEATURES.md) | Checklist para incluir nova feature |

## Estrutura principal

- `src/routes/` – rotas (file-based) e layout root
- `src/components/` – UI, layout e ícones centralizados
- `src/theme/` – tema Mantine
- `src/entities/` – tipos das entidades
- `src/types/dto/` – DTOs de API; `src/types/schemas/` – schemas Zod
- `src/api/` – client Axios e módulos por recurso
- `src/hooks/` – hooks React Query (useCompanies, useOrders, etc.)
- `src/providers/` – QueryProvider (e futuros providers)

## Stack

- React 19, Vite 7, TypeScript
- TanStack React Router (file-based)
- Mantine 8 (core, dates, form, hooks), Tabler Icons
- React Query, Axios, Zustand, Zod
