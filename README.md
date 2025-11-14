# Frontend - How to Run

## Prerequisites
- Node.js 18+
- npm or yarn

## Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure API URL (if needed)
The frontend connects to backend at `http://localhost:8000` by default.

To change API URL, create `.env` file:
```bash
VITE_API_URL=http://localhost:8000
```

## Run Commands

### Start Development Server
```bash
npm run dev
```

**Frontend will be available at:** `http://localhost:3000` (or port shown in terminal)

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Run E2E Tests

#### 1. Install Playwright Browsers (First time only)
```bash
npx playwright install
```

#### 2. Start Backend Server (in separate terminal)
```bash
cd ../backend
venv\Scripts\activate
uvicorn app.main:app --reload --port 8000
```

#### 3. Start Frontend Server (in separate terminal)
```bash
npm run dev
```

#### 4. Run E2E Tests
```bash
npm run test:e2e
```
or
```bash
npm test
```

### Run Specific E2E Test
```bash
# Test authentication
npx playwright test e2e/auth.spec.js

# Test search
npx playwright test e2e/search.spec.js

# Test image generation
npx playwright test e2e/image.spec.js

# Test dashboard
npx playwright test e2e/dashboard.spec.js
```

### Run E2E Tests in UI Mode
```bash
npx playwright test --ui
```

### Run E2E Tests in Headed Mode (see browser)
```bash
npx playwright test --headed
```

### Run E2E Tests for Specific Browser
```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

## Important Notes

1. **Backend server must be running** for frontend to work properly

2. **For E2E tests**, both backend and frontend servers must be running

3. **Production build** creates files in `dist/` folder

4. **API URL** can be configured via environment variable `VITE_API_URL`

5. **Run commands from `frontend` directory**:
   ```bash
   cd frontend
   ```

## Quick Start (Complete Setup)

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Open browser to http://localhost:3000
```
