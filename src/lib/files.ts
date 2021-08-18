import { parse } from "papaparse";

export interface FileItem {
  suppliedId: string;
  heatMapNumber?: string;
  heatMapDate?: string;
  tableValue?: string;
  color?: string;
}

export interface FileData {
  items: FileItem[];
  name?: string;
}

const DefaultFileData = {
  items: [],
  name: undefined,
};

export function handleCsvUpload(
  fileName: Blob & { name: string }
): Promise<FileData> {
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = () => {
      const text = reader.result;
      if (typeof text !== "string") {
        console.warn("Invalid CSV file");
        return resolve(DefaultFileData);
      }

      resolve(parseCsv(fileName.name, text));
    };

    reader.readAsText(fileName);
  });
}

export function parseCsv(name: string, text: string): FileData {
  const csv = parse<FileItem>(text, { header: true });
  if (csv.errors?.length > 0) {
    console.warn("Invalid CSV file", csv.errors);
    return DefaultFileData;
  }
  return { name, items: csv.data };
}
