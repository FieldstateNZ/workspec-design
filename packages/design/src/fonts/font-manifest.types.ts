/**
 * One self-hosted font file: a single family/weight/style/subset combination,
 * matching one `.woff2` under `fonts/` and one `@font-face` rule in the
 * generated `fonts.css`.
 */
export interface FontManifestEntry {
  readonly family: string;
  readonly weight: number;
  readonly style: string;
  readonly subset: string;
  /** File name under `fonts/`, e.g. `inter-tight-400-normal-latin.woff2`. */
  readonly file: string;
  /** The `fonts.gstatic.com` URL this file was downloaded from, verbatim. */
  readonly source: string;
  readonly unicodeRange: string;
}
