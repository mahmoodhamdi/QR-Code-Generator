FROM node:20-alpine AS build

WORKDIR /app
COPY package.json ./
RUN npm install --omit=optional
COPY tsconfig.json ./
COPY src ./src
RUN npm run build

FROM node:20-alpine AS runtime

RUN apk add --no-cache tini

WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY package.json ./

RUN mkdir -p /app/data && chown -R node:node /app
USER node

EXPOSE 4000

ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "dist/index.js"]
