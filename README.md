
# GameHub API

REST API for **GameHub**, a community where players read about video games and beginner developers learn game development through "How to" articles. Users can publish, like and comment on articles and admins can moderate content.

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB_Atlas-47A248?logo=mongodb&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase_Storage-3FCF8E?logo=supabase&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?logo=vercel&logoColor=white)

## Live Demo

| | Link |
|---|---|
| API base URL | `https://article-site-api.vercel.app/ |
| Frontend app | `https://gamearticleweb.vercel.app/ |
| Frontend repository | `https://github.com/sasinduKavishka-123/Article-Site-Web.git|

## Features

- **Authentication:** register and login with hashed passwords and JWT access and refresh tokens
- **Role-based access:** regular users and admins, enforced on the server
- **Articles:** create, read, update and soft delete (articles are marked inactive, never removed from the database)
- **Tags and game names:** free-form, normalized tags and optional game names, searchable and filterable
- **Search and pagination:** newest first, with search by title, game name or tag
- **Engagement:** toggle likes on articles, add and delete comments
- **Image upload:** cover images stored in Supabase Storage, with the public URL saved in the database
- **AI text generation:** generates an introductory paragraph from the article title using the Gemini API
- **Admin moderation:** dashboard statistics, view active and inactive articles, delete and restore articles, delete comments

## Tech Stack

| Area | Technology |
|---|---|
| Language | TypeScript |
| Framework | Express.js |
| Database | MongoDB Atlas with Mongoose |
| Authentication | JSON Web Tokens, bcrypt |
| File storage | Supabase Storage |
| AI | Google Gemini API |
| Hosting | Vercel (API), MongoDB Atlas (database) |

## Project Structure 

```text
src/
├── index.ts                # Express app, exported for Vercel
├── config/
│   └── supabase.ts         # Supabase client
├── controllers/
│   ├── auth.controller.ts
│   ├── article.controller.ts
│   └── comment.controller.ts
├── middleware/
│   ├── auth.ts             # verifies the JWT, sets req.user
│   ├── role.ts             # check roles
│   └── upload.ts           # setup file upload
├── models/
│   ├── user.model.ts
│   ├── article.model.ts
│   └── comment.model.ts
├── routes/
│   ├── auth.routers.ts
│   ├── article.routers.ts
│   └── comment.routers.ts
└── services/
    ├── ai.routers.ts        # AI text generation
    └── storage.service.ts   # image upload
```

## Getting Started

### Prerequisites

- Node.js 20 or newer
- A MongoDB Atlas cluster and database user
- A Supabase project with a public Storage bucket
- A Google Gemini API key

### Installation

```bash
git clone https://github.com/sasinduKavishka-123/Article-Site-API.git
cd Article-Site-API
npm install
```

### Environment Variables

Create a `.env` file in the project root. (`.env.example` file is provided)

```text
MONGO_LOCAL_URL==
MONGO_URL=
PORT=5000 
JWT_SECRET=
JWT_REFRESH_SECRET=
SUPABASE_URL=
SUPABASE_KEY=
GEMINI_API_KEY=
```

| Variable | Description |
|---|---|
| `MONGO_LOCAL_URL` | Port for local development |
| `MONGODB_URI` | MongoDB Atlas connection string, including the database name |
| `PORT` | Backend origin |
| `JWT_SECRET` | Secret used to sign access tokens |
| `JWT_REFRESH_SECRET` | Secret used to sign refresh tokens |
| `SUPABASE_URL` | Your Supabase project URL |
| `SUPABASE_KEY` | Supabase service role key |
| `GEMINI_API_KEY` | Google Gemini API key |

## Running the Server 

```bash
npm run dev      # start with auto-reload
```

The API is then available at `http://localhost:5000/api`.


## Data Models

**system-users**

| Field | Type | Notes |
|---|---|---|
| `name` | String | Required |
| `email` | String | Required, unique |
| `password` | String | Hashed, never returned by the API |
| `roles` | String[] | `USER` (default) or `ADMIN` |
| `isActive` | Boolean | Inactive users cannot log in |
| `createdAt`, `updatedAt` | Date | Added automatically |

**article**

| Field | Type | Notes |
|---|---|---|
| `title` | String | Required |
| `content` | String | Required, plain text |
| `gameNames` | String[] | Optional |
| `tags` | String[] | Lowercased and trimmed |
| `coverImageUrl` | String | Optional, public Supabase URL |
| `author` | ObjectId | Reference to `system-users` |
| `likes` | ObjectId[] | References to `system-users` |
| `isActive` | Boolean | `false` means soft deleted |
| `createdAt`, `updatedAt` | Date | Added automatically |

**comment**

| Field | Type | Notes |
|---|---|---|
| `articleId` | ObjectId | Reference to `article` |
| `author` | ObjectId | Reference to `system-users` |
| `commentText` | String | Required |
| `createdAt`, `updatedAt` | Date | Added automatically |

## Authentication and Roles

- Passwords are hashed before they are saved.
- Logging in returns an **access token** and a **refresh token**. Send the access token in the `Authorization: Bearer <token>` header.
- Only register and login are public. Every other route requires a valid token.
- The `roles` are never accepted from the request body. New accounts are always `USER`.
- Admin routes are protected by role-checking middleware on the server.
- **Creating an admin:** register a normal account, then change its `roles`. Add `ADMIN` to it in database (Browse Collections, `system-users`).


## Related Repository

Frontend: [gamehub-client](https://github.com/sasinduKavishka-123/Article-Site-Web.git) (React, TypeScript, Tailwind CSS)

## Author

**Sasindu Kavishka**
- GitHub: [sasinduKavishka-123](https://github.com/sasinduKavishka-123)
- LinkedIn: [Sasindu Kavishka](https://www.linkedin.com/in/sasindu-kavishka-287b813a7/)


