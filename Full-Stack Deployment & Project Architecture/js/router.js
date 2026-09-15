export function getRoute() {
  const [path = '/', query = ''] = (location.hash.slice(1) || '/').split('?');
  return { path, params: new URLSearchParams(query) };
}
export function navigate(path) { location.hash = path; }
