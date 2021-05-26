import Target, { isDocument, isElement } from './index';

function getElement(target: string): Element | null;
function getElement(target: Element): Element;
function getElement(target: Document): Document;
function getElement(target: Window): Document;
function getElement(target: Target): Element | Document | null;
/**
  Used internally by the DOM interaction helpers to find one element.

  @private
  @param {string|Element} target the element or selector to retrieve
  @returns {Element} the target or selector
*/
function getElement(target: Target): Element | Document | null {
  if ((target as HTMLElement).nodeName) {
    return target as HTMLElement;
  } else if (!target || typeof target !== 'string') {
    throw new Error('Must use an element or a selector string');
  }

  return document.querySelector(target as string);
}

export default getElement;
