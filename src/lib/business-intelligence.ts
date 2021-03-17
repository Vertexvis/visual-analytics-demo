import { calcRedToGreenGradient, randomColor } from './colors';
import { FileData, FileItem } from './file-upload';

export interface BIItem {
  color: string;
  value: number | string;
}

export interface TableItem {
  count: number;
  color: string;
  display: boolean;
}

export interface BIData {
  isHeatMap: boolean;
  items: Map<string, BIItem>;
  min: number;
  max: number;
  name?: string;
  table: Map<string, TableItem>;
}

enum DataType {
  Unknown,
  HeatMapNumbers,
  HeatMapDates,
  Table,
  Colors,
}

export const DefaultBIData = {
  isHeatMap: false,
  items: new Map(),
  max: 100,
  min: 0,
  table: new Map(),
};

export function createBIData(data: FileData): BIData {
  if (data == null || data.items == null || data.items.length === 0) {
    return DefaultBIData;
  }

  const type = getDataType(data.items[0]);
  console.log(`Based on first item, treating all data as ${DataType[type]}`);
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
function handleHeatMapNumbers(items: FileItem[], name?: string): BIData {
  let min = Number.MAX_VALUE;
  let max = 0;
  const biItems = new Map<string, BIItem>();
  const hmnItems = items
    .filter((i) => i.heatMapNumber)
    .map((i) => {
      const value = parseFloat(i.heatMapNumber ?? '');
      if (value < min) min = value;
      if (value > max) max = value;
      return {
        suppliedId: i.suppliedId,
        value: parseFloat(i.heatMapNumber ?? ''),
      };
    })
    .filter((i) => !isNaN(i.value));

  const range = max - min;
  hmnItems.forEach((i) =>
    biItems.set(i.suppliedId, {
      color: calcRedToGreenGradient((i.value / range) * 100, true),
      value: i.value,
    })
  );

  return { ...DefaultBIData, isHeatMap: true, items: biItems, max, min, name };
}

function handleHeatMapDates(): BIData {
  console.error('Not implemented');
  return DefaultBIData;
}

/**
 * Finds unique occurrences of values in the column and displays the counts
 * in a table. When first encountering a new value, if there is a color in the
 * color column, use it. Otherwise, pick a random value.
 */
function handleTable(items: FileItem[], name?: string): BIData {
  const biItems = new Map<string, BIItem>();
  const table = new Map<string, TableItem>();
  items
    .filter((i) => i.tableValue)
    .forEach((i) => {
      const value = i.tableValue ?? '';
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
      biItems.set(i.suppliedId, { color, value });
    });

  return { ...DefaultBIData, items: biItems, name, table };
}

/**
 * Color each part based on the value in the color column.
 */
function handleColors(items: FileItem[], name?: string): BIData {
  const biItems = new Map<string, BIItem>();
  items
    .filter((i) => i.color)
    .forEach((i) => {
      const color = i.color ?? '';
      biItems.set(i.suppliedId, { color, value: color });
    });

  return { ...DefaultBIData, items: biItems, name: name };
}

function handleUnknown(): BIData {
  console.error('Invalid data');
  return DefaultBIData;
}
