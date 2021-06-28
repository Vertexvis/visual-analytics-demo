import { calcRedToGreenGradient, randomColor } from "./colors";
import { FileData, FileItem } from "./files";

export interface AnalyticsData {
  isHeatMap: boolean;
  items: Map<string, AnalyticsItem>;
  min: number;
  max: number;
  name?: string;
  table: Map<string, TableItem>;
}

interface AnalyticsItem {
  color: string;
  value: number | string;
}

interface TableItem {
  count: number;
  color: string;
  display: boolean;
}

enum DataType {
  Unknown,
  HeatMapNumbers,
  HeatMapDates,
  Table,
  Colors,
}

export const DefaultAnalyticsData = {
  isHeatMap: false,
  items: new Map(),
  max: 100,
  min: 0,
  table: new Map(),
};

export function createAnalyticsData(data: FileData): AnalyticsData {
  if (data == null || data.items == null || data.items.length === 0) {
    return DefaultAnalyticsData;
  }

  const type = getDataType(data.items[0]);
  console.debug(`Based on first item, treating all data as ${DataType[type]}`);
  switch (type) {
    case DataType.HeatMapNumbers:
      return handleHeatMapNumbers(data.items, data.name);
    case DataType.HeatMapDates:
      return handleHeatMapDates();
    case DataType.Table:
      return handleTable(data.items, data.name);
    case DataType.Colors:
      return handleColors(data.items, data.name);
    default:
      return handleUnknown();
  }
}

function getDataType(item: FileItem): DataType {
  if (item.heatMapNumber) return DataType.HeatMapNumbers;
  if (item.heatMapDate) return DataType.HeatMapDates;
  if (item.tableValue) return DataType.Table;
  if (item.color) return DataType.Colors;
  return DataType.Unknown;
}

/**
 * Finds the minimum and maximum values to calculate a range. Uses this range
 * to calculate the color of the part on a red to green gradient.
 */
function handleHeatMapNumbers(items: FileItem[], name?: string): AnalyticsData {
  let min = Number.MAX_VALUE;
  let max = 0;
  const analyticsItems = new Map<string, AnalyticsItem>();
  const hmnItems = items
    .filter((i) => i.heatMapNumber)
    .map((i) => {
      const value = parseFloat(i.heatMapNumber ?? "");
      if (value < min) min = value;
      if (value > max) max = value;
      return {
        suppliedId: i.suppliedId,
        value: parseFloat(i.heatMapNumber ?? ""),
      };
    })
    .filter((i) => !isNaN(i.value));

  const range = max - min;
  hmnItems.forEach((i) =>
    analyticsItems.set(i.suppliedId, {
      color: calcRedToGreenGradient((i.value / range) * 100, true),
      value: i.value,
    })
  );

  return {
    ...DefaultAnalyticsData,
    isHeatMap: true,
    items: analyticsItems,
    max,
    min,
    name,
  };
}

function handleHeatMapDates(): AnalyticsData {
  console.error("Not implemented");
  return DefaultAnalyticsData;
}

/**
 * Finds unique occurrences of values in the column and displays the counts
 * in a table. When first encountering a new value, if there is a color in the
 * color column, use it. Otherwise, pick a random value.
 */
function handleTable(items: FileItem[], name?: string): AnalyticsData {
  const analyticsItems = new Map<string, AnalyticsItem>();
  const table = new Map<string, TableItem>();
  items
    .filter((i) => i.tableValue)
    .forEach((i) => {
      const value = i.tableValue ?? "";
      const existing = table.get(value);
      const color = existing
        ? existing.color
        : i.color
        ? i.color
        : randomColor();
      table.set(value, {
        count: (existing?.count ?? 0) + 1,
        color: color,
        display: true,
      });
      analyticsItems.set(i.suppliedId, { color, value });
    });

  return { ...DefaultAnalyticsData, items: analyticsItems, name, table };
}

/**
 * Color each part based on the value in the color column.
 */
function handleColors(items: FileItem[], name?: string): AnalyticsData {
  const analyticsItems = new Map<string, AnalyticsItem>();
  items
    .filter((i) => i.color)
    .forEach((i) => {
      const color = i.color ?? "";
      analyticsItems.set(i.suppliedId, { color, value: color });
    });

  return { ...DefaultAnalyticsData, items: analyticsItems, name: name };
}

function handleUnknown(): AnalyticsData {
  console.error("Invalid data");
  return DefaultAnalyticsData;
}
