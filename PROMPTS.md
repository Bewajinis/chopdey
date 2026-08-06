# ChopDey — Build Prompts

Food discovery & ordering app for Lagos (bukas + restaurants), built with Vite, React, TypeScript, MVVM, Firebase Auth, and Cloud Firestore.

**How to use this file:**
- Feed the AI **one prompt at a time**, in order. Never skip ahead.
- After each prompt: review the output against `rules/rules.md`, test it, tick the box in `specs.md`.
- If the AI makes a mistake, do NOT fix the code by hand — fix the prompt/rule that allowed the mistake and regenerate. Log every correction in the Correction log at the bottom.
- Commit with a detailed message after every working brick.

---

## Phase 0 — Foundation & Data

### 1. Initialize app

```
Initialize a new React application using Vite, React, and TypeScript.

Use functional components only.

Do not install any UI library.

Do not add any app functionality yet.
```

### 2. Clean Vite starter

```
Remove all default Vite content, images, styles, and demonstration code.

Leave a minimal working React application with an empty App component.

Do not create any additional components or functionality.
```

### 3. Design the seed data (BEFORE types — data first)

```
Create a seed data file:

src/data/seedVenues.json

Generate realistic Lagos food venue data with this structure:

- 5 delivery zones: Yaba, Surulere, Ikeja, Lekki Phase 1, Victoria Island
- each zone has: id, name, centerLat, centerLng, deliveryFee (in naira), estimatedDeliveryMinutes (a range, e.g. "20-35")
- 12 venues per zone (60 total)
- each venue has: id, name, type ("buka" or "restaurant"), zoneId, lat, lng (near the zone center), imageUrl (leave as empty string), openingHour, closingHour (24h numbers), packFee (in naira, 200-500)
- roughly half bukas, half restaurants per zone
- each venue has a menu array of 5-8 items
- each menu item has: id, name, category (e.g. "Rice", "Swallow", "Protein", "Sides", "Drinks"), price (realistic naira prices), availableFrom, availableUntil (24h numbers, so items can sell out by evening)
- bukas should have buka-style items (jollof, amala, ewedu, assorted meat, ofada, moi moi); restaurants can have broader menus (shawarma, pasta, grills, chicken and chips)
- use realistic Nigerian venue names

Do not write any application code.
Do not create TypeScript types yet.
Do not touch Firebase.
```

### 4. Derive types from the data

```
Create shared TypeScript types inside src/types/, derived exactly from the structure of src/data/seedVenues.json.

Create and export:

- Zone
- Venue (with a VenueType union: "buka" | "restaurant")
- MenuItem
- CartItem (a MenuItem plus quantity and venueId)
- Order (items, subtotal, packFee, deliveryFee, serviceCharge, total, venueId, venueName, zoneId, customerPhone, deliveryAddress, landmark, status, createdAt)

Requirements:

- types only, no logic
- no React imports
- do not create any components or services
```

### 5. Firebase + Firestore config

```
Install Firebase and create the Firebase configuration.

Create:

src/services/firebaseService.ts

Requirements:

- initialize Firebase using Vite environment variables
- initialize Cloud Firestore using getFirestore and export db
- initialize Firebase Authentication using getAuth and export auth
- use the modern modular Firebase SDK
- we are using Cloud Firestore ONLY - do not use or import Realtime Database anywhere

Also create a .env.example file containing placeholder Firebase environment variables.

Do not add any data functions yet.
Do not add authentication UI.
```

### 6. Seed script + security rules v1

```
Create a one-time seed script that uploads src/data/seedVenues.json into Cloud Firestore.

Requirements:

- store zones in a "zones" collection using the zone id as document ID
- store venues in a "venues" collection using the venue id as document ID, with the menu embedded in each venue document
- the script should be runnable from the command line with node
- log progress and a summary when finished

Also write Firestore security rules (firestore.rules) for this stage:

- zones and venues: public read, no client writes
- everything else: denied

Explain where to paste the rules in the Firebase console.

Do not modify any React code.
```

**✅ Test gate:** Firestore console shows 5 zones and 60 venues; a rules test confirms clients cannot write to venues.

---

## Phase 1 — App shell

### 7. Header

