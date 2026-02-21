# Inclusão de novas features

Checklist para adicionar uma nova funcionalidade ao StockMenu Frontend.

## 1. Entidade e DTOs

- [ ] Se o backend tiver uma nova tabela/entidade, crie o tipo em `src/entities/<nome>.ts` (camelCase).
- [ ] Adicione ao barrel `src/entities/index.ts`.
- [ ] Crie os DTOs em `src/types/dto/<nome>.ts`: `CreateXxxDto`, `UpdateXxxDto` (e list response se precisar).
- [ ] (Opcional) Crie schemas Zod em `src/types/schemas/` para formulários.

## 2. API e hooks

- [ ] Crie o módulo `src/api/<recurso>.ts` com getList, getById, create, update, delete (conforme o backend).
- [ ] Exporte no `src/api/index.ts`.
- [ ] Crie `src/hooks/use<Recurso>.ts` com useQuery para listagem/detalhe e useMutation para create/update/delete, invalidando as queryKeys corretas.
- [ ] Exporte no `src/hooks/index.ts`.

## 3. Rota e página

- [ ] Crie a rota em `src/routes/<nome>.tsx` com `createFileRoute('/nome')` e um component que use `PageContainer` e os hooks.
- [ ] Adicione o link no menu em `src/routes/__root.tsx` (NavLink + `Icon` se precisar de ícone).

## 4. Ícone (se o menu tiver ícone)

- [ ] Adicione o novo ícone em `src/components/icons/Icon.tsx` (nome no `iconNames`, entrada no `iconMap`).
- [ ] Use `<Icon name="..." />` no NavLink.

## 5. Ajustes de tema (opcional)

- [ ] Se a feature precisar de cores ou tokens novos, ajuste `src/theme/theme.ts` ou variáveis em `src/index.css`. Ver [TEMA-E-CORES.md](./TEMA-E-CORES.md).

## 6. Documentação

- [ ] Atualize [ENTIDADES-E-DTOs.md](./ENTIDADES-E-DTOs.md) se tiver nova entidade.
- [ ] Se criar novos componentes reutilizáveis, documente em [COMPONENTES.md](./COMPONENTES.md).

Resumo: **Entidade/DTO → API → Hooks → Rota + menu (+ ícone se necessário) → tema/docs se precisar.**
