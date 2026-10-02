const SVG_ICON_CACHE = new Map<string, string>();

/**
 * Custom-element attribute selecting the SVG module to display.
 */
export const ICON_NAME_ATTRIBUTE = 'icon-name';

/**
 * Loads an SVG module by name and inserts its markup into a custom element.
 */
export class SvgIcon extends HTMLElement {
  public static observedAttributes = [ICON_NAME_ATTRIBUTE];

  /**
   * Initializes the custom element through the HTMLElement constructor.
   */
  public constructor() {
    super();
  }

  /**
   * Reloads the displayed icon when its icon-name attribute changes.
   */
  public attributeChangedCallback(attribute: string, _oldValue: string, value: string): void {
    if (attribute === ICON_NAME_ATTRIBUTE) {
      this.setIcon(value);
    }
  }

  /**
   * Ignores empty names and replaces the element contents with the asynchronously loaded SVG.
   */
  private setIcon(iconName: string) {
    if (typeof iconName !== 'string' || iconName.length === 0) {
      return;
    }
    this.getIcon(iconName).then(svg => {
      this.innerHTML = svg;
    });
  }

  /**
   * Dynamically imports an icon module once and reuses its markup from the shared cache.
   */
  private async getIcon(iconName: string): Promise<string> {
    if (!SVG_ICON_CACHE.has(iconName)) {
      const { default: importedIcon } = await import(`./svg-icons/${iconName}.ts`);
      SVG_ICON_CACHE.set(iconName, importedIcon);
    }
    const icon = SVG_ICON_CACHE.get(iconName) as string;
    return icon;
  }
}
