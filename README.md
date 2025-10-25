# Order Manager

Professional e-commerce order and communication management platform with Shopify integration, email tracking, and automated invoicing.

## Features

- 📦 **Order Management** - Track and manage orders from Shopify
- 👥 **Customer Database** - Centralized customer information
- 📧 **Email Integration** - Link customer emails to orders via IMAP
- 🧾 **Invoice Generation** - Automated invoicing with wFirma integration
- 🔄 **Real-time Sync** - Webhook-based order updates from Shopify
- 🎨 **Modern UI** - Clean, professional SaaS interface inspired by BaseLinker

## Tech Stack

### Frontend
- React 18 + TypeScript
- Vite
- React Router 6
- React Query (TanStack Query)
- Radix UI + Tailwind CSS
- Zustand (state management)

### Backend
- Node.js + TypeScript + Express
- PostgreSQL + Prisma ORM
- Redis + BullMQ (background jobs)
- JWT authentication with RBAC
- REST API with OpenAPI docs

### Integrations
- **Shopify** - Order and customer sync
- **Email (IMAP/Gmail)** - Message tracking and linking
- **wFirma** - Invoice generation

## Quick Start

### Prerequisites
- Docker & Docker Compose
- Node.js 18+ (for local development)

### 1. Clone and Configure

```bash
# Clone the repository
git clone <repository-url>
cd order-manager

# Copy environment templates
cp .env.example .env
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Edit backend/.env with your credentials
nano backend/.env
```

### 2. Start with Docker

```bash
# Start all services
docker compose up -d --build

# Check service health
docker compose ps

# View logs
docker compose logs -f backend
```

Services will be available at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **API Docs**: http://localhost:3001/api/docs
- **PostgreSQL**: localhost:5432
- **Redis**: localhost:6379

### 3. Initialize Database

```bash
# Run migrations
docker compose exec backend npm run prisma:migrate:dev

# Seed demo data
docker compose exec backend npm run seed
```

### 4. Login

Default credentials:
- **Username**: `admin`
- **Password**: `password`

## Environment Configuration

### Backend (.env)

#### Required
```env
DATABASE_URL=postgresql://postgres:postgres@db:5432/ordermanager
JWT_SECRET=your-secret-key-min-32-chars
JWT_REFRESH_SECRET=your-refresh-secret-min-32-chars
```

#### Shopify Integration
```env
SHOPIFY_SHOP=myshop.myshopify.com
SHOPIFY_ACCESS_TOKEN=shpat_xxxxx
SHOPIFY_API_KEY=xxxxx
SHOPIFY_API_SECRET=shpss_xxxxx
SHOPIFY_API_VERSION=2024-10
```

#### Email Integration (IMAP)
```env
IMAP_HOST=imap.gmail.com
IMAP_PORT=993
IMAP_USER=your-email@gmail.com
IMAP_PASSWORD=your-app-password
IMAP_TLS=true
```

#### wFirma Integration
```env
INVOICE_PROVIDER=wfirma
WFIRMA_COMPANY_ID=xxxxx
WFIRMA_ACCESS_KEY=xxxxx
WFIRMA_SECRET_KEY=xxxxx
ENABLE_PROVIDER_MOCK=false  # Set to true for mock mode
```

## Development

### Local Development (without Docker)

```bash
# Install dependencies
npm install
cd backend && npm install
cd ..

# Start PostgreSQL and Redis
docker compose up -d db redis

# Run backend
cd backend
npm run prisma:generate
npm run prisma:migrate:dev
npm run seed
npm run dev

# In another terminal, run frontend
npm run dev
```

### Database Management

```bash
# Generate Prisma Client
npm run prisma:generate

# Create migration
npm run prisma:migrate:dev --name migration_name

# Open Prisma Studio
npm run prisma:studio

# Reset database
npm run prisma:migrate:reset
```

### Background Jobs

Jobs are processed by BullMQ workers:
- **shopifySync** - Import orders and customers
- **emailFetch** - Check for new emails via IMAP
- **invoiceCreate** - Generate invoices
- **webhooks** - Process Shopify webhooks

## API Documentation

### Authentication
```bash
# Login
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password"}'

# Get current user
curl http://localhost:3001/api/v1/users/me \
  -H "Authorization: Bearer <token>"
```

### Orders
```bash
# List orders
curl http://localhost:3001/api/v1/orders \
  -H "Authorization: Bearer <token>"

# Filter by status
curl "http://localhost:3001/api/v1/orders?status=New" \
  -H "Authorization: Bearer <token>"

# Get order details
curl http://localhost:3001/api/v1/orders/<order-id> \
  -H "Authorization: Bearer <token>"
```

### Integrations
```bash
# Trigger manual Shopify sync
curl -X POST http://localhost:3001/api/v1/integrations/shopify/sync \
  -H "Authorization: Bearer <token>"

# Fetch latest emails
curl -X POST http://localhost:3001/api/v1/integrations/email/fetch \
  -H "Authorization: Bearer <token>"
```

## Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
npm test

# E2E tests
npm run test:e2e
```

## Deployment

### Production Build

```bash
# Build backend
cd backend
npm run build

# Build frontend
npm run build

# Run production
docker compose -f docker-compose.prod.yml up -d
```

### CI/CD

GitHub Actions workflow included:
- Lint & typecheck
- Run tests
- Build Docker images
- Deploy (configure in `.github/workflows/deploy.yml`)

## Troubleshooting

### Connection Issues

**Database connection failed**
```bash
# Check database status
docker compose ps db

# View database logs
docker compose logs db

# Restart database
docker compose restart db
```

**Redis connection failed**
```bash
# Check Redis
docker compose ps redis
docker compose logs redis
```

### Integration Issues

**Shopify sync not working**
- Verify `SHOPIFY_ACCESS_TOKEN` has required permissions
- Check shop URL format: `myshop.myshopify.com`
- Review webhook configuration in Shopify admin

**Email fetch not working**
- For Gmail: Enable "Less secure app access" or use App Password
- Verify IMAP is enabled in email settings
- Check firewall/network allows port 993

**Invoice generation failing**
- Set `ENABLE_PROVIDER_MOCK=true` for offline testing
- Verify wFirma credentials
- Check API quota/limits

### Reset Everything

```bash
# Stop and remove all containers
docker compose down -v

# Remove all data
docker volume rm ordermanager_postgres_data ordermanager_redis_data

# Start fresh
docker compose up -d --build
```

## Project Structure

```
order-manager/
├── backend/                # Backend application
│   ├── prisma/            # Database schema & migrations
│   ├── src/
│   │   ├── routes/        # API routes
│   │   ├── services/      # Business logic
│   │   ├── jobs/          # Background jobs
│   │   ├── integrations/  # External service adapters
│   │   └── middleware/    # Express middleware
│   └── package.json
├── src/                   # Frontend application
│   ├── components/        # React components
│   ├── pages/            # Page components
│   ├── hooks/            # Custom hooks
│   └── lib/              # Utilities
├── docker-compose.yml     # Docker services
└── README.md
```

## Security Notes

- Never commit `.env` files with real credentials
- Use strong JWT secrets (min 32 characters)
- Enable rate limiting in production
- Keep dependencies updated
- Use HTTPS in production
- Implement proper CORS policies

## Support & Contributing

- Report issues on GitHub
- Submit pull requests
- Follow code style guidelines
- Add tests for new features

## License

MIT License - see LICENSE file for details

---

Built with ❤️ for modern e-commerce businesses
