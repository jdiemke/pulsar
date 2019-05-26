/**
 * Stores the currently active rendering context in a global variable.
 */

export let context: WebGL2RenderingContext = null;

export function setCurrentContext(currentContext: WebGL2RenderingContext): void {
    context = currentContext;
}
