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

export type Lit = string | number | boolean | undefined | null | void | {};
export function tuple<T extends Lit[]>(...args: T) {
  return args;
}

export const MOUSE_EVENT_TYPES = tuple(
  'click',
  'mousedown',
  'mouseup',
  'dblclick',
  'mouseenter',
  'mouseleave',
  'mousemove',
  'mouseout',
  'mouseover'
);
export const KEYBOARD_EVENT_TYPES = tuple('keydown', 'keypress', 'keyup');
export const FILE_SELECTION_EVENT_TYPES = tuple('change');

export type MouseEventType = typeof MOUSE_EVENT_TYPES[number];
export type KeyboardEventType = typeof KEYBOARD_EVENT_TYPES[number];
export type FileSelectionEventType = typeof FILE_SELECTION_EVENT_TYPES[number];
