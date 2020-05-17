export const colorTone = (color: string, delta: number) => {
  const usePound = color[0] === '#';

  if (usePound) {
    color = color.slice(1);
  }

  var num = parseInt(color, 16);

  var r = (num >> 16) + delta;

  if (r > 255) r = 255;
  else if (r < 0) r = 0;

  var b = ((num >> 8) & 0x00ff) + delta;

  if (b > 255) b = 255;
  else if (b < 0) b = 0;

  var g = (num & 0x0000ff) + delta;

  if (g > 255) g = 255;
  else if (g < 0) g = 0;

  return (usePound ? '#' : '') + (g | (b << 8) | (r << 16)).toString(16);
};
