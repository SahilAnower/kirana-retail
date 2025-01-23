FROM nginx:latest

# Copy the custom nginx.conf to override the default global config
COPY nginx.conf /etc/nginx/nginx.conf

# Copy the default.conf for your server-specific settings
COPY default.conf /etc/nginx/conf.d/default.conf