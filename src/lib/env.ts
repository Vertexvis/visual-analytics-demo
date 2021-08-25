import { Environment } from "@vertexvis/viewer";

export interface StreamCredentials {
  readonly clientId: string;
  readonly streamKey: string;
}

// Super Car
export const DefaultCredentials: StreamCredentials = {
  clientId: "08F675C4AACE8C0214362DB5EFD4FACAFA556D463ECA00877CB225157EF58BFA",
  streamKey: "wx8Gz7-zH2aIGruA1tSBwyApPvfy9yrmpFKN",
};

export const Env =
  (process.env.NEXT_PUBLIC_VERTEX_ENV as Environment) || "platprod";

export const SampleDataPaths: { [k: string]: string } = {
  [DefaultCredentials.streamKey]: "/super-car-data.zip",
  Eh96kzXEppNfcxj5gbbqdJ9oUdQPB7hXzHrU: "/vertex-valve-data.zip",
};

export function head<T>(items?: T | T[]): T | undefined {
  return items ? (Array.isArray(items) ? items[0] : items) : undefined;
}
