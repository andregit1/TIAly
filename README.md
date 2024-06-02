# Project Documentation: URL Shortener Service

This project is a URL shortener service inspired by [shorturl.at](http://shorturl.at) and [TinyURL](https://tinyurl.com/app), developed on Pop!\_OS using a modern tech stack.

### 1. Tech Stack

- **Node.js** (version 20 LTS)
- **PostgreSQL**
- **Redis**
- **Passport.js** (for authentication)
- **Swagger** (for API documentation)
- **Docker** (for containerization)

### 2. Creating the Database

Before you start, ensure that PostgreSQL is set up properly. You will need to create the initial database that will be used by the service.

### 3. Environment Configuration

Rename `.env.example` to `.env` and fill in the necessary environment variables.

### 4. Building and Running the Docker Containers

1. **Build the Docker containers:**

   ```sh
   docker-compose build
   ```

2. **Start the Docker containers:**

   ```sh
   docker-compose up
   ```

3. **Run the database migrations:**

   ```sh
   docker-compose exec app npx sequelize-cli db:migrate
   ```

4. **Seed the database with initial data:**

   ```sh
   docker-compose exec app npx sequelize-cli db:seed:all
   ```

### 5. Accessing the API Documentation

You can access the Swagger API documentation at [http://localhost:3000/api-docs](http://localhost:3000/api-docs).

### 6. Playing Around with the API

- **Visitor:** You can create short URLs using the section for URLs.
- **Admin:** Sign in with the username `root` and password `123123123`. This will give you access to admin-specific features.

### 7. Explaining the URLs

- **/api-docs:** Access the API documentation.
- **/auth:** Endpoints for user authentication (signup, signin, signout).
- **/admin:** Endpoints for admin-specific functionalities (create, get, update, delete URLs).
- **/url:** Endpoints for creating and managing short URLs.

### 8. Features

- **User Authentication:** Uses Passport.js for handling user authentication. Only users with specific roles can access certain features.
- **Custom Slugs:** Only admins can create custom slugs.
- **Edit and Delete:** Only admins can edit or delete URLs.
- **Visitor:** Visitors can create short URLs without needing to sign in.
- **Redis Caching:**
  ##### 1. Short URL Creation:
  - Newly generated short URLs are cached in Redis for quick retrieval.
  ##### 2. Click Count Tracking:
  - Click counts for short URLs are cached in Redis, reducing database queries.
  ##### 3. Efficiency and Freshness:
  - Redis caching improves system performance by minimizing database queries.
  - Cached data is regularly synced with the database via an hourly cron job.
  - Data expires after 300 seconds, ensuring freshness and responsiveness.

### 9. Sequence Diagrams

#### Section URL (for Visitors)

1. **Create Short URL:**

   ```mermaid
   sequenceDiagram
       participant Visitor
       participant Server

       Visitor->>Server: Create short URL request
       Server->>Server: Generate short URL and store in DB
       Server->>Visitor: Return short URL
   ```

2. **Redirect URL:**

   ```mermaid
   sequenceDiagram
       participant Visitor
       participant Server

       Visitor->>Server: Access short URL
       Server->>Server: Look up original URL
       Server->>Visitor: Redirect to original URL
   ```

3. **Track URL Count:**

   ```mermaid
   sequenceDiagram
       participant Visitor
       participant Server

       Visitor->>Server: Access short URL
       Server->>Server: Increment access count in DB
   ```

#### Section Auth (for User Authentication)

1. **Signup:**

   ```mermaid
   sequenceDiagram
       participant User
       participant Server

       User->>Server: Submit signup form
       Server->>Server: Validate and create new user
       Server->>User: Return success message
   ```

2. **Signin:**

   ```mermaid
   sequenceDiagram
       participant User
       participant Server

       User->>Server: Submit signin form
       Server->>Server: Validate credentials
       Server->>User: Return session token
   ```

3. **Signout:**

   ```mermaid
   sequenceDiagram
       participant User
       participant Server

       User->>Server: Request sign out
       Server->>Server: Invalidate session token
   ```

#### Section Admin (for Admin Management)

1. **Admin Signup:**

   ```mermaid
   sequenceDiagram
       participant Admin
       participant Server

       Admin->>Server: Submit signup form
       Server->>Server: Create admin user
       Server->>Admin: Return success message
   ```

2. **Admin Signin:**

   ```mermaid
   sequenceDiagram
       participant Admin
       participant Server

       Admin->>Server: Submit signin form
       Server->>Server: Validate credentials
       Server->>Admin: Return session token
   ```

3. **Create URL:**

   ```mermaid
   sequenceDiagram
       participant Admin
       participant Server

       Admin->>Server: Create new short URL
       Server->>Server: Store URL in DB
   ```

4. **Get URL:**

   ```mermaid
   sequenceDiagram
       participant Admin
       participant Server

       Admin->>Server: Request list of URLs
       Server->>Server: Retrieve URLs from DB
       Server->>Admin: Return list of URLs
   ```

5. **Update URL:**

   ```mermaid
   sequenceDiagram
       participant Admin
       participant Server

       Admin->>Server: Submit updated URL data
       Server->>Server: Update URL in DB
   ```

6. **Delete URL:**

   ```mermaid
   sequenceDiagram
       participant Admin
       participant Server

       Admin->>Server: Request to delete URL
       Server->>Server: Delete URL from DB
   ```

7. **Signout:**

   ```mermaid
   sequenceDiagram
       participant Admin
       participant Server

       Admin->>Server: Request sign out
       Server->>Server: Invalidate session token
   ```

### 10. Entity-Relationship Diagram (ERD)

The Entity-Relationship Diagram (ERD) illustrates the relationship between the main entities in the system:

- **Users:** Represents users who interact with the system.
- **Roles:** Defines the roles assigned to users (e.g., admin, visitor).
- **URLs:** Stores the URLs and their corresponding short versions.
- **URLAccessLogs:** Tracks access to URLs, including visitor information.

```
Users
-----------------------------------------------------------------
| id (PK)   | username  | password  | roleId (FK) | createdAt   |
-----------------------------------------------------------------
| 1         | admin     | password  | 1           | timestamp   |
| 2         | visitor   | password  | 2           | timestamp   |
-----------------------------------------------------------------

Roles
-------------------------
| id (PK)   | name      |
-------------------------
| 1         | admin     |
| 2         | user      |
-------------------------

URLs
---------------------------------------------------------------
| id (PK)   | domain   | slug    | originalUrl | clickCount |
---------------------------------------------------------------
| 1         |          | abc123  | example1    | 0          |
| 2         |          | xyz456  | example2    | 0          |
---------------------------------------------------------------

URLAccessLogs
------------------------------------------
| id (PK)   | urlId (FK) | ipAddress     |
------------------------------------------
| 1         | 1          | 127.0.0.1     |
| 2         | 2          | 127.0.0.1     |
------------------------------------------
```

### 11. Future Enhancements

1. **Slug Generation:**

   - Currently, the system checks for the uniqueness of custom slugs. However, to improve the user experience and ensure better slug management, additional restrictions and validations can be implemented. This may include enforcing character limitations, disallowing certain patterns, or providing suggestions for available custom slugs.

2. **Caching URL Access Logs:**

   - Extend caching to store URL access logs in Redis temporarily. This can help in efficiently tracking and analyzing recent URL accesses without directly querying the database. Similar to click counts, these access logs can be periodically persisted to the database for long-term storage and analysis.

3. **Testing:**
   - Develop more comprehensive test cases to ensure the robustness of the application.

---
