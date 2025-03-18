export function getVideoOrientation(width, height) {
    const ratio = width / height;

    if (ratio >= 1.7) return 'horizontal-wide';
    if (ratio >= 1.3) return 'horizontal-medium';
    if (ratio >= 0.8) return 'square';
    if (ratio >= 0.6) return 'vertical-medium';
    return 'vertical-wide';
}