```
Create a reusable Header component.

The Header should contain:

- the app name "ChopDey" as a link to home
- a Home navigation link
- a Favourites navigation link
- an Orders navigation link
- a Cart link with a placeholder item-count badge
- a search input and Search button
- a placeholder Login button

Use React Router links for navigation.

Do not create any pages yet.
Do not connect the search input, cart badge, or login button to any functionality.
```

### 8. Routing skeleton + shared components

```
Set up application routing and shared UI components.

Routes (each rendering an empty placeholder page for now):

- / (Home)
- /venue/:id
- /search
- /favourites
- /orders
- /cart
- /auth
- a 404 Not Found page for unknown routes

Also create shared presentational components in src/components/:

- Loader (loading message)
- ErrorMessage (receives an error string)
- EmptyState (receives a friendly message and optional hint)

The Header must be visible on every page.

Do not implement any page content or data fetching.
```

### 9. Error boundary

```
Create a top-level React error boundary component that catches rendering errors and displays a friendly fallback message with a "reload" button.

Wrap the application with it.

Do not add any other functionality.
```

### 10. Style the shell

```
Add styling for the Header, layout, and shared components.

Requirements:

- mobile-first: this app will mostly be used on phones
- clean, food-app feel with a bright, beautiful palette mixing yellow, red, and green: yellow for surfaces and the header, red for primary actions, green for navigation, links, and focus states
- define the colors as CSS variables in src/index.css so every later screen reuses them
- style the 404 page and error boundary fallback

Do not add page-specific content styling yet.
```

**✅ Test gate:** every nav link opens a distinct empty page; unknown URLs show 404; layout looks right at phone width.

---

## Phase 2 — Vertical slice (a working order, end to end)

### 11. Venue service

```
Implement the venue data service.

Create:

src/services/venueService.ts

Create and export:

- getZones(): Promise<Zone[]>
- getVenuesByZone(zoneId: string): Promise<Venue[]>
- getVenueById(venueId: string): Promise<Venue>

Requirements:

- read from Cloud Firestore using the db export from firebaseService
- return typed data using the shared types
- throw readable errors when requests fail or documents are missing
- do not use React hooks
- do not manage loading or error state
```

### 12. VenueCard

```
Create a reusable VenueCard component.

Create:

src/components/VenueCard/VenueCard.tsx

Requirements:

- receive one Venue object through props
- display: image (placeholder if imageUrl is empty), name, a "Buka" or "Restaurant" type badge, open/closed status derived from openingHour/closingHour and the current time, and the zone's estimated delivery time when provided through props
- add a Favourite button, but do not connect it yet
- keep the component presentational: no API calls, no Firebase, no navigation logic beyond linking the card to /venue/:id

Do not create the Home page logic yet.
```

### 13. Home MVVM (v1 — hardcoded zone)

```
Implement the Home screen using MVVM.

Create:

src/pages/Home/HomeModel.ts
src/pages/Home/useHomeViewModel.ts
src/pages/Home/HomeView.tsx

HomeModel:
- getVenuesForZone(zoneId: string): Promise<Venue[]> using venueService
- no React hooks

useHomeViewModel:
- manage venues, loading, error with useState
- load venues for the hardcoded zone "yaba" when the screen opens (useEffect)
- return all state needed by the view

HomeView:
- use useHomeViewModel only
- show Loader while loading, ErrorMessage on error, EmptyState when no venues
- render venues with VenueCard using .map()

Do not import venueService in the view or view model directly - the view model uses the model only.
Do not add location, zone selection, search, or filters yet.
```

### 14. Venue detail page + FoodCard

```
Implement the venue detail screen using MVVM, plus a FoodCard component.

Create:

src/components/FoodCard/FoodCard.tsx
src/pages/Venue/VenueModel.ts
src/pages/Venue/useVenueViewModel.ts
src/pages/Venue/VenueView.tsx

FoodCard:
- presentational; receives one MenuItem
- displays name, category, price in naira, and availability (sold out when the current hour is outside availableFrom/availableUntil)
- an "Add to cart" button prop callback, disabled when unavailable

VenueModel:
- getVenue(venueId: string) using venueService; validate the id

useVenueViewModel:
- read :id from the route
- manage venue, loading, error; load on open

VenueView:
- venue header (name, type badge, open/closed, pack fee notice)
- menu grouped by category using FoodCard and .map()

Do not implement the cart yet - pass an empty function to the FoodCard callback.
```

