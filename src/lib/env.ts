import { Environment } from "@vertexvis/viewer";

export const DefaultClientId =
  "08F675C4AACE8C0214362DB5EFD4FACAFA556D463ECA00877CB225157EF58BFA";

// Super Car
export const DefaultStreamKey = "RA00uJtbA41VR9NmZvHnXSW4H8viv9AI5Vbx";

export const Env =
  (process.env.NEXT_PUBLIC_VERTEX_ENV as Environment) || "platprod";
