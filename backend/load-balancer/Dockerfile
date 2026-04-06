# Use official Nginx image as base
FROM nginx:alpine

# Remove default configuration
RUN rm /etc/nginx/nginx.conf

# Copy our custom configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 80 for traffic
EXPOSE 80

# Run nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