### 15. Cart logic (pure functions first)

```
Create the cart business logic as pure functions, then a cart context.

Create:

src/utils/cartCalculations.ts
- calculateSubtotal(items: CartItem[]): number
- calculateTotals(items: CartItem[], venue: Venue, zone: Zone): an object with subtotal, packFee, deliveryFee, serviceCharge (5% of subtotal, rounded), and total
- pure functions, no React, fully typed

src/context/CartContext.tsx
- global cart state: items, the current venue and zone
- actions: addItem, removeItem, updateQuantity, clearCart
- rule: the cart can only contain items from ONE venue; adding an item from a different venue must signal the UI to ask the user to clear the cart first
- persist the cart to localStorage and restore it on load
- expose computed totals using cartCalculations

Wrap the application with the CartProvider.

Do not build the cart page yet.
Do not connect the FoodCard button yet.
```

### 16. Wire add-to-cart

```
Connect the cart to the UI.

Requirements:

- FoodCard "Add to cart" adds the item through the venue view model, which uses CartContext
- when adding from a different venue than the current cart, show a confirmation asking to clear the cart first
- the Header cart badge shows the live item count
- the add-to-cart handling logic lives in the view model, not in the view

Do not build the cart page yet.
```

### 17. Cart page + checkout (guest orders)

```
Implement the Cart screen using MVVM.

Create:

src/pages/Cart/CartModel.ts
src/pages/Cart/useCartViewModel.ts
src/pages/Cart/CartView.tsx

CartView shows:
- cart items with quantity controls and remove buttons
- a cost breakdown: subtotal, pack fee, delivery fee, service charge, total (all in naira)
- a checkout form: phone number (required, validated as a Nigerian phone number), delivery address (required), landmark (optional but encouraged with a hint like "beside the yellow gate")
- a Place Order button

CartModel:
- placeOrder(order: Order): saves the order to a Firestore "orders" collection through a new orderService
- validate phone and address before saving

Behaviour:
- on success: clear the cart, show a success message with the order summary
- orders are guest orders for now - no user accounts yet

Also update firestore.rules: allow anyone to create an order, but nobody to read or update orders from the client (we will tighten this when auth arrives).

Do not add authentication.
Do not add order history.
```

**✅ Test gate (the big one):** open Home → pick a buka → add 2 items → cart shows correct totals including pack + delivery fees → fill phone + address → place order → order appears in Firestore → cart is empty → refresh mid-cart keeps the cart (localStorage). **The app now works end to end.**

---

## Phase 3 — Location & zones

### 18. Location service

```
Create the location service.

Create:

src/services/locationService.ts

Create and export:

- getUserLocation(): Promise<{lat: number, lng: number}> using the browser geolocation API, with a readable error when permission is denied or unavailable
- getDistanceKm(a: {lat, lng}, b: {lat, lng}): number using the haversine formula
- findNearestZone(location, zones: Zone[]): Zone - returns the zone whose center is closest

Requirements:

- pure JavaScript/TypeScript, no React hooks
- no Firebase calls
```

### 19. Home v2 — real location and zone selection

```
Upgrade the Home screen to be location-aware.

Requirements:

- add a "Use my location" button: gets the user's coordinates, finds the nearest zone with findNearestZone, loads that zone's venues
- add a zone selector dropdown listing all zones from Firestore, as the fallback when location is denied
- remember the chosen zone in localStorage
- display the current zone name prominently ("Showing food near Yaba")
- within the zone, sort venues by distance to the user when coordinates are available
- display the zone's estimated delivery time on each VenueCard ("20-35 min") - do NOT display raw kilometres
- when geolocation fails, show a friendly message and fall back to the zone selector

All logic goes in HomeModel / useHomeViewModel; the view stays presentational.

Do not show venues from other zones.
```

### 20. Venue type filter

```
Add filter chips to the Home screen: All / Buka / Restaurant, plus an "Open now" toggle.

Requirements:

- filtering logic lives in the view model
- "Open now" uses the derived open/closed status
- filters combine (e.g. open bukas only)
- keep the current filter in state; default is All

Do not add search functionality here.
```

### 21. Unit tests for the pure logic

