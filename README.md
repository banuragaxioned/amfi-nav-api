# AMFI NAV API

A Cloudflare Workers API that fetches and parses NAV (Net Asset Value) data from AMFI India. Built with TypeScript, Hono, and Zod for runtime validation.

## Features

- **Runtime Validation**: Uses Zod for data validation and type safety
- **TypeScript**: Full type safety with inferred types from Zod schemas
- **Clean Architecture**: Separated concerns with utility functions and type definitions
- **Comprehensive Filtering**: Support for multiple ISIN codes, scheme types, and dates
- **Error Handling**: Proper HTTP status codes and error responses

## Project Structure

```
src/
├── index.ts      # Main API routes
├── types.ts      # Zod schemas and TypeScript types
└── utils.ts      # Utility functions for data fetching and filtering
```

## Endpoints

### Get All NAV Data
```
GET /api/nav
```

**Query Parameters:**
- `id` - Filter by ISIN codes (comma-separated, partial match)
- `type` - Filter by type: `direct` or `regular`
- `date` - Filter by date (format: DD-MMM-YYYY)

**Examples:**
```
GET /api/nav?type=direct&date=19-Jun-2025
GET /api/nav?id=INF209,INF846
GET /api/nav?id=INF209KA12Z1,INF846K01NF8&type=direct
```

### Get NAV Data by ISIN
```
GET /api/nav/:isin
```

**Example:**
```
GET /api/nav/INF209KA12Z1
```

### Get All Scheme Names
```
GET /api/names
```

**Query Parameters:**
- `id` - Filter by ISIN codes (comma-separated, partial match)
- `type` - Filter by type: `direct` or `regular`
- `date` - Filter by date (format: DD-MMM-YYYY)

**Examples:**
```
GET /api/names?type=regular
GET /api/names?id=INF209,INF846&type=direct
```

## Response Format

All endpoints return JSON responses with the following structure:

```json
{
  "success": true,
  "count": 10,
  "data": [
    {
      "schemeCode": "119551",
      "isinDivPayoutOrGrowth": "INF209KA12Z1",
      "isinDivReinvestment": "INF209KA13Z9",
      "schemeName": "Aditya Birla Sun Life Banking & PSU Debt Fund - DIRECT - IDCW",
      "netAssetValue": "107.4465",
      "date": "19-Jun-2025"
    }
  ]
}
```

## Development

```bash
# Install dependencies
pnpm install

# Run development server
pnpm run dev

# Deploy to Cloudflare Workers
pnpm run deploy
```

## Data Source

This API fetches data from [AMFI India's NAV text file](https://www.amfiindia.com/spages/NAVAll.txt).

## Technologies Used

- **Hono**: Fast web framework for Cloudflare Workers
- **Zod**: TypeScript-first schema validation
- **TypeScript**: Type-safe development
- **Cloudflare Workers**: Edge computing platform
