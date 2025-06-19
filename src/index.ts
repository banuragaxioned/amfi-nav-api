import { Hono } from "hono";
import { NAVData, APIResponse, SchemeName } from "./types";
import { fetchNAVData, filterData, parseQueryParams } from "./utils";

const app = new Hono();

// Get all NAV data with optional filters
app.get("/api/nav", async (c) => {
  try {
    const filters = parseQueryParams(c);
    const data = await fetchNAVData();
    const filteredData = filterData(data, filters);

    const response: APIResponse<NAVData[]> = {
      success: true,
      count: filteredData.length,
      data: filteredData,
    };

    return c.json(response);
  } catch (error) {
    const response: APIResponse<never> = {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
    return c.json(response, 500);
  }
});

// Get NAV data by ISIN
app.get("/api/nav/:isin", async (c) => {
  try {
    const isin = c.req.param("isin");
    if (!isin) {
      return c.json(
        {
          success: false,
          error: "ISIN parameter is required",
        },
        400
      );
    }

    const data = await fetchNAVData();
    const result = data.find((item) => item.isinDivPayoutOrGrowth === isin || item.isinDivReinvestment === isin);

    if (!result) {
      return c.json(
        {
          success: false,
          error: "ISIN not found",
        },
        404
      );
    }

    const response: APIResponse<NAVData> = {
      success: true,
      count: 1,
      data: result,
    };

    return c.json(response);
  } catch (error) {
    const response: APIResponse<never> = {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
    return c.json(response, 500);
  }
});

// Get all scheme names
app.get("/api/names", async (c) => {
  try {
    const filters = parseQueryParams(c);
    const data = await fetchNAVData();
    const filteredData = filterData(data, filters);

    const names: SchemeName[] = filteredData.map((item) => ({
      schemeCode: item.schemeCode,
      schemeName: item.schemeName,
      isinDivPayoutOrGrowth: item.isinDivPayoutOrGrowth,
      isinDivReinvestment: item.isinDivReinvestment,
    }));

    const response: APIResponse<SchemeName[]> = {
      success: true,
      count: names.length,
      data: names,
    };

    return c.json(response);
  } catch (error) {
    const response: APIResponse<never> = {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
    return c.json(response, 500);
  }
});

// Health check endpoint
app.get("/", (c) => {
  return c.json({
    message: "AMFI NAV API",
    version: "1.0.0",
    endpoints: {
      getAll: "/api/nav",
      getById: "/api/nav/:isin",
      getAllNames: "/api/names",
    },
    filters: {
      id: "?id=ISIN1,ISIN2,ISIN3 (comma-separated)",
      type: "?type=direct|regular",
      date: "?date=DD-MMM-YYYY",
    },
  });
});

export default app;
