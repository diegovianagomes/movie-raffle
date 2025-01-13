# movie-raffle

This project is a movie and series raffle application built with Next.js, utilizing the TMDB API to fetch movie data. It provides a way to randomly select a movie from a user's personal movie list, along with information on where to watch it.

## Project Description

This application allows users to draw a movie randomly from their personal list, which is based on TMDB API.

### Key Features

-   **Movie Raffle:** A button to trigger a random selection of a movie from the user's list.
-   **Movie Display:** Display the movie's poster, title, release year, and average rating.
-   **Watch Providers:** Fetches and displays where to watch the selected movie.
-   **Responsive Design:** The app is designed to work well on both desktop and mobile devices.
-   **UI Components:** Uses Shadcn UI components for a consistent and modern look.

### Tech Stack

-   Next.js
-   TypeScript
-   Tailwind CSS
-   Shadcn UI
-   TMDB API
-   Embla Carousel
-   React Hook Form
-   Zod

### How to Run

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/your-repo.git
    cd diegovianagomes-movie-raffle
    ```

2.  **Install dependencies:**

    ```bash
    bun install
    ```

3.  **Set up environment variables:**
    -   Create a `.env` file in the root of your project.
    -   Add your TMDB API key as `TMDB_API_KEY=your_api_key`.

4.  **Run the development server:**

    ```bash
    bun run dev
    ```

5.  **Open your browser:**
    -   Go to `http://localhost:3000` to see the application.

### How to Build

```bash
bun run build
```
Use code with caution.
### License
This project is licensed under the MIT License. See the LICENSE file for more details.

Copyright (c) 2025 Diego Viana
