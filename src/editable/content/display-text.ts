const namedEntities: Record<string, string> = {
  amp: '&', apos: "'", gt: '>', hellip: '…', laquo: '“', ldquo: '“', lsquo: '‘',
  lt: '<', nbsp: ' ', quot: '"', raquo: '”', rdquo: '”', rsquo: '’',
}

function decodeEntity(entity: string, body: string) {
  if (body.startsWith('#x') || body.startsWith('#X')) {
    const codePoint = Number.parseInt(body.slice(2), 16)
    return Number.isFinite(codePoint) ? String.fromCodePoint(codePoint) : entity
  }
  if (body.startsWith('#')) {
    const codePoint = Number.parseInt(body.slice(1), 10)
    return Number.isFinite(codePoint) ? String.fromCodePoint(codePoint) : entity
  }
  return namedEntities[body.toLowerCase()] ?? entity
}

/** Converts feed-supplied HTML snippets into safe, readable text for UI labels and previews. */
export function cleanDisplayText(value: unknown) {
  if (typeof value !== 'string') return ''

  return value
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<\/?(?:p|div|section|article|header|footer|h[1-6]|li|ul|ol|blockquote|br|hr)\b[^>]*>/gi, ' ')
    .replace(/<[^>]*>/g, ' ')
    .replace(/<\/?[a-z][^>]*$/i, ' ')
    .replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, decodeEntity)
    .replace(/\s+/g, ' ')
    .trim()
}

export function getDisplayTitle(post?: { title?: string } | null) {
  return cleanDisplayText(post?.title) || 'Untitled'
}

export function truncateDisplayText(value: unknown, limit: number) {
  const clean = cleanDisplayText(value)
  if (clean.length <= limit) return clean

  const clipped = clean.slice(0, limit + 1)
  const wordBoundary = clipped.lastIndexOf(' ')
  const end = wordBoundary > Math.floor(limit * 0.65) ? wordBoundary : limit
  return `${clean.slice(0, end).trimEnd()}…`
}
