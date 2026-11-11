// Turns the owner's own contacts and project sites in a chat answer into links. Only these known
// targets become clickable: anything else the model writes, such as a URL a visitor talked it
// into, stays plain text, so the chat can never show a clickable phishing link.

export type Segment = { text: string; href?: string };

export type LinkTarget = { text: string; href: string };

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\/]/g, "\\$&");

/**
 * Builds the matcher once. Longer targets go first, so "admin.hibro.am" wins over "hibro.am";
 * the lookarounds stop a target from matching inside a longer word or address.
 */
export function createLinkifier(targets: LinkTarget[]) {
  const byText = new Map(targets.map((t) => [t.text.toLowerCase(), t.href]));
  const alternatives = [...byText.keys()].sort((a, b) => b.length - a.length).map(escape);
  const pattern = new RegExp(`(?<![\\w.@/-])(?:https?:\\/\\/)?(${alternatives.join("|")})(?![\\w-]|\\.\\w)`, "gi");

  return function linkify(text: string): Segment[] {
    const segments: Segment[] = [];
    let last = 0;
    for (const match of text.matchAll(pattern)) {
      const start = match.index ?? 0;
      if (start > last) segments.push({ text: text.slice(last, start) });
      segments.push({ text: match[0], href: byText.get(match[1].toLowerCase()) });
      last = start + match[0].length;
    }
    if (last < text.length) segments.push({ text: text.slice(last) });
    return segments;
  };
}
