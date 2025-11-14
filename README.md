# Frontend - How to Run

## Prerequisites
- Node.js 18+
- npm or yarn

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

   Frontend will be available at `http://localhost:3000` (or port shown in terminal)

## Run E2E Tests

1. **Install Playwright browsers:**
   ```bash
   npx playwright install
   ```

2. **Start backend and frontend servers, then run:**
   ```bash
   npm run test:e2e
   ```
