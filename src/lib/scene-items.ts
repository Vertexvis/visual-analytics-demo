import { ColorMaterial, Components } from "@vertexvis/viewer";
import { arrayChunked } from "@vertexvis/vertex-api-client";
import { BIData } from "./business-intelligence";
import { SelectColor } from "./colors";
import { vertexvis } from "@vertexvis/frame-streaming-protos";

const ChunkSize = 200;

interface Req {
  readonly viewer: Components.VertexViewer | null;
}

interface SelectByHitReq extends Req {
  readonly hit?: vertexvis.protobuf.stream.IHit;
}

export async function applyBIData({
  biData,
  viewer,
}: Req & {
  readonly biData: BIData;
}): Promise<void> {
  if (viewer == null) return;

  const scene = await viewer.scene();
  if (scene == null) return;

  // Clear all overrides and return on empty items
  if (biData.items.size === 0) {
    return await scene
      .items((op) => [op.where((q) => q.all()).clearMaterialOverrides()])
      ?.execute();
  }

  // Group alterations by color to reduce size of req/res
  const colorGroups = new Map<string, string[]>();
  [...biData.items.entries()].forEach(([itemId, bii]) => {
    colorGroups.set(bii.color, [...(colorGroups.get(bii.color) ?? []), itemId]);
  });

  // Split into arrays of length `ChunkSize` to keep req/res sizes reasonable
  const chunks = arrayChunked(
    [...colorGroups.entries()].map(([color, itemIds]) => ({
      color,
      itemIds,
    })),
    ChunkSize
  );

  // Await all alterations
  await Promise.all([
    chunks.map((chunk, i) =>
      scene
        .items((op) => [
          // Append a `clearMaterialOverrides` to the first chunk
          ...(i === 0
            ? [op.where((q) => q.all()).clearMaterialOverrides()]
            : []),
          ...chunk.map((c) => {
            return op
              .where((q) => q.withSuppliedIds(c.itemIds))
              .materialOverride(ColorMaterial.fromHex(c.color));
          }),
        ])
        ?.execute()
    ),
  ]);
}

export async function selectByHit({
  hit,
  viewer,
}: SelectByHitReq): Promise<void> {
  if (viewer == null) return;

  const scene = await viewer.scene();
  if (scene == null) return;

  const id = hit?.itemId?.hex;
  const suppliedId = hit?.itemSuppliedId?.value;
  if (id) {
    console.debug(`Selected ${id}${suppliedId ? `, ${suppliedId}` : ""}`);

    await scene
      .items((op) => [
        op.where((q) => q.all()).deselect(),
        op.where((q) => q.withItemId(id)).select(SelectColor),
      ])
      .execute();
  } else {
    await scene.items((op) => op.where((q) => q.all()).deselect()).execute();
  }
}

export async function applyOrClearBySuppliedId({
  apply,
  color,
  ids,
  viewer,
}: Req & {
  readonly apply: boolean;
  readonly color: string;
  readonly ids: string[];
}): Promise<void> {
  if (viewer == null) return;

  const scene = await viewer.scene();
  if (scene == null) return;

  await scene
    .items((op) => {
      const w = op.where((q) => q.withSuppliedIds(ids));
      return [
        apply
          ? w.materialOverride(ColorMaterial.fromHex(color))
          : w.clearMaterialOverrides(),
      ];
    })
    .execute();
}

export async function clearAll({ viewer }: Req): Promise<void> {
  if (viewer == null) return;

  const scene = await viewer.scene();
  if (scene == null) return;

  await scene
    .items((op) => [op.where((q) => q.all()).clearMaterialOverrides()])
    .execute();
}