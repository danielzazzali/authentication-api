# Payment API

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Docker

## Build Docker Image

```bash
docker build -t payment-api .
```

## Run Docker Container

```bash
docker run -p APP_PORT:APP_PORT payment-api
```

## Stop Docker Container

Show running docker containers

```bash
docker ps
```

Replace CONTAINER_ID

```bash
docker stop CONTAINER_ID
```
