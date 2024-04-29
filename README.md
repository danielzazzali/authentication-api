# Authentication API

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
sudo docker build -t authentication-api .
```

### Run docker container

```bash
sudo docker run -p APP_PORT:APP_PORT authentication-api
```

### Stop Docker Container

Show running docker containers

```bash
sudo docker ps
```

Replace CONTAINER_ID with the container id:

```bash
sudo docker stop CONTAINER_ID
```


front1.com/token?=kajdhjsahdjlahdasdlkajd

front2.com/token?=kajdhjsahdjlahdasdlkajd
