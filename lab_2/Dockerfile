FROM nginx:alpine

COPY index.html style.css /usr/share/nginx/html/
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY certs/cert.pem certs/key.pem /etc/nginx/certs/

EXPOSE 443

CMD ["nginx", "-g", "daemon off;"]
