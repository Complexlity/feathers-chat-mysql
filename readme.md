# Feathers Chat (MySQL Version)

The [demo feathers chat](https://github.com/feathersjs/feathers-chat/tree/dove/feathers-chat-ts) uses the sqlite database by default.
I had some [issues](https://github.com/feathersjs/feathers-chat/issues/282) setting the mysql version. But I was finally able to.
This repository contains the mysql/mariadb version of it.

## Changes Made
All the files used in the original (sqlite) version remains but here are the new files and changes

- Add MySQL connection properties to config
```json
//config/default.json
...
"mysql": {
    "client": "mysql",
    "connection": {
      "host": "localhost",
      "port": 3306,
      "user": "root",
      "password": "<root password>",
      "database": "<database name>"
    }
  },
...
```

- Set mysqlClient from the new sql connection
```typescript
//src/mysql.ts
import knex from 'knex'
import type { Knex } from 'knex'
import type { Application } from './declarations'

declare module './declarations' {
  interface Configuration {
    mysqlClient: Knex
  }
}

export const mysql = (app: Application) => {
  const config = app.get('mysql')
  const db = knex(config!)
  app.set('mysqlClient', db)
}
```

- Update knexfile to use mysql config rather that sqlite
```
// knexfile.ts
...
const config = app.get('mysql')
...
```

- Update the migration code where foreign key errors
In the migrations file in `migrations/....chat.ts`, there's the function to alter the messages table adding `userId` which  is a foreign key to the users table on `id`

```
//migrations/....chat.ts
...
await knex.schema.alterTable('messages', (table) => {
    table.bigint('createdAt')
    table.bigint('userId').references('id').inTable('users')
  })
...
```

Above is the default code which works as it should in the sqlite version but it fails when using the mysql version with error
```
 alter table `messages` add constraint `messages_userid_foreign` foreign key (`userId`) references `user` (`id`) - ER_CANT_CREATE_TABLE: Can't create table `test_database`.`messages` (errno: 150 "Foreign key constraint is incorrectly formed")

```
I fixed this by changing the code to
```
//migrations/...chat.ts
...
await knex.schema.alterTable('messages', (table) => {
    table.integer('userId').unsigned().notNullable()
    table.bigint('createdAt')
    table.foreign('userId').references('id').inTable('users')
  })
...
```

## Getting Started

- Install Dependencies

```bash
npm install
```

- Update `config/default.json` with the `mysql` connection details as stated above

- Compile, migrate

```bash
npm run compile
npm run migrate
```

- Start the Server

In Developement Mode

```bash
npm run dev
```

otherwise,

```bash
npm run start
```

Now go to <http://localhost:3030> to start chatting 🕊️
