# --------------> The build image
FROM node:16.17.0-bullseye-slim as build

RUN apt-get update && apt-get install -y --no-install-recommends dumb-init

WORKDIR /app

COPY package.json yarn.lock ./
COPY prisma ./prisma/

RUN yarn install --immutable --immutable-cache --check-cache

COPY . /app

RUN yarn run build

COPY start.sh .
RUN chmod +x start.sh

# --------------> The production image
FROM node:16.17.0-bullseye-slim

ENV NODE_ENV=production
ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=3000

COPY --from=build /usr/bin/dumb-init /usr/bin/dumb-init
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package*.json /app/yarn.lock ./
COPY --from=build /app/.output ./.output
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/start.sh ./

EXPOSE 3000

ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD ["./start.sh"]