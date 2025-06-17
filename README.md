# Hotel Booking App

A modern hotel booking web application built with [Nuxt 3](https://nuxt.com/), featuring hotel search, detailed hotel pages, room selection, and booking functionality. The app leverages a modular component architecture, server-side API integration, and a beautiful, responsive UI.

## Features

- **Hotel Search & Filtering:**  
  Search for hotels by location, (date, number of guests and number rooms for room data) and filter by amenities and price range.
- **Hotel Listings:**  
  Browse a list of hotels with images, ratings, prices, and locations.
- **Hotel Details:**  
  View detailed information for each hotel, including:
  - Overview and description
  - Photo gallery
  - Amenities
  - Policies
  - Contact information
  - Map and address
- **Room Selection & Booking:**  
  See available rooms, rate plans, inclusions, and book directly from the app.  
  Includes guest/room capacity checks and booking confirmation modals.
- **Responsive UI:**  
  Fully responsive design with mobile-friendly search for hotel data.
- **API Integration:**  
  All hotel, search, and booking data is fetched from a backend API.

## Tech Stack

- **Frontend:** Nuxt 3, Tailwind CSS, shadcn-nuxt
- **Backend/API:** Nuxt server routes (see `/server/api/`)
- **State & Utilities:** Vue composables, VueUse, dayjs

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- pnpm

### Installation

```bash
pnpm install
```

### Development

Start the development server:

```bash
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

### Production

Build for production:

```bash
pnpm build
```

Preview the production build:

```bash
pnpm preview
```

## Project Structure

- `pages/` — Main routes (`index.vue` for search/list, `hotels/[slug].vue` for hotel details)
- `components/` — UI components (hotel cards, search bar, filters, modals, etc.)
- `composables/` — Custom Vue composables for API calls and state management
- `server/api/` — API endpoints for hotels, search, and room data
- `assets/` — Static assets and styles
- `types/` — TypeScript types

## API Endpoints

The app proxies requests to an external hotel API via Nuxt server routes:

- `POST /api/hotels` — List all hotels
- `POST /api/hotels/search` — Search hotels by criteria
- `POST /api/hotels/custom-search` — Custom search with result transformation(since original hotel search result does not have data such as 'image')
- `POST /api/hotels/:slug` — Get hotel details by slug
- `POST /api/hotels/:slug/rooms` — Get available rooms for a hotel

## Customization

- **Styling:**  
  Uses Tailwind CSS and shadcn-nuxt for UI components. Customize styles in `assets/css/main.css`.
- **API:**  
  Update API endpoints in `server/api/` if your backend changes.
- **Components:**  
  Extend or modify UI components in `components/` as needed.
