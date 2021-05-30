import { hbs } from '@emberx/component';
import { module, test } from 'qunitx';
import { render } from '@emberx/test-helpers';
import { tap } from '../src/index';
import { setupRenderingTest } from './helpers/index';

function setupEventStepListeners(assert, element, options?) {
  ['touchstart', 'touchend', 'mousedown', 'mouseup', 'click'].forEach((eventName) => {
    element.addEventListener(eventName, () => {
      if (options) {
        return assert.step(
          `${eventName} ${Object.keys(options)
            .map((key) => options[key])
            .join(' ')}`
        );
      }

      return assert.step(eventName);
    });
  });
}

function setupFocusEventStepListeners(assert, element) {
  ['focus', 'focusin'].forEach((eventName) => {
    element.addEventListener(eventName, () => assert.step(eventName));
  });
}

function setupBlurEventStepListeners(assert, element) {
  ['blur', 'focusout'].forEach((eventName) => {
    element.addEventListener(eventName, () => assert.step(eventName));
  });
}

module('emberx/test-helpers | tap', function (hooks) {
  setupRenderingTest(hooks);

  module('non-focusable element types', function () {
    test('taping a div via selector with context set', async function (assert) {
      await render(hbs`<div data-test-some-test-div></div>`);

      setupEventStepListeners(assert, document.querySelector('[data-test-some-test-div]'));

      await tap('[data-test-some-test-div]');

      assert.verifySteps(['touchstart', 'touchend', 'mousedown', 'mouseup', 'click']);
    });

    test('tapping a div via element with context set', async function (assert) {
      await render(hbs`<div data-test-some-test-div></div>`);

      const element = document.querySelector('[data-test-some-test-div]');

      setupEventStepListeners(assert, element);

      await tap(element);

      assert.verifySteps(['touchstart', 'touchend', 'mousedown', 'mouseup', 'click']);
    });

    test('tapping passes options through to mouse events', async function (assert) {
      await render(hbs`<div data-test-some-test-div></div>`);

      const element = document.querySelector('[data-test-some-test-div]');

      setupEventStepListeners(assert, element, { clientX: 13, clientY: 17, button: 1 });

      await tap(element, { clientX: 13, clientY: 17, button: 1 });

      assert.verifySteps([
        'touchstart 13 17 1',
        'touchend 13 17 1',
        'mousedown 13 17 1',
        'mouseup 13 17 1',
        'click 13 17 1',
      ]);
    });

    test('does not run sync', async function (assert) {
      await render(hbs`<div data-test-some-test-div></div>`);

      const element = document.querySelector('[data-test-some-test-div]');

      setupEventStepListeners(assert, element);

      const promise = tap(element);

      await promise;

      assert.verifySteps(['touchstart', 'touchend', 'mousedown', 'mouseup', 'click']);
    });

    test('rejects if selector is not found', async function (assert) {
      assert.rejects(
        tap(`#foo-bar-baz-not-here-ever-bye-bye`),
        /Element not found when calling `tap\('#foo-bar-baz-not-here-ever-bye-bye'\)`/
      );
    });
  });

  module('focusable element types', function () {
    const TAP_STEPS = [
      'touchstart',
      'touchend',
      'mousedown',
      'focus',
      'focusin',
      'mouseup',
      'click',
    ];

    test('tapping a input via selector with context set', async function (assert) {
      await render(hbs`<input data-test-some-test-input />`);

      const element = document.querySelector('[data-test-some-test-input]');
      setupEventStepListeners(assert, element);
      setupFocusEventStepListeners(assert, element);

      await tap('[data-test-some-test-input]');

      assert.verifySteps(TAP_STEPS);
      assert.strictEqual(document.activeElement, element, 'activeElement updated');
    });

    test('tapping a input via element with context set', async function (assert) {
      await render(hbs`<input data-test-some-test-input />`);

      const element = document.querySelector('[data-test-some-test-input]');
      setupEventStepListeners(assert, element);
      setupFocusEventStepListeners(assert, element);

      await tap(element);

      assert.verifySteps(TAP_STEPS);
      assert.strictEqual(document.activeElement, element, 'activeElement updated');
    });

    test('tapping disabled form control throws', async function (assert) {
      await render(hbs`<input data-test-some-test-input disabled/>`);

      assert.rejects(
        tap('[data-test-some-test-input]'),
        new Error('Can not `tap` disabled [object HTMLInputElement]')
      );
    });
  });

  module('focusable and non-focusable elements interaction', function () {
    test('tapping on non-focusable element triggers blur on active element', async function (assert) {
      await render(hbs`
        <div id="test-target-div" />
        <input id="test-target-input" />
      `);

      let focusableElement = document.querySelector('#test-target-input');

      setupEventStepListeners(assert, focusableElement);
      setupFocusEventStepListeners(assert, focusableElement);
      setupBlurEventStepListeners(assert, focusableElement);

      // setupEventStepListenersForActiveElementInteraction(assert, focusableElement);

      await tap(focusableElement);
      await tap('#test-target-div');

      assert.verifySteps([
        'touchstart',
        'touchend',
        'mousedown',
        'focus',
        'focusin',
        'mouseup',
        'click',
        'blur',
        'focusout',
      ]);
    });

    test('tapping on focusable element triggers blur on active element', async function (assert) {
      await render(hbs`
        <input id="test-first-target-input" />
        <input id="test-second-target-input" />
      `);

      let focusableElement = document.querySelector('#test-first-target-input');

      setupEventStepListeners(assert, focusableElement);
      setupFocusEventStepListeners(assert, focusableElement);
      setupBlurEventStepListeners(assert, focusableElement);

      await tap(focusableElement);
      await tap('#test-second-target-input');

      assert.verifySteps([
        'touchstart',
        'touchend',
        'mousedown',
        'focus',
        'focusin',
        'mouseup',
        'click',
        'blur',
        'focusout',
      ]);
    });

    test('tapping on non-focusable element does not trigger blur on non-focusable active element', async function (assert) {
      await render(hbs`
        <div id="test-first-target-div" />
        <div id="test-second-target-div" />
      `);

      let nonFocusableElement = document.querySelector('#test-first-target-div');

      setupEventStepListeners(assert, nonFocusableElement);
      setupFocusEventStepListeners(assert, nonFocusableElement);

      await tap(nonFocusableElement);
      await tap('#test-second-target-div');

      assert.verifySteps(['touchstart', 'touchend', 'mousedown', 'mouseup', 'click']);
    });
  });
});
