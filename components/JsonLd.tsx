/**
 * Injects JSON-LD structured data into the page <head>/body.
 * Using a <script type="application/ld+json"> with dangerouslySetInnerHTML is the
 * standard, supported pattern. Data is generated server-side from lib/schema.ts.
 */
export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  return (
    <script
      type="application/ld+json"
      // JSON.stringify output is trusted (built from our own typed data, never user input).
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  );
}
