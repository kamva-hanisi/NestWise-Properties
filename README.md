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

## React Structure

- `src/pages` contains route pages: Home, Properties, Property Details, Services, About, Contact, Favorites, and Not Found.
- `src/components` contains reusable UI pieces such as Layout, SearchForm, PropertyCard, PropertyGrid, ContactForm, and SectionHeader.
- `src/services/api.js` centralizes frontend calls to the Express API.
- `src/hooks/useFavorites.js` stores saved properties in browser localStorage.

## Frontend Routes

- `/`
- `/properties`
- `/properties/:id`
- `/services`
- `/about`
- `/contact`
- `/favorites`
