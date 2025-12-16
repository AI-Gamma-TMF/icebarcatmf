## --------- for development ---------
FROM node:18.1.0-alpine AS builder


RUN apk update
RUN apk add --no-cache python3 make g++


WORKDIR /home/node/app


# set our node environment, either development or production
# defaults to production, compose overrides this to development on build and run
ARG NODE_ENV=development
ENV NODE_ENV $NODE_ENV


# ARG REACT_APP_API_URL=http://localhost:8080
# ENV REACT_APP_API_URL $REACT_APP_API_URL
ARG PORT=8080
ENV PORT $PORT
EXPOSE $PORT 9240 9241


# set DEBIAN_FRONTEND to noninteractive.
ENV DEBIAN_FRONTEND noninteractive


# install dependencies first, in a different location for easier app bind mounting for local development


COPY ./package*.json ./
RUN yarn install
RUN chmod -R 0777 /home/node/app/node_modules


# copy in our source code last, as it changes the most
COPY . .


# RUN GENERATE_SOURCEMAP=false && yarn run build


## --------- for production deployment ---------
FROM nginx:stable AS production
WORKDIR /usr/share/nginx/html
EXPOSE 80
COPY --from=builder /home/node/app/build /usr/share/nginx/html
COPY --from=builder /home/node/app/nginx.conf /etc/nginx/conf.d/default.conf
CMD ["/bin/bash", "-c", "nginx -g \"daemon off;\""]