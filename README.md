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

`npm run build` creates the frontend build in `dist`. `npm start` runs the Express server, which serves the built React app and the API.

## API Routes

- `GET /api/health`
- `GET /api/properties`
- `GET /api/properties?location=Eastern&type=House&maxPrice=800000`
- `GET /api/properties/:id`
- `GET /api/about`
- `POST /api/inquiries`
- `POST /api/auth/signup`
- `POST /api/auth/signin`
- `GET /api/auth/me`
- `GET /api/bookings`
- `POST /api/bookings`
- `GET /api/admin/dashboard`
- `PATCH /api/admin/bookings/:id`

## React Structure

- `src/pages` contains route pages: Home, Buy, Rent, Properties, Property Details, Services, About, Contact, Favorites, Account, Admin Dashboard, Sign In, Sign Up, and Not Found.
- `src/components` contains reusable UI pieces such as Layout, SearchForm, PropertyCard, PropertyGrid, ContactForm, and SectionHeader.
- `src/services/api.js` centralizes frontend calls to the Express API.
- `src/hooks/useFavorites.js` stores saved properties in browser localStorage.
- `src/context/AuthContext.jsx` stores the current client session in browser localStorage.

## Frontend Routes

Client side starts at:

- `/`

Client routes:

- `/`
- `/buy`
- `/rent`
- `/properties`
- `/properties/:id`
- `/services`
- `/about`
- `/contact`
- `/favorites`
- `/account`
- `/settings`
- `/signin`
- `/signup`

Admin side starts at:

- `/admin`
- `/admin/settings`

## Demo Data

Client accounts, bookings, and public inquiries are stored in `server/data/db.json`. The file is ignored by git so demo data is not committed. Passwords are stored as salted hashes, and auth uses signed bearer tokens.

For the demo, you can copy `.env.example` to `.env` and adjust:

- `AUTH_SECRET`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `DB_FILE`

The JSON store is enough for a demo. A real deployed version would normally use MongoDB, PostgreSQL, or MySQL.

Run the project:

`npm run dev`

Open:

text->

`http://localhost:5173`

## Client Side

Go to:
text

http://localhost:5173/signup
Create a client account.

Then use:

text

`http://localhost:5173/buy`
`http://localhost:5173/rent`
`http://localhost:5173/account`

Client can browse houses, book viewing, request to buy, request to rent, and see their own requests.


## Admin Side

Go to:

`http://localhost:5173/admin`

Login with the admin account configured in `.env` or `.env.example`.

Admin can see clients, bookings, renters, buyers, inquiries, and update booking statuses.
