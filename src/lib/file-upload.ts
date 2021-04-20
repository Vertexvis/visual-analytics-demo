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

      const csv = parse<FileItem>(text, { header: true });
      if (csv.errors?.length > 0) {
        console.warn("Invalid CSV file", csv.errors);
        return resolve(DefaultFileData);
      }

      resolve({
        name: fileName.name,
        items: csv.data,
      });
    };

    reader.readAsText(fileName);
  });
}