```
Set up Vitest and write unit tests for the pure functions:

- getDistanceKm: known coordinate pairs with expected distances
- findNearestZone: a point clearly nearest to one zone
- calculateTotals: correct subtotal, pack fee, delivery fee, 5% service charge, and total for a sample cart
- the one-venue-per-cart rule
- menu item availability: available and sold-out cases around the availableFrom/availableUntil boundaries

Do not test React components.
Do not add end-to-end tests.
```

**✅ Test gate:** deny location → pick zone manually → venues show; allow location → nearest zone auto-selected; all unit tests pass.

---

## Phase 4 — Search

### 22. Search model

```
Implement food search across venues.

Create:

src/pages/Search/SearchModel.ts

Create and export:

searchFood(query: string, zoneId: string): Promise<Array<{item: MenuItem, venue: Venue}>>

Requirements:

- trim the query and validate at least 2 characters
- search menu item names case-insensitively across all venues in the given zone only
- return each matching item paired with its venue
- use venueService; no React hooks; no direct Firestore calls
```

### 23. Search screen + wire the Header

```
Implement the Search screen using MVVM and connect the Header search input.

Requirements:

- submitting the Header search navigates to /search?q=<query>
- the Search view model reads the query from the URL, runs SearchModel.searchFood with the current zone, and manages results, loading, error
- results render as FoodCards with the venue name and "from <venue>" linking to that venue's page
- show validation errors (query too short) and an EmptyState for no results
- searching for food that is currently sold out still shows it, marked as sold out

Do not add filters to search yet.
```

**✅ Test gate:** searching "jollof" from the header lists every venue in your zone selling jollof; "x" shows a validation message.

---

## Phase 5 — Authentication & security

### 24. Auth service

```
Create:

src/services/authService.ts

Implement and export:

- registerUser(email: string, password: string)
- loginUser(email: string, password: string)
- logoutUser()
- subscribeToAuthChanges(callback)

Requirements:

- use Firebase Authentication (createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged)
- return typed Firebase User data where appropriate
- convert Firebase errors into readable messages
- no React hooks, no JSX
```

### 25. Auth MVVM

```
Implement the authentication screen using MVVM.

Create:

src/pages/Auth/AuthModel.ts
src/pages/Auth/useAuthViewModel.ts
src/pages/Auth/AuthView.tsx

AuthModel:
- register(email, password), login(email, password), logout()
- trim and normalize the email; validate non-empty fields and password of at least 6 characters
- call authService; no hooks

useAuthViewModel:
- state: email, password, mode ("login" | "register"), loading, error
- handleSubmit() calls the right AuthModel function for the mode; clears previous errors; clears the password on success
- toggleMode()

AuthView:
- controlled email and password inputs, submit via onSubmit with preventDefault
- title and button text follow the mode; disable submit while loading; readable errors
- a button to switch between login and registration

The view imports only the view model. The view model imports only the model.
```

### 26. AuthContext

```
Create a global authentication context.

Create:

src/context/AuthContext.tsx

Requirements:

- use subscribeToAuthChanges from authService
- store the current user and an authLoading state while Firebase restores the session
- expose user, authLoading, logout
- wrap the application with AuthProvider and unsubscribe on unmount
- show a loading state while authentication initializes

Do not add favourites or orders logic.
```

### 27. Protected routes + header auth state

```
Update routing and the Header for authentication.

Requirements:

- protect /favourites and /orders: unauthenticated users are redirected to /auth
- authenticated users visiting /auth are redirected to /
- Home, venue pages, search, and cart remain public
- the Header shows Login when signed out, and the user's email plus a Logout button when signed in
- use user and authLoading from AuthContext
```

### 28. Security rules v2 + orders tied to users

```
Now that authentication exists, tighten security and connect orders to accounts.

Update firestore.rules:

- zones, venues: public read, no client writes
- orders: a signed-in user may create an order only with their own uid on it, and may read only their own orders; guests may still create orders with no uid but cannot read any
- users/{userId} data (favourites): read and write only by that user

Update order placement:

- when a user is signed in, save their uid and email on the order
- the checkout form pre-fills nothing else; phone and address are still required

Explain how to test these rules in the Firebase console rules playground.
```

**✅ Test gate:** register → redirected home → /orders opens; logout → /orders bounces to /auth; rules playground confirms a user cannot read another user's orders.

---

## Phase 6 — Favourites & order history

### 29. Favourites service

