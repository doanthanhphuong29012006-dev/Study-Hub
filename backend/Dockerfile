FROM node:22-alpine AS build
WORKDIR /app

RUN corepack enable && corepack prepare yarn@1.22.22 --activate
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY tsconfig.json ./
COPY src ./src
RUN yarn build

FROM node:22-alpine AS runtime
WORKDIR /app

RUN corepack enable && corepack prepare yarn@1.22.22 --activate
ENV NODE_ENV=production

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --production=true

COPY --from=build /app/dist ./dist
USER node

EXPOSE 1234
CMD ["node", "dist/index.js"]