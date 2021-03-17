import { BIData } from './business-intelligence';
import { ColorMaterial, Scene } from '@vertexvis/viewer';
import { arrayChunked } from '@vertexvis/vertex-api-client';

const ChunkSize = 200;

export async function applyBIData(biData: BIData, scene: Scene): Promise<void> {
  if (scene == null) {
    return;
  }

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

  console.log(colorGroups);

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
              .where((q) => q.withItemIds(c.itemIds))
              .materialOverride(ColorMaterial.fromHex(c.color));
          }),
        ])
        ?.execute()
    ),
  ]);
}
