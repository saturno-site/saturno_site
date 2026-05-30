/**
 * Minimal type declarations for `flubber` (v0.4).
 *
 * The library is untyped; this provides the subset of the API consumed
 * by the Saturno morphing hooks.
 */
declare module "flubber" {
  /**
   * Returns an interpolation function that morphs `fromPath` into `toPath`.
   *
   * @param fromPath - Source SVG path string.
   * @param toPath   - Target SVG path string.
   * @param options  - Optional settings (e.g. `maxSegmentLength`).
   * @returns A function `(t: number) => string` where `t` ranges 0–1.
   */
  export function interpolate(
    fromPath: string,
    toPath: string,
    options?: { maxSegmentLength?: number },
  ): (t: number) => string;
}
