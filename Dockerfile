# Используем легковесный образ nginx на базе Alpine
FROM nginx:alpine

# Указываем автора (опционально)
LABEL authors="yusch"

# Удаляем стандартные файлы из директории nginx
RUN rm -rf /usr/share/nginx/html/*

# Копируем все статические файлы проекта в рабочую директорию nginx
COPY . /usr/share/nginx/html

# Заменяем конфигурацию nginx на нашу
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Открываем порт 80 для HTTP-трафика
EXPOSE 80

# Запускаем nginx в foreground режиме (обязательно для Docker)
CMD ["nginx", "-g", "daemon off;"]