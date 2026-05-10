FROM nginx:1.27-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY . /usr/share/nginx/html

EXPOSE 8080

CMD ["sh", "-c", "sed -i 's/listen       8080;/listen       ${PORT:-8080};/' /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]
