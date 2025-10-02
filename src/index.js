/**
/*	Injects CSS rules from a specified attribute into the shadow DOM of elements,
/*	with optional runtime watching for attribute changes or newly added nodes.
/*
/*	@usage
/*	```
/*	// Initialize & watch data-css attributes
/*	const observer = $shadowcss('data-css', { watch: true, target: document });
/*
/*	// Assuming an unstyleable third party webcomponent with an open shadow DOM like
/*	<custom-element>[#shadowDOM]<div class="classname"></div>[/#shadowDOM]</custom-element>
/*
/*	// With inline styles
/*	<custom-element data-css=".classname { color: red }"></custom-element>
/*
/*	// With an external stylesheet
/*	<custom-element data-css="/path/to/styles.css"></custom-element>
/*
/*	// If you use a css file to put together styles for various custom-elements you have to be
/*	// careful not to affect selectors in other components, so rules have to be scoped properly
/*	// which can be done like this:
/*	:host(custom-element) .selector {
/*		transform: rotate(180deg);
/*	}
/*	// or for more complex stuff
/*	:host(custom-element) {
/*		& .selector { ... }
/*		&:hover .selector { ... }
/*		& .another-selector { ... }
/*	}
/*
/*	// Stop watching data-css attributes (for whatever reason)
/*	observer.disconnect();
/*	```
/*
/*	This will inject CSS from the `data-css` attribute into the shadow DOM of the custom element and
/*	and will watch for changes of the attribute or new elements with the attribute added dynamically.
/*
/*	@param {String|Array} attrs - The attribute(s) that holds the CSS rules / path. Defaults to 'data-css'.
/*	@param {Object} [options] - Configuration options.
/*	@param {Boolean} [options.watch=false] - If true, watches for changes in the attribute or newly added elements.
/*	@param {Node} [options.target=document] - The target node to to look for attributes in and optionally observe.
/*
/*	@returns {MutationObserver} - Returns the MutationObserver instance, already observing if `watch` is true.
/*/
function $shadowCSS(
  attrs = "data-css",
  { watch = false, target = document } = {}
) {
  attrs = [].concat(attrs);
  const inject = (el) =>
    customElements.whenDefined(el.tagName.toLowerCase()).then(() => {
      el.shadowRoot &&
        attrs.forEach((attr) => {
          const file = el.getAttribute(attr).endsWith(".css");
          const node =
            el.shadowRoot.querySelector(`#${attr}`) ||
            el.shadowRoot.appendChild(
              Object.assign(document.createElement(file ? "link" : "style"), {
                id: attr,
                ...(file ? { rel: "stylesheet" } : {}),
              })
            );
          node[file ? "href" : "textContent"] = el.getAttribute(attr);
        });
    });

  target.querySelectorAll(attrs.map((a) => `[${a}]`).join(",")).forEach(inject);

  // Return the mutation observer to give the ability to stop it from watching via `.disconnect()`
  const o = Object.assign(
    new MutationObserver((mutations) =>
      mutations.forEach(({ target, addedNodes, type }) =>
        type === "attributes"
          ? inject(target)
          : addedNodes.forEach(
              (node) =>
                node.nodeType === 1 &&
                attrs.some((a) => node.hasAttribute(a)) &&
                inject(node)
            )
      )
    ),
    {
      options: {
        subtree: true,
        childList: true,
        attributes: true,
        attributeFilter: attrs,
      },
    }
  );
  // Activate the mutation observer if `watch` is true
  watch && o.observe(target, o.options);

  return o;
}

// Optional named export for convenience
export default $shadowCSS;
