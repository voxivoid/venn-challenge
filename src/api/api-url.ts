import { API_BASE_URL } from "./config";

/** Names of the `:param` segments in a path, e.g. `"/a/:id/b/:slug"` -> `"id" | "slug"`. */
export type PathParamNames<Path extends string> =
  Path extends `${string}:${infer Name}/${infer Rest}`
    ? Name | PathParamNames<`/${Rest}`>
    : Path extends `${string}:${infer Name}`
      ? Name
      : never;

/**
 * Absolute API URL for `path`, with each `:param` replaced by its encoded value.
 * Without `params` the placeholders stay, which is the pattern MSW handlers match.
 */
export function apiUrl<Path extends string>(
  path: Path,
  params?: Record<PathParamNames<Path>, string>,
): string {
  const resolved = params
    ? path.replace(/:(\w+)/g, (_, name: PathParamNames<Path>) =>
        encodeURIComponent(params[name]),
      )
    : path;
  return `${API_BASE_URL}${resolved}`;
}
