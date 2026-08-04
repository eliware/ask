FROM node:26-bookworm-slim
WORKDIR /opt/ask
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force
COPY --chown=node:node . .
USER node
CMD ["node", "ask.mjs"]
