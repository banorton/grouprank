# GroupRank

GroupRank is a web application that allows users to create polls with multiple options, submit rankings for those options, and calculate average rankings based on user input. The application consists of a backend API built with ASP.NET Core and Entity Framework Core, and a frontend built with React.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## Features

- Create polls with a title and multiple options.
- Submit rankings for poll options.
- Calculate and display average rankings for each option.
- Prevent circular references in JSON responses.
- Handle concurrency and database migrations with Entity Framework Core.

## Technologies Used

- **Backend:**
  - ASP.NET Core
  - Entity Framework Core
  - MySQL (using Pomelo Entity Framework Core provider)
- **Frontend:**
  - React
  - Axios (for HTTP requests)
- **Database:**
  - MySQL (running in a Docker container)

## Prerequisites

- [.NET 6 SDK](https://dotnet.microsoft.com/download/dotnet/6.0)
- [Node.js and npm](https://nodejs.org/) (for the frontend)
- [Docker](https://www.docker.com/) (for running MySQL in a container)
- [MySQL Client Tools](https://dev.mysql.com/downloads/mysql/) (optional, for database management)

## Installation

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/group_rank.git
cd group_rank
```

### 2. Set Up the Backend
**a. Navigate to the Backend Directory**
```bash
cd src/group_rank.API
```
**b. Install Dependencies**
```bash
dotnet restore
```
**c. Set Up the MySQL Docker Container**
```bash
docker run --name mysql-container -e MYSQL_ROOT_PASSWORD=yourpassword -e MYSQL_DATABASE=grouprankDB -p 3306:3306 -d mysql:8.0
```
    - Replace `yourpassword` with a secure password.
    - Ensure the container is running by checking: `docker ps`
**d. Update Connection String**
In `appsettings.json`, update the `ConnectionStrings` section to match your MySQL configuration:
```json
"ConnectionStrings": {
  "DefaultConnection": "Server=localhost;Database=grouprankDB;User=root;Password=yourpassword;"
}
```

### 3. Set Up the Frontend
**a. Navigate to the Frontend Directory**
```bash
cd ../group_rank_client
```
**b. Install Dependencies**
```bash
npm install
```
## Configuration
### MySQL Database
You need a running MySQL database, which can be easily set up using Docker. Make sure your database settings (username, password, and database name) are correctly set in the `appsettings.json` file in the backend.

### Backend Environment Variables
You can configure the backend using environment variables or modify the `appsettings.json` file for custom settings such as database connection strings.

### Frontend Configuration
The frontend connects to the backend API via Axios. Ensure the `API_URL` in your frontend files points to the correct backend server URL (for local development, it should be `http://localhost:5166`).

## Running the Application
### Backend
To run the backend server:
```bash
cd src/group_rank.API
dotnet run
```
This will start the backend API on `http://localhost:5166`.

### Frontend
To run the frontend React application:
```bash
cd group_rank_client
npm start
```
This will start the frontend development server on `http://localhost:3000`.

## API Endpoints
- **POST /api/poll** - Create a new poll.
- **GET /api/poll/{id}** - Get poll details by ID.
- **POST /api/poll/{id}/submi**t-rankings - Submit rankings for a poll.
- **POST /api/poll/{id}/end** - End the poll.
- **GET /api/poll/{id}/results** - Get the final results for a poll.

## Project Structure
```
group_rank/
│
├── src/
│   ├── group_rank.API/           # Backend ASP.NET Core project
│   │   ├── Controllers/          # API Controllers
│   │   ├── Models/               # Entity Models
│   │   ├── Data/                 # Database context
│   │   ├── Migrations/           # Entity Framework Migrations
│   │   └── appsettings.json      # Configuration settings
│   └── group_rank_client/        # Frontend React project
│       ├── public/
│       ├── src/
│       └── package.json          # NPM dependencies
└── README.md                     # Project documentation
```
