export type ShadowCSSOptions = {
  /** If true, begin observing immediately */
  watch?: boolean;
  /** The root node to scan and (optionally) observe. Defaults to document */
  target?: Node;
};

/**
 * Inject CSS rules (or a .css URL) from attributes into open shadow roots.
 * @param attrs Attribute name or names (default: "data-css")
 * @param options Set { watch: true } to observe changes and new nodes
 * @returns MutationObserver
 */
declare function $shadowCSS(
  attrs?: string | string[],
  options?: ShadowCSSOptions
): MutationObserver;

export default $shadowCSS;
