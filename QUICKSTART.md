# Order Manager - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### 1. Initial Setup

```bash
# Copy environment files
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Edit backend/.env with your actual API keys (see below)
nano backend/.env
```

### 2. Configure API Keys

Edit `backend/.env` with the provided test credentials:

```env
# Shopify
SHOPIFY_API_KEY=4a425477d1ff502367ac30288233c14b
SHOPIFY_API_SECRET=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
SHOPIFY_SHOP=project-1234567949.myshopify.com
SHOPIFY_ACCESS_TOKEN=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
SHOPIFY_API_VERSION=2024-10

# wFirma
WFIRMA_COMPANY_ID=903360
WFIRMA_ACCESS_KEY=7d73802c8cb89948e55cd673e213aa6b
WFIRMA_SECRET_KEY=9698de97fc97b1b0323999b88ab88175

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=465
EMAIL_USER=alexeinatchuk@gmail.com
EMAIL_PASSWORD=bxxuhvsulyhxzjpx
IMAP_HOST=imap.gmail.com
IMAP_PORT=993
IMAP_USER=alexeinatchuk@gmail.com
IMAP_PASSWORD=bxxuhvsulyhxzjpx

# Generate strong secrets (min 32 chars)
JWT_SECRET=your-super-secret-jwt-key-at-least-32-characters-long
JWT_REFRESH_SECRET=your-super-secret-refresh-key-at-least-32-characters-long
```

### 3. Start with Docker

```bash
# Start all services
docker compose up -d --build

# Wait for services to be healthy (check with):
docker compose ps

# Initialize database
docker compose exec backend npm run prisma:migrate:dev --name init
docker compose exec backend npm run seed
```

### 4. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Health Check**: http://localhost:3001/health

**Login Credentials:**
- Username: `admin`
- Password: `password`

## 📋 Available Commands

### Docker Operations
```bash
# Start services
make up           # or: docker compose up -d

# View logs
make logs         # or: docker compose logs -f

# Stop services
make down         # or: docker compose down

# Restart services
make restart      # or: docker compose restart
```

### Database Operations
```bash
# Run migrations
make migrate      # or: docker compose exec backend npm run prisma:migrate:dev

# Seed demo data
make seed         # or: docker compose exec backend npm run seed

# Open Prisma Studio
make studio       # or: cd backend && npm run prisma:studio
```

### Development
```bash
# Local development (without Docker)
make dev

# Run tests
make test

# Access PostgreSQL
make shell-db

# Access backend container
make shell-backend
```

## 🧪 Testing Integrations

### Test Shopify Integration
```bash
# View Shopify sync logs
docker compose logs backend | grep -i shopify

# Trigger manual sync
curl -X POST http://localhost:3001/api/v1/integrations/Shopify/sync \
  -H "Authorization: Bearer <your-token>"
```

### Test Email Integration
```bash
# Check email fetch logs
docker compose logs backend | grep -i email

# Trigger email fetch
curl -X POST http://localhost:3001/api/v1/integrations/Email/sync \
  -H "Authorization: Bearer <your-token>"
```

### Test Invoice Generation
```bash
# Create invoice for an order
curl -X POST http://localhost:3001/api/v1/invoices \
  -H "Authorization: Bearer <your-token>" \
  -H "Content-Type: application/json" \
  -d '{"orderId":"<order-uuid>"}'
```

## 🐛 Common Issues

### Services won't start
```bash
# Check if ports are already in use
lsof -i :3000  # Frontend
lsof -i :3001  # Backend
lsof -i :5432  # PostgreSQL

# Clean and restart
make clean
make up
```

### Database connection errors
```bash
# Reset database
docker compose down -v
docker compose up -d db redis
docker compose exec backend npm run prisma:migrate:dev
docker compose exec backend npm run seed
```

### Authentication issues
- Make sure JWT_SECRET and JWT_REFRESH_SECRET are set and at least 32 characters
- Clear browser localStorage if switching environments
- Check backend logs: `docker compose logs backend`

## 📖 Next Steps

1. **Explore the UI**: Navigate through Orders, Customers, Emails, Invoices, and Integrations
2. **Test Shopify Sync**: Go to Integrations → Shopify → "Sync Now"
3. **Create an Invoice**: Go to an order → Click "Create Invoice"
4. **View API Docs**: Visit http://localhost:3001/api/docs (once implemented)
5. **Customize**: Edit frontend design system in `src/index.css` and `tailwind.config.ts`

## 🔐 Security Checklist for Production

- [ ] Change default admin password
- [ ] Generate strong JWT secrets (min 32 chars)
- [ ] Enable HTTPS
- [ ] Set proper CORS_ORIGIN
- [ ] Use environment-specific .env files
- [ ] Enable rate limiting
- [ ] Review RLS policies
- [ ] Set up monitoring and logging
- [ ] Configure backups for PostgreSQL

## 📚 Documentation

- Full README: [README.md](README.md)
- API Documentation: http://localhost:3001/api/docs
- Prisma Schema: [backend/prisma/schema.prisma](backend/prisma/schema.prisma)

## 💡 Tips

- Use `make help` to see all available commands
- Check `docker compose logs -f` for real-time logs
- Use Prisma Studio (`make studio`) for database inspection
- Enable mock mode (`ENABLE_PROVIDER_MOCK=true`) for offline development
- Frontend auto-reloads on changes
- Backend restarts automatically with tsx watch

---

Need help? Check the main [README.md](README.md) or review logs with `make logs`.
