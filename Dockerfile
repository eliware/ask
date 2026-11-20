FROM ghcr.io/eliware/centos10-node26:latest AS runtime
USER 0
WORKDIR /opt/ask
RUN chown node:node /opt/ask
COPY package*.json ./
RUN chown node:node package.json package-lock.json
USER node
RUN npm ci --omit=dev && npm cache clean --force
COPY --chown=node:node . .
CMD ["node", "bin/ask.mjs"]
