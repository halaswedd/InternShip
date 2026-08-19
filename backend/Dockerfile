FROM php:8.4-cli

RUN docker-php-ext-install mysqli

WORKDIR /app

COPY . /app

CMD ["sh", "-c", "php -S 0.0.0.0:${PORT:-8080}"]