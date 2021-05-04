import { Environment } from "@vertexvis/viewer";

export const DefaultClientId =
  "08F675C4AACE8C0214362DB5EFD4FACAFA556D463ECA00877CB225157EF58BFA";

// Super Car
export const DefaultStreamKey = "RA00uJtbA41VR9NmZvHnXSW4H8viv9AI5Vbx";

export const Env =
  (process.env.NEXT_PUBLIC_VERTEX_ENV as Environment) || "platprod";

export const SampleDataPaths: { [k: string]: string } = {
  [DefaultStreamKey]: "/super-car-data.zip",
  "U9cSWVb7fvS9k-NQcT28uZG6wtm6xmiG0ctU": "/vertex-valve-data.zip",
};
