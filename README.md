# Project Documentation: Backend for Project Management

This documentation provides an overview of the backend project management. The backend is built using Prisma, TypeScript, Express, and Express file routing.

To get started, you need to install the project dependencies. Run the following command:

```bash
npm install //menginstall dependensi
```
## Notion Documentation

[Notion Documentation](https://fauzi-ramdani.notion.site/Project-Management-23a6a7815e994bb0a6b2670e5cf62c40?pvs=73)

## Database Setup

### Pulling the Database Schema

Synchronize the database schema with your `schema.prisma` file:

```bash
//sync skema database ke shema.prisma
npx prisma db pull --schema=./prisma/schema1.prisma //db project management
```

### Generating Prisma Client

Generate the Prisma client based on the schema:

```bash
//generate prisma client
npx prisma generate --schema=./prisma/schema1.prisma
npx prisma generate --schema=./prisma/schema2.prisma
```

## Project Structure

The project is structured using Express with file routing. Below is an example of the project structure:

```
/src
  /routes
    /folder-name
	    -index.ts
	    -[id].ts
  - app.ts
  /utils
		 -db.ts
/schema
  - schema.prisma
.env
```

- **/src/routes**: Contains the route handlers for the application.
- **/schema/schema.prisma**: Defines the Prisma database schema.

## Running the Project

To run the project, use the following command:

```bash
npm run dev //run project
```

## API Endpoints

- **GET /folder-name**: Fetches a list of data.
- **POST /folder-name**: Creates a new data.
- **GET /folder-name/:id**: Fetches a data by ID.
- **PUT /folder-name/:id**: Updates a data by ID.
- **DELETE /folder-name/:id**: Deletes a data by ID.
