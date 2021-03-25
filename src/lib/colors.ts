import { ColorMaterial } from '@vertexvis/viewer';

const Gray = '#6B7280';
const Red = '#EF4444';
const Amber = '#F59E0B';
const Emerald = '#10B981';
const Blue = '#3B82F6';
const Indigo = '#6366F1';
const Violet = '#8B5CF6';
const Pink = '#EC4899';

export const DefaultColors = [
  Gray,
  Red,
  Amber,
  Emerald,
  Blue,
  Indigo,
  Violet,
  Pink,
];

export const SelectColor = {
  ...ColorMaterial.create(255, 255, 0),
  glossiness: 4,
  specular: { r: 255, g: 255, b: 255, a: 0 },
};

export function calcRedToGreenGradient(
  percent: number,
  invert = false
): string {
  const p = Math.max(invert ? 100 - percent : percent, 0);
  const color = {
    r: p < 50 ? 255 : Math.round(256 - (p - 50) * 5.12),
    g: p > 50 ? 255 : Math.round(p * 5.12),
    b: 0,
  };
  return rgbToHex(color);
}

export function randomColor(): string {
  return DefaultColors[Math.floor(Math.random() * DefaultColors.length)];
}

function rgbToHex({ r, g, b }: { r: number; g: number; b: number }): string {
  return (
    '#' +
    [r, g, b]
      .map((c) => {
        const hex = Math.min(255, c).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
      })
      .join('')
  );
}
