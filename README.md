# Knowledge Hub

## Prerequisites

- Git - [Download & Install Git](https://git-scm.com/downloads).
- Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager.

## Downloading

```
git clone {repository URL}
```

## Installing NPM modules

```
npm install

docker compose up --build
(use localhost for POSTGRES_HOST if running the command outside the docker container)

i.e

DATABASE_URL="postgresql://{POSTGRES_USER}:{POSTGRES_PASSWORD}@localhost:{POSTGRES_PORT}/{POSTGRES_DB}" npx prisma migrate dev


npx prisma db seed --schema=src/db/schema.prisma
(use localhost for POSTGRES_HOST if running the command outside the docker container)

i.e

DATABASE_URL="postgresql://{POSTGRES_USER}:{POSTGRES_PASSWORD}@localhost:{POSTGRES_PORT}/{POSTGRES_DB}" npx prisma db seed --schema=src/db/schema.prisma
```

## Running application

```
npm start

npx prisma migrate dev

npx prisma db seed


```

After starting the app on port (4000 as default) you can open
in your browser OpenAPI documentation by typing http://localhost:4000/doc/.
For more information about OpenAPI/Swagger please visit https://swagger.io/.

## Testing

After application running open new terminal and enter:

To run all tests without authorization

```
npm run test
```

To run only one of all test suites

```
npm run test -- <path to suite>
```

To run all test with authorization

```
npm run test:auth
```

To run only specific test suite with authorization

```
npm run test:auth -- <path to suite>
```

To run refresh token tests

```
npm run test:refresh
```

To run RBAC (role-based access control) tests

```
npm run test:rbac
```

### Auto-fix and format

```
npm run lint
```

```
npm run format
```

### Debugging in VSCode

Press <kbd>F5</kbd> to debug.

For more information, visit: https://code.visualstudio.com/docs/editor/debugging

### Dcoker image

docker pull ricardojosedev/course:latest

### Generate Gemini API Key

```
visit https://aistudio.google.com/
click on "get started" (login)
on the left panel, it should be "Get API key" menu option. click this option
click on "Create API Key"

Gemini Model
gemini-2.5-flash
```

### Run application

```
Steps

create env file from env.example file
npm install
docker compose up --build

run migrations

(from outside container)
DATABASE_URL="postgresql://admin:admin@localhost:5432/knowledgehubdb" npx prisma migrate dev --schema=src/db/prisma/schema.prisma

(from within container)
DATABASE_URL="postgresql://admin:admin@db:5432/knowledgehubdb" npx prisma migrate dev --schema=src/db/prisma/schema.prisma

run seed

DATABASE_URL="postgresql://admin:admin@localhost:5432/knowledgehubdb" npx prisma db seed

(from within container)
DATABASE_URL="postgresql://admin:admin@db:5432/knowledgehubdb" npx prisma db seed

seed contains an admin user. login: admin, password: admin

by default app uses port 7000:

curl -X POST http://localhost:7000/article
```
