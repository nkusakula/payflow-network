# Deployment

## Docker (Recommended)

### API

Create `api/Dockerfile`:

```dockerfile
FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
COPY api/package*.json ./api/
RUN npm ci --workspace=api --ignore-scripts
COPY api/ ./api/
RUN npm run build --workspace=api
EXPOSE 3000
CMD ["node", "api/dist/index.js"]
```

### Frontend

Create `frontend/Dockerfile`:

```dockerfile
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
COPY frontend/package*.json ./frontend/
RUN npm ci --workspace=frontend --ignore-scripts
COPY frontend/ ./frontend/
RUN npm run build --workspace=frontend

FROM nginx:alpine
COPY --from=build /app/frontend/dist /usr/share/nginx/html
EXPOSE 80
```

## Azure Container Apps

Deploy both services as separate Container Apps:

1. **Build and push images** to Azure Container Registry
2. **Create Container Apps Environment**
3. **Deploy API** with env var `API_CORS_ORIGINS` set to the frontend ingress URL
4. **Deploy Frontend** with `RUNTIME_CONFIG` env pointing to the API URL

### Quick Deploy with Azure Developer CLI

```bash
# From repo root
azd init
azd up
```

### Environment Variables

| Variable | Required | Description |
|---|---|---|
| `PORT` | No | API port (default: 3000) |
| `API_CORS_ORIGINS` | Yes (prod) | Comma-separated allowed origins |
| `RUNTIME_CONFIG` | Yes (frontend) | JSON with `{"API_URL":"https://api-url"}` |

## Notes

- This is a demo application with in-memory storage — not suitable for production data
- Data resets on every container restart
- No authentication is implemented — add an identity layer before exposing to end users