```
Add favourites functions to a new file:

src/services/favouritesService.ts

Create and export:

- addFavourite(userId: string, venue: Venue): Promise<void>
- removeFavourite(userId: string, venueId: string): Promise<void>
- getFavourites(userId: string): Promise<Venue[]>

Requirements:

- store under users/{userId}/favourites/{venueId} in Firestore
- throw a readable error when userId is missing
- do not access auth.currentUser inside the service - userId always comes in as a parameter
- no React hooks
```

### 30. Favourites MVVM

```
Implement the Favourites screen using MVVM.

Create:

src/pages/Favourites/FavouritesModel.ts
src/pages/Favourites/useFavouritesViewModel.ts
src/pages/Favourites/FavouritesView.tsx

Requirements:

- the model wraps favouritesService
- the view model gets the userId from AuthContext, loads favourites on open, and handles removal with local state updates
- the view renders VenueCards, with Loader, ErrorMessage, and a friendly EmptyState ("No favourite spots yet - go find your buka!")
- the view imports only the view model
```

### 31. Wire the favourite button

```
Connect the Favourite button on VenueCard.

Requirements:

- the click logic lives in the owning screen's view model, never in the view or in VenueCard itself
- signed in: toggle the venue in favourites and reflect the state on the card (filled/unfilled heart)
- signed out: redirect to /auth
- show favourite state correctly on Home, Search, and Favourites screens
```

### 32. Order history

```
Implement the Orders screen using MVVM.

Create:

src/pages/Orders/OrdersModel.ts
src/pages/Orders/useOrdersViewModel.ts
src/pages/Orders/OrdersView.tsx

Requirements:

- add getOrders(userId) to the order service, reading only that user's orders
- list orders newest first: venue name, date, item summary, total, status
- Loader, ErrorMessage, and EmptyState ("No orders yet - your first meal is waiting")
- the view imports only the view model
```

**✅ Test gate:** two different accounts see different favourites and different order histories; hearts stay in sync across screens.

---

## Phase 7 — Polish & submission

### 33. Sold-out realism pass

```
Review every place a menu item can appear (venue page, search, cart) and make sure time-based availability is respected consistently:

- sold-out items are visibly marked and cannot be added to the cart
- items already in the cart that become unavailable show a warning at checkout

Keep all availability logic in one shared utility function used everywhere.
```

### 34. Image placeholder strategy

```
Venues have empty imageUrl values. Create an attractive placeholder system:

- a reusable component that renders a warm, food-themed placeholder with the venue's initials when there is no image
- different background tones for bukas versus restaurants
- used by VenueCard and the venue detail header

Do not fetch images from external services.
```

### 35. Styling pass

```
Do a full styling pass across all screens: Home, Venue, Search, Cart, Auth, Favourites, Orders, 404.

Requirements:

- mobile-first, consistent spacing, readable naira formatting everywhere (e.g. a proper naira sign with thousand separators)
- consistent card styles, buttons, and form fields
- visible focus states on interactive elements
- do not change any logic
```

### 36. Edge-case sweep

```
Walk through the app and verify every screen handles all three states: loading, error, and empty.

Check specifically:

- geolocation denied
- Firestore unreachable (simulate offline)
- empty search results
- empty cart checkout attempt (button disabled with a hint)
- invalid phone number on checkout

Fix anything missing. List everything you changed.
```

### 37. Documentation

```
Create the project README.

Include:

- what ChopDey is and the deliberate scope decisions (no payments, no rider tracking, no vendor dashboard, zone-based delivery only) with one-line reasons
- the architecture: MVVM layering rules and why we chose it (clear placement rules for AI-generated code), with links to one example implementation (files, not descriptions)
- setup instructions: env variables, seeding, running tests
- a summary of how AI assisted the build and examples of manual corrections, drawn from PROMPTS.md and learnings.md
```

**✅ Final test gate:** run every previous test gate once more, on a phone-sized window, with all unit tests passing.

---

## Correction log

Record every time you had to correct the AI here, under the prompt number that caused it. This section is submission gold.

| Prompt # | What went wrong | How I corrected it (prompt/rule change) |
|---|---|---|
| 10 | "use a warm accent color" was too vague — produced a muted orange theme, then a first bright pass used blue, which I didn't want | Rewrote prompt 10 to specify the exact palette (bright yellow/red/green with role per color) and to require CSS variables in src/index.css for reuse |
