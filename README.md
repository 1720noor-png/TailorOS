# ToolHub

Free, private, browser-only utility tools built with React + Vite. No backend, no API keys, no analytics.

## Included tools (62 so far)
| Category | Tools |
|---|---|
| Student | GPA/CGPA Calculator, Grade Calculator, Attendance Calculator, Study Planner, Exam Countdown, Timetable Generator, Citation Generator, Assignment Planner, Percentage Calculator, Flashcard Maker |
| Developer | JSON Formatter, JSON Validator, Code Formatter, Regex Tester, Base64 Encoder/Decoder, URL Encoder/Decoder, HTML/CSS/JS Minifier, Color Converter, QR Code Generator, Timestamp Converter |
| Office | Invoice Generator, Meeting Agenda Maker, Meeting Minutes Generator, Task Manager, Business Letter Generator, Email Signature Generator, Timesheet Calculator, Leave Calculator, Expense Report Generator, Document Checklist |
| Marketing | Keyword Generator, Meta Tag Generator, UTM Builder, Hashtag Generator, Social Media Caption Generator, SEO Title Generator, SEO Description Generator, Content Calendar, SERP Preview, Marketing ROI Calculator |
| Productivity | Pomodoro Timer, Habit Tracker, To-Do List, Daily Planner, Weekly Planner, Time Zone Converter, World Clock, Countdown Timer, Random Decision Maker, Random Number Generator |
| Shopping | Shopping List Maker, Price Comparison Calculator, Discount Calculator, Sales Tax Calculator, Tip Calculator, Split Bill Calculator, Unit Price Calculator, Shopping Budget Calculator, Gift Budget Planner, Grocery Budget Planner |
| Security & Privacy | Password Generator, Hash Generator |

Routes: `/`, `/student-tools`, `/student-tools/gpa-calculator`, and so on. Every tool has its own URL, breadcrumbs, "why useful", how-to steps and related tools.

## Commands
```
npm install
npm run dev       # local development
npm run build     # production build in dist/
npm run preview   # serve the build locally
```

## Adding a tool
1. Create `src/tools/<category>/MyTool.jsx` (default-export a component).
2. Import it in `src/data/registry.js` and add one entry (name, description, why, steps, keywords). Routes, search, category pages and related tools update automatically.

## Deploy
- **Netlify:** build command `npm run build`, publish directory `dist`. `public/_redirects` handles client-side routes.
- **Vercel:** framework preset Vite. `vercel.json` handles client-side routes.
- **GitHub Pages:** needs a `404.html` copy of `index.html` (or HashRouter) for deep links, and a `base` setting in `vite.config.js` if hosted under a sub-path.

## Privacy
All processing is local. Passwords use `crypto.getRandomValues`; hashes use `crypto.subtle` (needs HTTPS or localhost). Nothing is sent to a server or stored.

## Dependencies
| Library | Purpose | License |
|---|---|---|
| react, react-dom | UI | MIT |
| react-router-dom | Routing | MIT |
| qrcode | QR code generation (runs in the browser) | MIT |
| vite | Build tool | MIT |
| @vitejs/plugin-react | React support for Vite | MIT |

## License
MIT

## Productivity and shopping tools and data
Time zone tools use the browser's built-in Intl time-zone data and your device clock; nothing is fetched. Random tools use `crypto.getRandomValues`. Shopping calculators use only the numbers you enter (no live prices, tax rates or exchange rates). Planners, lists and budgets save to this browser's localStorage only. Calculation logic lives in `src/utils/` (`shop.js`, `time.js`, `random.js`, `calc.js`).

## Marketing tools and data
Marketing tools use local, rule-based logic. They never show search volume, rankings, keyword difficulty or live trends, because those need external data sources.
