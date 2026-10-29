/** Drop @context so a node can sit inside an existing @graph. */
export function omitSchemaContext<T extends { "@context": string }>(data: T): Omit<T, "@context"> {
  const { "@context": _context, ...node } = data
  return node
}
