import { z } from "zod";

export const NAVDataSchema = z.object({
  schemeCode: z.string(),
  isinDivPayoutOrGrowth: z.string(),
  isinDivReinvestment: z.string(),
  schemeName: z.string(),
  netAssetValue: z.string(),
  date: z.string(),
});

export const FilterOptionsSchema = z.object({
  id: z.array(z.string()).optional(),
  type: z.enum(["direct", "regular"]).optional(),
  date: z.string().optional(),
});

export type NAVData = z.infer<typeof NAVDataSchema>;
export type FilterOptions = z.infer<typeof FilterOptionsSchema>;

export type APIResponse<T> =
  | {
      success: true;
      count: number;
      data: T;
    }
  | {
      success: false;
      error: string;
    };

export type SchemeName = {
  schemeCode: string;
  schemeName: string;
  isinDivPayoutOrGrowth: string;
  isinDivReinvestment: string;
};
