import { z } from "zod";
import { NAVDataSchema, NAVData, FilterOptions } from "./types";

/**
 * Utility function to fetch and parse AMFI NAV data
 * @returns {Promise<NAVData[]>} A promise that resolves to an array of NAV data
 */
export async function fetchNAVData(): Promise<NAVData[]> {
  try {
    const response = await fetch("https://www.amfiindia.com/spages/NAVAll.txt");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const text = await response.text();
    const lines = text.split("\n");
    const navData: NAVData[] = [];

    for (const line of lines) {
      const trimmedLine = line.trim();
      if (!trimmedLine || !trimmedLine.includes(";")) continue;

      const parts = trimmedLine.split(";");
      if (parts.length >= 6) {
        const data = {
          schemeCode: parts[0],
          isinDivPayoutOrGrowth: parts[1],
          isinDivReinvestment: parts[2],
          schemeName: parts[3],
          netAssetValue: parts[4],
          date: parts[5],
        };

        // Validate with Zod
        const validated = NAVDataSchema.safeParse(data);
        if (validated.success) {
          navData.push(validated.data);
        }
      }
    }

    return navData;
  } catch (error) {
    console.error("Error fetching NAV data:", error);
    throw new Error("Failed to fetch NAV data");
  }
}

/**
 * Utility function to filter data
 * @param {NAVData[]} data - The array of NAV data to filter
 * @param {FilterOptions} filters - The filters to apply
 * @returns {NAVData[]} The filtered array of NAV data
 */
export function filterData(data: NAVData[], filters: FilterOptions): NAVData[] {
  return data.filter((item) => {
    // Filter by ISIN
    if (filters.id && filters.id.length > 0) {
      const hasMatchingId = filters.id.some(
        (id) => item.isinDivPayoutOrGrowth.includes(id) || item.isinDivReinvestment.includes(id)
      );
      if (!hasMatchingId) return false;
    }

    // Filter by type
    if (filters.type) {
      const schemeName = item.schemeName.toLowerCase();
      const isDirect = schemeName.includes("direct");
      const isRegular = schemeName.includes("regular");

      if (filters.type === "direct" && !isDirect) return false;
      if (filters.type === "regular" && !isRegular) return false;
    }

    // Filter by date
    if (filters.date && item.date !== filters.date) return false;

    return true;
  });
}

/**
 * Utility function to parse query parameters
 * @param {Context} c - The Hono context
 * @returns {FilterOptions} The parsed filters
 */
export function parseQueryParams(c: any): FilterOptions {
  const idParam = c.req.query("id");
  const type = c.req.query("type");
  const date = c.req.query("date");

  const filters: FilterOptions = {};

  if (idParam) {
    filters.id = idParam.split(",").map((id: string) => id.trim());
  }

  if (type) {
    const validated = z.enum(["direct", "regular"]).safeParse(type);
    if (validated.success) {
      filters.type = validated.data;
    }
  }

  if (date) {
    filters.date = date;
  }

  return filters;
}
