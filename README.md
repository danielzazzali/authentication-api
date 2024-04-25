# Payment API

## Running the app locally

### Installation

```bash
$ npm install
```
### Start the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

### Test the app

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Docker

### Build docker image

```bash
docker build -t payment-api .
```

### Run docker container

```bash
docker run -p APP_PORT:APP_PORT payment-api
```

### Stop Docker Container

Show running docker containers

```bash
docker ps
```

Replace CONTAINER_ID with the container id:

```bash
docker stop CONTAINER_ID
```
