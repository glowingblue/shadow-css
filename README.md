[![npm version](https://badge.fury.io/js/@glowingblue-dev%2Fshadow-css.svg)](https://badge.fury.io/js/@glowingblue-dev%2Fshadow-css)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

# @glowingblue-dev/shadow-css

Injects custom CSS into open shadow roots via HTML attributes with optional runtime watching for attribute changes or newly added nodes.

## Features

- Add inline CSS or external `.css` files into open shadow roots
- Works with one or multiple attributes
- Optional live watching via MutationObserver: React to attribute changes and dynamically added nodes
- Zero dependencies, tiny footprint

## Install

```bash
npm install @glowingblue-dev/shadow-css
```

or

```bash
yarn add @glowingblue-dev/shadow-css
```

## Usage

Assuming an unstyleable third party WebComponent with an open shadow DOM like:

```html
<custom-element>[#shadowDOM]<div class="classname"></div>[/#shadowDOM]</custom-element>
```

### Inline styles

```html
<custom-element data-css=".classname { color: red; }"></custom-element>
```

```js
import $shadowCSS from "@glowingblue-dev/shadow-css";

$shadowCSS("data-css");
```

### External stylesheet

```html
<custom-element data-css="/path/to/styles.css"></custom-element>
```

```js
$shadowCSS("data-css", { watch: true });
```

### Multiple attributes

```html
<custom-element
  data-theme="/themes/dark.css"
  data-css=".classname { color: red; }"
></custom-element>
```

```js
$shadowCSS(["data-theme", "data-css"], { watch: true });
```

## API

```ts
$shadowCSS(attrs?: string | string[], options?: { watch?: boolean }, target?: Node): MutationObserver
```

- **attrs** — one or more attribute names (default: `"data-css"`).
- **options.watch** — if `true`, sets up a `MutationObserver` to update when the attribute value changes or when new elements with the attribute are added.
- **options.target** - The target node to to look for attributes and optionally observe, defaults to the global `document`.

Always returns a `MutationObserver` instance, if `watch: true` it is already activated and observing the DOM and can be disabled by calling `.disconnect()` at any later point. If `watch: false` (default) you can activate it at a point of your choosing by calling `.observe(<target>, <options>)`. The default options are attached to the returned `MutationObserver` instance for convenience.

## Scoping tips

When using a shared stylesheet across multiple components, scope your rules with `:host(...)`:

```css
:host(custom-element) .selector {
  transform: rotate(180deg);
}

:host(custom-element) {
  & .selector {
    ...;
  }
  &:hover .selector {
    ...;
  }
}
```

## Limitations

- Only works with **open shadow DOMs**. Closed roots cannot be styled this way.
- Runs in browsers (relies on `document`).

## License

MIT © Glowing Blue AG

## Credits

Originally authored by [exside](https://github.com/exside)
