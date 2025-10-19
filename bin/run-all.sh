#!/bin/sh

# Colors for output
GREEN='\033[0;32m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Starting Mercur Marketplace (run-all.sh)...${NC}"

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo ".env does not exist. Copying from .env.example..."
    cp ".env.example" ".env"
    echo ".env created from .env.example."
fi

# Start infrastructure
echo "⏳ Starting infrastructure (PostgreSQL and Redis)..."
pnpm infra &
INFRA_PID=$!

# Wait for PostgreSQL to be ready
echo -n "⏳ Waiting for PostgreSQL to be ready"
until docker compose exec postgres pg_isready -U postgres; do
    echo -n "."
    sleep 2
done

# Wait for Redis to be ready
echo -n "⏳ Waiting for Redis to be ready"
until docker compose exec redis redis-cli ping | grep -q PONG; do
    echo -n "."
    sleep 2
done

echo -e "\r${GREEN}✅ PostgreSQL and Redis are ready!${NC}"

# Run database migrations
echo -e "${GREEN}🗄️  Setting up database...${NC}"

echo "🚀 Running database migrations..."
if pnpm --filter medusa db:migrate; then
    echo -e "${GREEN}✅ Database migrations completed successfully${NC}"
else
    echo -e "\033[0;31m❌ Failed to run migrations${NC}"
    cleanup
    exit 1
fi

echo -e "${GREEN}✅ Database setup completed! Starting application servers...${NC}"

# Start the application servers
pnpm turbo run dev &
TURBO_PID=$!

echo -e "\nInfrastructure PID: $INFRA_PID"
echo "Turbo PID: $TURBO_PID"
echo -e "${GREEN}✨ All services starting!${NC}"
echo -e "${GREEN}📱 Storefront: http://localhost:8000${NC}"
echo -e "${GREEN}🔧 Backend API: http://localhost:9000${NC}"
echo -e "${GREEN}💼 Vendor Panel: http://localhost:3001${NC}"
echo "Press Ctrl+C to stop all services"

# Function to cleanup on exit
cleanup() {
    echo -e "\n${GREEN}Stopping all services...${NC}"
    kill $TURBO_PID 2>/dev/null
    kill $INFRA_PID 2>/dev/null
    docker compose down
    exit 0
}

trap cleanup INT TERM

# Wait for turbo process
wait $TURBO_PID