## Working with Cloudflare Pages

After installing Wrangler and being logged in, run the following command to access the latest N deployments
of a specific Cloudflare Pages project:

```

wrangler pages deployment list --project-name demo-login-system-frontend --json | jq '.[0:1]'

```

With that command, I get all the info about the latest deployment of the Cloudflare Pages project named `demo-login-system-frontend`. Make sure you also have `jq` installed.

## Front-end Authentication

```

===========================================================================
AUTHENTICATION FLOW
===========================================================================

SIGNUP

---

User fills form → POST /auth/signup → redirect to /login

LOGIN

---

User fills form → POST /auth/login → save JWT to localStorage
→ authenticated = true
→ redirect to /me

LOGOUT

---

User clicks logout → remove JWT from localStorage
→ authenticated = false
→ redirect to /login

ROUTE PROTECTION

---

/me, /me/edit (protected)
┌─────────────────────────────────────────────────────┐
│ ProtectedRoute │
│ authenticated? ──── yes ──→ render page │
│ └─── no ──→ redirect to /login │
└─────────────────────────────────────────────────────┘

/login, /signup (public only)
┌─────────────────────────────────────────────────────┐
│ PublicOnlyRoute │
│ authenticated? ──── yes ──→ redirect to /me │
│ └─── no ──→ render page │
└─────────────────────────────────────────────────────┘

TOKEN VALIDATION (on every route change)

---

┌─────────────────────────────────────────────────────┐
│ AuthGuard │
│ token expired? ──── yes ──→ logout() │
│ → redirect to /login │
│ └─── no ──→ do nothing │
└─────────────────────────────────────────────────────┘

GLOBAL STATE (AuthContext)

---

AuthProvider (wraps entire app)
│
├── authenticated: boolean
├── login(token) → save token to localStorage
│ → authenticated = true
└── logout() → remove token from localStorage
→ authenticated = false

===========================================================================

```

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is enabled on this template. See [this documentation](https://react.dev/learn/react-compiler) for more information.

Note: This will impact Vite dev & build performances.

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
