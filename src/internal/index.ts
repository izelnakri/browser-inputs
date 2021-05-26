import Target, {
  FocusableElement,
  FormControl,
  HTMLElementContentEditable,
  MouseEventType,
  KeyboardEventType,
  FileSelectionEventType,
  MOUSE_EVENT_TYPES,
  KEYBOARD_EVENT_TYPES,
  FILE_SELECTION_EVENT_TYPES,
} from './types';
import getElement from './get-element';

export function isWindow(target: Target): target is Window {
  return target instanceof Window;
}

export function isElement(target: any): target is Element {
  return target.nodeType === Node.ELEMENT_NODE;
}

export function isDocument(target: any): target is Document {
  return target.nodeType === Node.DOCUMENT_NODE;
}

export function isSelectElement(element: Element | Document): element is HTMLSelectElement {
  return !isDocument(element) && element.tagName === 'SELECT';
}

export function isContentEditable(element: Element): element is HTMLElementContentEditable {
  return 'isContentEditable' in element && (element as HTMLElement).isContentEditable;
}

const FORM_CONTROL_TAGS = ['INPUT', 'BUTTON', 'SELECT', 'TEXTAREA'];
export function isFormControl(element: Element | Document | Window): element is FormControl {
  return (
    !isDocument(element) &&
    !isWindow(element) &&
    FORM_CONTROL_TAGS.indexOf(element.tagName) > -1 &&
    (element as HTMLInputElement).type !== 'hidden'
  );
}

const FOCUSABLE_TAGS = ['A'];
function isFocusableElement(element: Element): element is FocusableElement {
  return FOCUSABLE_TAGS.indexOf(element.tagName) > -1;
}

export function isFocusable(
  element: HTMLElement | SVGElement | Element | Document
): element is HTMLElement | SVGElement {
  if (isDocument(element)) {
    return false;
  }

  if (isFormControl(element)) {
    return !element.disabled;
  }

  if (isContentEditable(element) || isFocusableElement(element)) {
    return true;
  }

  return element.hasAttribute('tabindex');
}

export function isKeyboardEventType(eventType: any): eventType is KeyboardEventType {
  return KEYBOARD_EVENT_TYPES.indexOf(eventType) > -1;
}

export function isMouseEventType(eventType: any): eventType is MouseEventType {
  return MOUSE_EVENT_TYPES.indexOf(eventType) > -1;
}

export function isFileSelectionEventType(eventType: any): eventType is FileSelectionEventType {
  return FILE_SELECTION_EVENT_TYPES.indexOf(eventType) > -1;
}

export function isFileSelectionInput(element: any): element is HTMLInputElement {
  return element.files;
}

export function isNumeric(input: string): boolean {
  return !isNaN(parseFloat(input)) && isFinite(Number(input));
}

// ref: https://html.spec.whatwg.org/multipage/input.html#concept-input-apply
const constrainedInputTypes = ['text', 'search', 'url', 'tel', 'email', 'password'];
function isMaxLengthConstrained(
  element: Element
): element is HTMLInputElement | HTMLTextAreaElement {
  return (
    !!Number(element.getAttribute('maxLength')) &&
    (element instanceof HTMLTextAreaElement ||
      (element instanceof HTMLInputElement && constrainedInputTypes.indexOf(element.type) > -1))
  );
}

export function guardForMaxlength(element: FormControl, text: string, testHelper: string): void {
  const maxlength = element.getAttribute('maxlength');
  if (isMaxLengthConstrained(element) && maxlength && text && text.length > Number(maxlength)) {
    throw new Error(
      `Can not \`${testHelper}\` with text: '${text}' that exceeds maxlength: '${maxlength}'.`
    );
  }
}

export default Target;
export {
  getElement,
  Target,
  FocusableElement,
  FormControl,
  HTMLElementContentEditable,
  MouseEventType,
  KeyboardEventType,
  FileSelectionEventType,
  MOUSE_EVENT_TYPES,
  KEYBOARD_EVENT_TYPES,
  FILE_SELECTION_EVENT_TYPES,
};
