# NestWise Properties

NestWise Properties is now a React, SASS, JavaScript, Express, and Node project. The frontend reads property listings, about data, and inquiry responses from the Express backend.

## Tech Stack

- React + Vite
- SASS
- JavaScript
- Node + Express

## Run Locally

```bash
npm install
npm run dev
```

The app runs at:

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000/api`

## Useful Commands

```bash
npm run build
npm start
```

`npm run build` creates the production frontend in `dist`. `npm start` runs the Express server, which serves the built React app and the API.

## API Routes

- `GET /api/health`
- `GET /api/properties`
- `GET /api/properties?location=Eastern&type=House&maxPrice=800000`
- `GET /api/properties/:id`
- `GET /api/about`
- `POST /api/inquiries`
