/** Legacy links such as `/budget/` and `/government/#lgus` drop the slash before the route. */
export function appPath(href: string) {
  const [path = '', hash] = href.split('#')
  const clean = path.length > 1 ? path.replace(/\/$/, '') : path
  return hash ? `${clean}#${hash}` : clean
}
