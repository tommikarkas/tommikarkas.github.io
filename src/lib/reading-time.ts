// Mirrors the design system's Jekyll formula (words ÷ 220, +1) from shipping.md.
export function readingTimeMinutes(body: string | undefined): number {
	const words = (body ?? '').trim().split(/\s+/).filter(Boolean).length;
	return Math.floor(words / 220) + 1;
}
