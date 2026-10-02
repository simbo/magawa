import type { ComponentProps, VNode } from 'preact';
import { useEffect, useState } from 'preact/hooks';

import { AppRoute } from './app-route.enum';
import { normalizeHashPath } from './hash-path';

/**
 * Reads the route from the URL fragment, retaining GitHub Pages deep links.
 *
 * @returns The requested path, or the home route for an empty fragment.
 */
function getPath(): string {
  return normalizeHashPath(globalThis.location.hash);
}

/**
 * Navigates within the current deployment directory without a server request.
 *
 * @param path - Destination app route.
 * @param replace - Whether to replace the current history entry.
 */
export function route(path: AppRoute, replace = false): void {
  if (replace) {
    globalThis.history.replaceState(null, '', `#${path}`);
    globalThis.dispatchEvent(new HashChangeEvent('hashchange'));
  } else {
    globalThis.location.hash = path;
  }
}

/**
 * App link attributes; native anchors preserve modified clicks and new tabs.
 */
type LinkProps = Omit<ComponentProps<'a'>, 'href'> & { href: AppRoute };

/**
 * Renders an ordinary fragment link for an app destination.
 *
 * @param props - Anchor attributes with an app route as their destination.
 * @returns A native anchor scoped to the current deployment path.
 */
function link(props: LinkProps): VNode {
  return <a {...props} role="link" href={`#${props.href}`} />;
}

/**
 * Resolves the four app views and follows browser back/forward navigation.
 * Unknown routes display the start form.
 *
 * @param props - View elements keyed by their app route.
 * @param props.routes - Available destinations and the home fallback.
 * @returns The currently selected view.
 */
function hashRouter(props: { routes: Record<AppRoute, VNode> & Partial<Record<string, VNode>> }): VNode {
  const [path, setPath] = useState(getPath);
  useEffect(() => {
    /**
     * Updates the view after native fragment or history navigation.
     */
    const onHashChange = (): void => {
      setPath(getPath());
    };
    globalThis.addEventListener('hashchange', onHashChange);
    // A lazy view may have changed the fragment before this listener mounted.
    onHashChange();
    return () => {
      globalThis.removeEventListener('hashchange', onHashChange);
    };
  }, []);
  return props.routes[path] ?? props.routes[AppRoute.Home];
}

/**
 * App components exported with JSX-compatible names.
 */
export { link as Link, hashRouter as HashRouter };
