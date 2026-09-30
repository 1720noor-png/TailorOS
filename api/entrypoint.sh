#!/bin/sh
set -e

echo "==> Preparing Laravel Production Environment..."

# Generate app key if missing
if [ -z "$APP_KEY" ]; then
  php artisan key:generate --force
fi

# Run migrations and seeders
echo "==> Running Database Migrations & Seeds..."
php artisan migrate --force
php artisan db:seed --force || true

# Optimize configuration caching
echo "==> Optimizing Route and Config Caching..."
php artisan config:cache || true
php artisan route:cache || true

echo "==> Starting Web Server on port ${PORT:-8080}..."
exec php -S 0.0.0.0:${PORT:-8080} -t public
