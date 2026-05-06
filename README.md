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

To run the frontend and backend separately, open two terminals:

```bash
npm.cmd run dev:backend
```

```bash
npm.cmd run dev:frontend
```

The frontend uses `VITE_API_BASE_URL=http://localhost:5000/api` to call the backend.

Before running the backend, start MySQL in XAMPP. If port `5000` is already in
use, another backend is already running. Close that terminal or stop the Node
process using port `5000`.

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
- `/buy/houses`
- `/buy/apartments`
- `/rent`
- `/rent/houses`
- `/rent/apartments`
- `/properties`
- `/properties/:id`
- `/request/:id`
- `/post/sell`
- `/post/rent`
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

## MySQL Database

A full MySQL database export is available at `database/nestwise_mysql.sql`. It creates the `nestwise_properties` database and seeds:

- `users`
- `properties`
- `agents`
- `inquiries`
- `owner_posts`
- `bookings`

To use it with Beekeeper Studio:

1. Start MySQL locally.
2. Open Beekeeper Studio and connect with:

```text
Host: 127.0.0.1
Port: 3306
User: root
Database: nestwise_properties
```

3. Open `database/nestwise_mysql.sql` in Beekeeper and run the whole script.
4. Refresh the connection and browse the tables.

For the demo, you can copy `.env.example` to `.env` and adjust:

- `VITE_API_BASE_URL`
- `AUTH_SECRET`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `DB_FILE`
- `MYSQL_HOST`
- `MYSQL_PORT`
- `MYSQL_USER`
- `MYSQL_PASSWORD`
- `MYSQL_DATABASE`

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

Clients now choose a request type and preferred date on a property, continue to a personal details form, then submit the full booking/rent/buy request. Client accounts show request status and last-seen information.

Admin dashboard separates booking, renting, and buying requests, shows client details and last-seen time, and can delete a client account plus that client's requests when finished.

Clients can also post their own property for NestWise to sell or rent out:

- `/post/sell`
- `/post/rent`

Admin can see these owner property posts in the admin dashboard.

## Deploy On Render

This project can deploy as one full-stack web service because Express serves the built React app from `dist`.

1. Push this project to GitHub.
2. Open Render and create a new Blueprint or Web Service from the repository.
3. If using the included `render.yaml`, Render will use:

```bash
npm install && npm run build
npm start
```

4. Add these environment variables in Render:

```env
AUTH_SECRET=use-a-long-random-secret
ADMIN_EMAIL=your-admin-email@example.com
ADMIN_PASSWORD=your-strong-admin-password
DB_FILE=server/data/db.json
```

After deploy:

- Client side: `https://your-render-app.onrender.com`
- Admin side: `https://your-render-app.onrender.com/admin`

Note: `server/data/db.json` is fine for a demo. Hosted files can reset on some free hosting setups, so use MongoDB, PostgreSQL, or MySQL later if you need permanent data.
