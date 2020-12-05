FROM node:14.15.1-alpine

LABEL maintainer="Chao Tzu-Hsien"

LABEL org.opencontainers.image.source https://github.com/KMU-Dev/video-uploader

WORKDIR /app

# Create a group and user
RUN addgroup -S uploader && adduser -S uploader -G uploader

# Change /app owner
RUN chown -R uploader:uploader /app

# Change user for security
USER uploader:uploader

# Copy dependency specification file
COPY --chown=uploader:uploader package.json yarn.lock /app/

# Install dependincies
RUN yarn --version && yarn

# Copy application file
COPY --chown=uploader:uploader dist/ /app/

# Expose app running port
EXPOSE 3000

# Start app
ENTRYPOINT ["node", "index.js"]
