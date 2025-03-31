# TaxDown Technical Test – Backend

This is a backend application developed with **NestJS**, following **Hexagonal Architecture**, **Domain-Driven Design (DDD)**, **Event Sourcing**, and deployed using the **Serverless Framework**.

It uses PostgreSQL for state projections, MongoDB as an Event Store, and is ready for local development using `serverless-offline`.

---

## 📊 Technologies Used

- **NestJS**
- **Prisma ORM**
- **PostgreSQL** (for read model projections)
- **MongoDB** (for domain event storage)
- **Serverless Framework** (with `serverless-offline` for local dev)
- **Docker** (to spin up local databases)
- **Swagger** (for API documentation)
- **Jest** (for unit and integration tests)
- **Hexagonal Architecture + DDD + Event Sourcing**

---

## 🚀 Getting Started (Local Setup)

Follow these steps to run the application locally with Docker and the Serverless Framework.

### 1. Clone the repository

```bash
git clone https://URL_ADDRESS.com/your-username/taxdown-technical-test.git
cd taxdown-technical-test
```

---

### 2. Install dependencies

Install using [pnpm](https://pnpm.io/):

```bash
pnpm install
```

---

### 3. Setup environment variables

Copy the example `.env` file:

```bash
cp .env.template .env
```

Then fill in the required values, such as:

```dotenv
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/taxdown-db?schema=public
MONGODB_URI=mongodb://localhost:27017/taxdown-events
PORT=3000
VERSION=v1
```

---

### 4. Start Docker services

This will start PostgreSQL and MongoDB locally:

```bash
docker-compose -f docker/docker-compose.base.yml up -d
```

---

### 5. Run Prisma migrations

```bash
npx prisma migrate dev
```

This will apply the schema and create the necessary tables in the PostgreSQL database.

---

### 6. Run the application in local serverless mode

Use `serverless-offline` to emulate AWS Lambda locally:

```bash
pnpm start:offline -- --noPrependStageInUrl
```

> The `--noPrependStageInUrl` flag prevents serverless from prefixing `/dev` (or `/local`) in your local URLs.

---

## ✅ API Access

Once running, the API will be accessible at:

- **Base URL:** `http://localhost:3000`
- **Swagger Documentation:** `http://localhost:3000/api/v1/docs`

You can use tools like Postman, curl, or a frontend client to interact with the endpoints.

---

## 📂 Project Structure (Simplified)

```bash
src/
├── customer/                  # Bounded context: commands, queries, entities, VO, exceptions, etc.
├── shared/                    # Shared kernel: event publisher, db connections, filters, etc.
├── config/                    # Global configuration (env, swagger, filters)
├── serverless.ts              # Entry point for AWS Lambda
└── main.ts                    # Entry point for local dev (optional if not used)
```

---

## 🗓 Notes

- The project is designed using **Hexagonal Architecture** to isolate domain logic from infrastructure.
- Events are **persisted in MongoDB** using a custom event publisher and used to **project read models into PostgreSQL**.
- The API is **fully documented via Swagger** and exposed under `/api/v1/docs`.
- The application is **tested with Jest**, including unit tests for Value Objects and integration tests for handlers.

---

## 🧑‍💻 Author

> This technical test was developed by **[Your Name]** as part of the evaluation process for **TaxDown**.

---

## 💪 Useful Commands

```bash
# Run tests
pnpm test

# Run tests with watch
pnpm test:watch

# Re-generate Prisma client
pnpm prisma generate

# Preview schema in browser (requires running database)
pnpm prisma studio
```

---

## 📦 About Serverless Framework

The project uses the [Serverless Framework](https://www.serverless.com/) to define and deploy infrastructure and functions. Locally, we simulate AWS Lambda behavior using `serverless-offline`.

> To avoid automatic route prefixing with stages like `/dev`, we use `--noPrependStageInUrl` during local development.

For deployment, simply run:

```bash
serverless deploy
```

Ensure your AWS credentials are configured if deploying to the cloud.

---

## 🔢 Example Endpoints

### Create Customer

```http
POST /api/v1/customers
```

**Body:**

```json
{
  "firstName": "User",
  "lastName": "Example",
  "email": "user@example.com",
  "phone": "+18095551234"
}
```

---

### Get All Customers (with filters)

```http
GET /api/v1/customers?firstName=User&sortBy=credit&sortDirection=desc
```

**Query Params:**

- `firstName`: optional string
- `lastName`: optional string
- `email`: optional string
- `phone`: optional string
- `sortBy`: `credit`, `firstName`, `createdAt`, etc.
- `sortDirection`: `asc` | `desc`

---

### Update Customer

```http
PATCH /api/v1/customers/:id
```

**Body:**

```json
{
  "firstName": "Luis",
  "credit": 100
}
```

---

### Delete Customer

```http
DELETE /api/v1/customers/:id
```

---
