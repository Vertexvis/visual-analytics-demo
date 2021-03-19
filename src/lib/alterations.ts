import { ColorMaterial, Scene } from '@vertexvis/viewer';
import { arrayChunked } from '@vertexvis/vertex-api-client';
import { BIData } from './business-intelligence';
import { SelectColor } from './colors';

const ChunkSize = 200;

export async function applyBIData(scene: Scene, biData: BIData): Promise<void> {
  // Clear all overrides and return on empty items
  if (biData.items.size === 0)
    return await scene
      .items((op) => [op.where((q) => q.all()).clearMaterialOverrides()])
      ?.execute();

  // Group alterations by color to reduce size of req/res
  const colorGroups = new Map<string, string[]>();
  [...biData.items.entries()].map(([itemId, bii]) => {
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

export async function selectBySuppliedId(
  scene: Scene,
  suppliedId: string,
  prevSuppliedId: string
): Promise<string> {
  if (suppliedId) {
    console.debug('Selected', suppliedId);

    await scene
      .items((op) => [
        ...(prevSuppliedId
          ? [op.where((q) => q.withSuppliedId(prevSuppliedId)).deselect()]
          : []),
        op.where((q) => q.withSuppliedId(suppliedId)).select(SelectColor),
      ])
      .execute();
    return suppliedId;
  } else if (prevSuppliedId) {
    await scene
      .items((op) =>
        op.where((q) => q.withSuppliedId(prevSuppliedId)).deselect()
      )
      .execute();
  }
  return '';
}

export async function applyOrClearBySuppliedId(
  scene: Scene,
  ids: string[],
  color: string,
  apply: boolean
): Promise<void> {
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

export async function clearAll(scene: Scene): Promise<void> {
  await scene
    .items((op) => [op.where((q) => q.all()).clearMaterialOverrides()])
    .execute();
}
