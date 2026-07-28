# Wicked GH - Project Plan & Strategy

## 1. What We Need (The Prerequisites)
To deliver a high-fashion, editorial-style e-commerce experience, we need to gather the following:
*   **High-Fidelity Assets:** Raw, high-resolution photography and video loops (cinematics). This is the lifeblood of a lookbook site.
*   **Brand Tokens:** 
    *   *Colors:* Hex codes for the deep jewel tones (burgundy, slate) and neutrals (carbon, oat).
    *   *Typography:* The specific script font and clean serif/sans-serif fonts used in their graphics.
*   **Content Inventory:** Product details, sizing charts, pricing, and "Pre-order" policy documentation.
*   **Tech Stack Selection:**
    *   **Framework:** Next.js (React) for server-side rendering (critical for SEO and fast loading of heavy images).
    *   **Styling:** Vanilla CSS / CSS Modules for absolute control over custom animations and layouts (avoiding generic utility-class looks to keep it bespoke).
    *   **Motion:** Framer Motion or pure CSS animations for cinematic page transitions and scroll effects.
    *   **Backend/Database:** Supabase for handling the product catalog, "drops", and pre-orders.
    *   **Payments:** On hold for now.

## 2. Our Approach (The Phases)
We will build this in a structured, iterative manner:

### Phase 1: The Design System & "Vibe" Prototype
*   Define the "Night Luxe" color palette and typography in code (`index.css` or CSS variables).
*   Build a static "Hero" landing page prototype to nail the animations (e.g., a slow-fade image carousel or video background).

### Phase 2: Core Architecture & Navigation
*   Implement the routing and layout shell.
*   Create a minimalist, persistent navigation bar that doesn't distract from the imagery.
*   Build the "Lookbook" grid (the product display component).

### Phase 3: E-Commerce Integration (The "Drop" Mechanics)
*   Build the product detail pages (PDP) with high-res image galleries.
*   Implement the Shopping Cart flow (Payments integration is currently on hold).
*   Build the specialized "Pre-order" logic and UI indicators.

### Phase 4: Polish & Performance
*   Implement lazy loading and image optimization (Next.js `<Image>` component).
*   Add micro-interactions (magnetic buttons, subtle hover reveals).
*   Mobile-first optimization (ensuring the site feels like a native app on phones).

## 3. Our Pipeline (How We Work)
*   **Version Control:** Git repository (GitHub/GitLab) with feature branching.
*   **Local Development:** `npm run dev` for rapid iteration.
*   **CI/CD (Continuous Integration/Deployment):** Vercel. This allows us to have live "Preview Deployments" every time we commit code, meaning you can check the site's progress on your phone instantly.
*   **Quality Gates:** Pre-commit hooks for linting to ensure code stays perfectly clean.

## 4. Delivering a Quality Product
To ensure the final product actually feels "Premium" and not just like a template:
*   **Zero Layout Shift:** Images must have reserved aspect ratios so the page doesn't jump as high-res photos load.
*   **The "Weight" of Animations:** Animations shouldn't be bouncy or fast. They should be eased, slow, and deliberate to convey luxury.
*   **Performance is Luxury:** A slow site feels cheap. We will heavily utilize modern image formats (WebP/AVIF) and edge caching.
*   **Impeccable Mobile UX:** Since their audience comes from Instagram, 90% of traffic will be mobile. The mobile view isn't an afterthought; it's the primary design. No cramped buttons, no awkward scrolling.
