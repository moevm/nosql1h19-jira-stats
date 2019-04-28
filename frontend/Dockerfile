FROM node:11-stretch as build
WORKDIR /usr/jira_stats
COPY package.json .
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine as production
RUN apk add curl
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
COPY --from=build /usr/jira_stats/build /usr/share/nginx/html
