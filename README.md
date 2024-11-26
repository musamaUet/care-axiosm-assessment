# NestJS User Management Project

## Overview
A user management service built with NestJS. Includes:
- **PostgreSQL**: Data storage.
- **Redis**: Caching.
- **RabbitMQ**: Messaging.
- **Docker Compose**: Service management.

### Features
1. Create and list users with pagination and filtering.
2. Cache frequently accessed data in Redis.
3. Send a welcome message to RabbitMQ on user creation.
4. Graceful RabbitMQ connection handling.

---

## How to Run the Project

### Pre-Requisites
1. **Install Docker and Docker Compose**.
2. **Clone the Repository**:
   ```bash
   git clone https://github.com/musamaUet/care-axiosm-assessment
   cd /care-axiosm-assessment/user-management

2. **Add a .env File in the project root:**:
### PostgreSQL
POSTGRES_HOST=postgres
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=password
POSTGRES_DB=user-management

### Redis
REDIS_HOST=redis
REDIS_PORT=6379

### RabbitMQ
RABBITMQ_URL=amqp://rabbitmq
RABBITMQ_QUEUE=welcomeQueue

### Steps to Run
Start services:
```bash
   docker-compose up --build

Access:
NestJS API: http://localhost:3000
RabbitMQ Console: http://localhost:15672 (Default: guest/guest)
Verify logs for successful connections.

## API Documentation

### Base URL
http://localhost:3000

### Endpoints

#### 1. Create a User
- **URL**: `/users`
- **Method**: `POST`
- **Payload**:
  ```json
  {
    "name": "John Doe",
    "email": "john.doe@example.com",
    "age": 25
  }

. List All Users
URL: /users
Method: GET
Query Params:
page (default: 1)
limit (default: 10)
Example:
bash
Copy code
GET /users?page=1&limit=5