type Target = string | Element | Document | Window;

export default Target;
export type FocusableElement = HTMLAnchorElement;
export type FormControl =
  | HTMLInputElement
  | HTMLButtonElement
  | HTMLSelectElement
  | HTMLTextAreaElement;
export interface HTMLElementContentEditable extends HTMLElement {
  isContentEditable: true;
}
