export default function toLocalPoint(
  coord: { clientX: number; clientY: number },
  targetOrClientRect: Element | Pick<ClientRect, 'left' | 'top'>
): WebKitPoint {
  const rect =
    'tagName' in targetOrClientRect
      ? targetOrClientRect.getBoundingClientRect()
      : targetOrClientRect;
  return {
    x: coord.clientX - rect.left,
    y: coord.clientY - rect.top,
  };
}
