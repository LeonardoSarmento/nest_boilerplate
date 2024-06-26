# Roles and Guides to contributing on this Project


## Getting Started Guide

After clone repository, and open project directory, is require install all dependencies (packages):

```bash
# Download all dependencies (node_modules)
npm i
```

Before use any `Prisma CLI` is required properly set `database` and `.env` file (see [Environment Variables](#environments-variables)).

```bash
# Initialize / generate Prisma types
npx prisma generate
```

```bash
# Apply all migrations on Database (sync db-schema)
npx prisma migrate deploy
```

```bash
# Populate your database (seeding db)
npx prisma db seed
```

If you use Docker in this application maybe is required config [Windows to export port](https://learn.microsoft.com/en-us/windows-server/networking/technologies/netsh/netsh-interface-portproxy#add-v4tov4):
```bash
# netsh (Network shell)
netsh interface portproxy add v4tov4 listenport=<desired-external-port> listenaddress=<your-network-layer> connectaddress=<your-docker-network-layer> connectport=<your-docker-application-port>
```
```bash
# Example of export port using `netsh` (Network shell)
netsh interface portproxy add v4tov4 listenport=46098 listenaddress=10.145.32.86 connectaddress=localhost connectport=3333
```

Now just run project:

```bash
npm run start:dev
```

## Environments Variables

To run this project, you will need to add the following environment variables to your .env file and **Production server**.

- `APP_URL` : Current server running, if `NODE_ENV` is `Dev`, `APP_URL` is probable be like: '<http://localhost>'
- `APP_PORT` : Current server running, if `NODE_ENV` is `Dev`, `APP_URL` is probable be: '<3333>'

- `JWT_SECRET` : Private key used to create Json Web Token. (see [JWT secret](https://jwt.io/introduction#:~:text=Putting%20all%20together))

if you need to generate a JWT secret key, you can use the following code:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```	

- `DATABASE_URL` : Database connection string (current [Postgres URL](https://www.prisma.io/docs/reference/database-reference/connection-urls#postgresql)).


> To see a example of _.env_ go to file: [.env.example](.env.example):

---


## Submission Guidelines

Like [Angular CONTRIBUTING](https://github.com/angular/angular/blob/main/CONTRIBUTING.md)

> Types

- **merge**: Merging between branches.
- **build**: Changes that affect the build system or external dependencies (example scopes: pip, npm, NuGet)
- **ci-cd**: Changes to our CI configuration files and scripts (examples: Github Actions (Workflows), CircleCi)
- **docs**: Documentation only changes (examples: Swagger settings, Markdown files)
- **feat**: A new feature
- **fix**: A bug fix
- **refactor**: A code change that neither fixes a bug nor adds a feature
- **test**: Adding missing tests or correcting existing tests
- **run-try**: Using to test some thing that demand commit push trigger (examples: try deploy build, try Ci-CD), require [remove from history](#revert-commit) after fished tests

> Scopes

- `controller`
- `entity`: Is understand that has changed 'database', 'dto' besides the own 'entity'.
- `dto`
- `module`
- `service`
- `database`
- `repository`
- `none/empty string`: useful for `test` and `refactor` changes that are done across all packages (e.g. `test: add missing unit tests`) and for docs changes that are not related to a specific package .

## The File Release.sh

This file improve automation of somes process:

- Fetch `origin` changes.
- Create changelog datas.
- Discover right next tag to new release type.

To permission file run.

```bash
chmod +x ./release.sh
```

Create new Release with Changelog. The `x` meaning change, `0` not will change.

```bash
./release.sh -v pre # 0.0.0.-x
./release.sh -v patch # 0.0.x
./release.sh -v minor # 0.x.0
./release.sh -v major # x.0.0
```