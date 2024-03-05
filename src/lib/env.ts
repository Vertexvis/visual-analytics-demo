import { Environment } from "@vertexvis/viewer";

export interface StreamCredentials {
  readonly clientId: string;
  readonly streamKey: string;
}

// Super Car
export const DefaultCredentials: StreamCredentials = {
  clientId: "08F675C4AACE8C0214362DB5EFD4FACAFA556D463ECA00877CB225157EF58BFA",
  streamKey: "xwa3EgD3xfeETw164U9XmxopKZ0c8n1gt93j",
};

export const Env =
  (process.env.NEXT_PUBLIC_VERTEX_ENV as Environment) || "platprod";

export const SampleDataPaths: { [k: string]: string } = {
  [DefaultCredentials.streamKey]: "/super-car-data.zip",
  "AH7v0jg5aN5_thkhU-XTzB_29aqW89EjyOH8": "/vertex-valve-data.zip",
};

export function head<T>(items?: T | T[]): T | undefined {
  return items ? (Array.isArray(items) ? items[0] : items) : undefined;
}
