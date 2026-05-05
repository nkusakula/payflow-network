---
applyTo: "frontend/src/**/*.{tsx,jsx,ts,js,css,scss}"
---

# React Frontend Coding Instructions

## Data Fetching

Use **react-query v3** + **axios** for all data fetching. Never use `useEffect` + `useState` for remote data.

```typescript
// Fetch
const { data = [], isLoading } = useQuery<Entity[]>('entities', () =>
  axios.get(`${API_BASE_URL}${API_ENDPOINTS.entities}`).then((r) => r.data));

// Mutate — ALWAYS invalidate after success
const mutation = useMutation(
  (data: Partial<Entity>) => axios.post(`${API_BASE_URL}${API_ENDPOINTS.entities}`, data),
  { onSuccess: () => queryClient.invalidateQueries('entities') }
);
```

## Dark Mode

Use `useTheme()` hook from `../context/ThemeContext` when you need to branch on theme.
Prefer Tailwind dark variant classes (`dark:bg-slate-800`, `dark:text-white`) over conditional rendering.

```typescript
import { useTheme } from '../context/ThemeContext';
const { isDark, toggleTheme } = useTheme();
```

## Component Pattern

Entity views live in `frontend/src/components/entity/{name}/{Name}.tsx`.

Standard structure:
1. `useQuery` to fetch data
2. `useMutation` for create/update/delete — invalidate query on success
3. Search/filter state with `useState`
4. Table display with status badges
5. Modal form for create/edit (controlled with `showForm` + `editEntity` state)

## Tailwind Component Classes

Defined in `src/index.css`:
- `.card` — white/dark card with rounded corners and shadow
- `.btn-primary` — brand blue button
- `.btn-secondary` — outline button
- `.badge-active` — green status badge
- `.badge-blocked` / `.badge-declined` — red badge
- `.badge-pending` — yellow badge
- `.badge-settled` — teal badge
- `.badge-reversed` — orange badge
- `.badge-suspended` — orange badge

## Amount Formatting

Amounts are stored as integers in minor currency units (cents). Always format using `Intl.NumberFormat`:

```typescript
const fmt = (amount: number, currency: string) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount / 100);
```

## API Config

```typescript
import { API_BASE_URL, API_ENDPOINTS } from '../api/config';

// Available endpoints:
API_ENDPOINTS.issuers       // '/api/issuers'
API_ENDPOINTS.cardholders   // '/api/cardholders'
API_ENDPOINTS.cards         // '/api/cards'
API_ENDPOINTS.merchants     // '/api/merchants'
API_ENDPOINTS.transactions  // '/api/transactions'
API_ENDPOINTS.disputes      // '/api/disputes'
API_ENDPOINTS.settlements   // '/api/settlements'
```

## Rules

1. Always call `queryClient.invalidateQueries('{entity}')` after mutations.
2. Provide default empty array: `const { data = [] } = useQuery(...)`.
3. Use `useQueryClient()` at the top of the component.
4. Use controlled forms with a single `form` state object, not individual field state.
5. Never hard-code `http://localhost:3000` — always use `API_BASE_URL` from config.
