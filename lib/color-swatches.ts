export type SwatchStyle = {
  background: string;
  border?: string;
  accent?: string;
};

const colorSwatches: Record<string, SwatchStyle> = {
  jaune: { background: 'linear-gradient(135deg, #F7D84C 0%, #DFAE00 100%)', border: '#D3A800', accent: '#6A5200' },
  rouge: { background: 'linear-gradient(135deg, #F26A6A 0%, #C62828 100%)', border: '#B91C1C' },
  gris: { background: 'linear-gradient(135deg, #D7D9DE 0%, #7E8693 100%)', border: '#7E8693' },
  gray: { background: 'linear-gradient(135deg, #D7D9DE 0%, #7E8693 100%)', border: '#7E8693' },
  grey: { background: 'linear-gradient(135deg, #D7D9DE 0%, #7E8693 100%)', border: '#7E8693' },
  blanc: { background: 'linear-gradient(135deg, #FFFFFF 0%, #F0EADF 100%)', border: '#CBB89E', accent: '#8B6B4F' },
  blanche: { background: 'linear-gradient(135deg, #FFFFFF 0%, #F0EADF 100%)', border: '#CBB89E', accent: '#8B6B4F' },
  'blanc casse': { background: 'linear-gradient(135deg, #FBF7F0 0%, #E7D8C6 100%)', border: '#D7BE9A', accent: '#8B6B4F' },
  noir: { background: 'linear-gradient(135deg, #4B4B4B 0%, #151515 100%)', border: '#1D1D1D' },
  bleu: { background: 'linear-gradient(135deg, #7BAAF7 0%, #1E5FD7 100%)', border: '#1E5FD7' },
  'bleu marine': { background: 'linear-gradient(135deg, #6A82C7 0%, #122B5C 100%)', border: '#122B5C' },
  'bleu royal': { background: 'linear-gradient(135deg, #79A8FF 0%, #1F53D1 100%)', border: '#1F53D1' },
  vert: { background: 'linear-gradient(135deg, #8FD3A8 0%, #2F8F57 100%)', border: '#2F8F57' },
  verte: { background: 'linear-gradient(135deg, #8FD3A8 0%, #2F8F57 100%)', border: '#2F8F57' },
  beige: { background: 'linear-gradient(135deg, #F1E3CC 0%, #C9AC84 100%)', border: '#B08C5A' },
  marron: { background: 'linear-gradient(135deg, #BA8B64 0%, #6F482F 100%)', border: '#6F482F' },
  bordeaux: { background: 'linear-gradient(135deg, #D97A89 0%, #7A1730 100%)', border: '#7A1730' },
  orange: { background: 'linear-gradient(135deg, #F8C57A 0%, #ED7A24 100%)', border: '#ED7A24' },
  rose: { background: 'linear-gradient(135deg, #FFB8CF 0%, #E75B8B 100%)', border: '#E75B8B' },
  'rose fuchsia': { background: 'linear-gradient(135deg, #FF96C8 0%, #D93BAA 100%)', border: '#D93BAA' },
  mauve: { background: 'linear-gradient(135deg, #D3A7F2 0%, #8B4FD6 100%)', border: '#8B4FD6' },
  'mauve clair': { background: 'linear-gradient(135deg, #E3D0FA 0%, #B78BE9 100%)', border: '#B78BE9' },
  'bleu clair': { background: 'linear-gradient(135deg, #B8D7FF 0%, #6EA5F2 100%)', border: '#6EA5F2' },
  'أصفر': { background: 'linear-gradient(135deg, #F7D84C 0%, #DFAE00 100%)', border: '#D3A800', accent: '#6A5200' },
  'أحمر': { background: 'linear-gradient(135deg, #F26A6A 0%, #C62828 100%)', border: '#B91C1C' },
  'رمادي': { background: 'linear-gradient(135deg, #D7D9DE 0%, #7E8693 100%)', border: '#7E8693' },
  'أبيض': { background: 'linear-gradient(135deg, #FFFFFF 0%, #F0EADF 100%)', border: '#CBB89E', accent: '#8B6B4F' },
  'أسود': { background: 'linear-gradient(135deg, #4B4B4B 0%, #151515 100%)', border: '#1D1D1D' },
  'أزرق': { background: 'linear-gradient(135deg, #7BAAF7 0%, #1E5FD7 100%)', border: '#1E5FD7' },
  'أخضر': { background: 'linear-gradient(135deg, #8FD3A8 0%, #2F8F57 100%)', border: '#2F8F57' },
  'بيج': { background: 'linear-gradient(135deg, #F1E3CC 0%, #C9AC84 100%)', border: '#B08C5A' },
  'بني': { background: 'linear-gradient(135deg, #BA8B64 0%, #6F482F 100%)', border: '#6F482F' },
  'وردي': { background: 'linear-gradient(135deg, #FFB8CF 0%, #E75B8B 100%)', border: '#E75B8B' },
  'بنفسجي': { background: 'linear-gradient(135deg, #D3A7F2 0%, #8B4FD6 100%)', border: '#8B4FD6' },
  'برتقالي': { background: 'linear-gradient(135deg, #F8C57A 0%, #ED7A24 100%)', border: '#ED7A24' },
  'ذهبي': { background: 'linear-gradient(135deg, #F7D84C 0%, #C98A1A 100%)', border: '#C98A1A' },
  'فضي': { background: 'linear-gradient(135deg, #F0F2F4 0%, #8F99A5 100%)', border: '#8F99A5' },
};

export function normalizeColorKey(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

export function getColorSwatchStyle(color: string): SwatchStyle {
  return colorSwatches[normalizeColorKey(color)] ?? {
    background: 'linear-gradient(135deg, #F2E7D8 0%, #B38A5D 100%)',
    border: '#B38A5D',
    accent: '#4A3024',
  };
}

export function isLightColor(color: string): boolean {
  const normalizedColor = normalizeColorKey(color);
  return [
    'blanc',
    'blanche',
    'beige',
    'blanc casse',
    'off white',
    'ivory',
    'argent',
    'silver',
    'gris',
    'gray',
    'grey',
  ].includes(normalizedColor);
}
