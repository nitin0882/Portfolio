# Nitin Singh — Portfolio Website

A fully responsive, animated personal portfolio built with **vanilla HTML5, CSS3, and JavaScript** (no frameworks). Showcases Nitin Singh's work as a Python Developer & Data Analyst, including AI/LLM projects, data-driven web apps, skills, certifications, and a working contact form.

## Features

- Dark mode by default with a persistent light mode toggle
- Glassmorphism cards, gradient accents, animated blob backgrounds
- Canvas-based particle/network background
- Custom cursor with glow trail (disabled on touch devices)
- Animated loading screen with percentage counter
- Typing "terminal" hero animation
- Scroll progress bar, navbar blur-on-scroll, active-link highlighting
- Scroll-reveal animations (Intersection Observer)
- Animated skill progress bars + circular skill charts
- Animated statistic counters
- Project cards with modal popups (image slider, features, challenges)
- Contact form with real-time JavaScript validation
- Fully responsive: mobile, tablet, and desktop
- Respects `prefers-reduced-motion`

## File Structure

```
portfolio/
├── index.html
├── css/
│   ├── style.css        # design tokens, layout, components, animations
│   └── responsive.css   # tablet & mobile breakpoints
├── js/
│   ├── script.js         # loader, cursor, nav, theme, terminal, modal, form
│   └── animation.js       # particle background, ripple button effect
├── assets/
│   ├── images/
│   │   └── profile.png
│   ├── icons/
│   └── resume.pdf
└── README.md
```

## Running Locally

No build step required. Just open `index.html` in a browser, or serve the folder:

```bash
cd portfolio
python -m http.server 8000
```

Then visit `http://localhost:8000`.

## Customizing

- **Colors / fonts**: edit the CSS custom properties at the top of `css/style.css` (`:root` and `[data-theme="light"]`).
- **Resume PDF**: replace `assets/resume.pdf` with an updated file (keep the same filename, or update the `href` in the hero "Download Resume" button in `index.html`).
- **Projects**: edit the project cards in `index.html` under `#projects`, and update the matching entry in the `projectData` object in `js/script.js` for the modal popup content.
- **Contact form**: the form validates client-side only. To actually receive submissions, connect it to a backend endpoint or a form service (e.g. Formspree) inside the `submit` handler in `js/script.js`.

## Credits

Built for Nitin Singh — [GitHub](https://github.com/nitin0882) · [LinkedIn](https://www.linkedin.com/in/nitin-singh-57b95b306)
