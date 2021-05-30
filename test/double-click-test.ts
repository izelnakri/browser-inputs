import { hbs } from '@emberx/component';
import { module, test } from 'qunitx';
import { render, find } from '@emberx/test-helpers';
import { doubleClick } from '../src/index';
import { setupRenderingTest } from './helpers/index';

function setupEventStepListeners(assert, element) {
  ['mousedown', 'focus', 'focusin', 'mouseup', 'click', 'dblclick'].forEach((eventName) => {
    element.addEventListener(eventName, () => assert.step(eventName));
  });
}

function setupEventStepListenersForActiveElementInteraction(assert, element) {
  [
    'mousedown',
    'focus',
    'focusin',
    'mouseup',
    'click',
    'dblclick',
    'blur',
    'focusout',
  ].forEach((eventName) => {
    element.addEventListener(eventName, () => assert.step(eventName));
  });
}

module('emberx/test-helpers | doubleClick', function (hooks) {
  module('non-focusable element types', function () {
    setupRenderingTest(hooks);

    test('it executes registered doubleClick hooks', async function (assert) {
      assert.expect(11);

      this.fireClick = () => assert.ok(true, 'fireClick called');
      this.doubleClick = () => assert.ok(true, 'doubleClick called');

      await render(hbs`
        <div data-test-some-div {{on "click" this.fireClick}} {{on "dblclick" this.doubleClick}}>
          Something
        </div>
      `);

      setupEventStepListeners(assert, document.querySelector('[data-test-some-div]'));

      await doubleClick('[data-test-some-div]');

      assert.verifySteps([
        'mousedown',
        'mouseup',
        'click',
        'mousedown',
        'mouseup',
        'click',
        'dblclick',
      ]);
    });

    test('double-clicking a div via selector with context set', async function (assert) {
      assert.expect(11);

      this.fireClick = () => assert.ok(true, 'fireClick called');
      this.doubleClick = () => assert.ok(true, 'doubleClick called');

      await render(hbs`
        <div data-test-some-div {{on "click" this.fireClick}} {{on "dblclick" this.doubleClick}}>
          Something
        </div>
      `);

      setupEventStepListeners(assert, document.querySelector('[data-test-some-div]'));

      const div = find('[data-test-some-div]');

      await doubleClick(div);

      assert.verifySteps([
        'mousedown',
        'mouseup',
        'click',
        'mousedown',
        'mouseup',
        'click',
        'dblclick',
      ]);
    });

    test('does not run sync', async function (assert) {
      await render(hbs`
        <div data-test-some-div>
          Something
        </div>
      `);

      setupEventStepListeners(assert, document.querySelector('[data-test-some-div]'));

      const promise = doubleClick('[data-test-some-div]');

      await promise;

      assert.verifySteps([
        'mousedown',
        'mouseup',
        'click',
        'mousedown',
        'mouseup',
        'click',
        'dblclick',
      ]);
    });

    test('rejects if selector is not found', async function (assert) {
      await render(hbs`
        <div data-test-some-div>
          Something
        </div>
      `);

      assert.rejects(
        doubleClick(`#foo-bar-baz-not-here-ever-bye-bye`),
        /Element not found when calling `doubleClick\('#foo-bar-baz-not-here-ever-bye-bye'\)`/
      );
    });

    test('rejects for disabled form control', async function (assert) {
      await render(hbs`
        <select data-test-select-element disabled>
          <option>One</option>
          <option>Two</option>
        </select>
      `);

      assert.rejects(
        doubleClick('[data-test-select-element]'),
        new Error('Can not `doubleClick` disabled [object HTMLSelectElement]')
      );
    });
  });

  module('focusable element types', function () {
    const CLICK_STEPS = [
      'mousedown',
      'focus',
      'focusin',
      'mouseup',
      'click',
      'mousedown',
      'mouseup',
      'click',
      'dblclick',
    ];

    test('double-clicking a input via selector with context set', async function (assert) {
      await render(hbs`
        <input data-test-some-test-input>
      `);

      setupEventStepListeners(assert, document.querySelector('[data-test-some-test-input]'));

      await doubleClick('[data-test-some-test-input]');

      assert.verifySteps(CLICK_STEPS);
      assert.strictEqual(
        document.activeElement,
        document.querySelector('[data-test-some-test-input]'),
        'activeElement updated'
      );
    });

    test('double-clicking a input via element with context set', async function (assert) {
      await render(hbs`
        <input data-test-some-test-input>
      `);

      setupEventStepListeners(assert, document.querySelector('[data-test-some-test-input]'));

      await doubleClick(document.querySelector('[data-test-some-test-input]'));

      assert.verifySteps(CLICK_STEPS);
      assert.strictEqual(
        document.activeElement,
        document.querySelector('[data-test-some-test-input]'),
        'activeElement updated'
      );
    });

    module('elements in different realms', function () {
      function insertElement(element) {
        const fixture = document.querySelector('#ember-testing');
        fixture.appendChild(element);
      }

      test('double-clicking an element in a different realm', async function (assert) {
        const element = document.createElement('iframe');

        insertElement(element);

        const iframeDocument = element.contentDocument;
        const iframeElement = iframeDocument.createElement('div');

        setupEventStepListeners(assert, iframeElement);

        await doubleClick(iframeElement);

        assert.verifySteps([
          'mousedown',
          'mouseup',
          'click',
          'mousedown',
          'mouseup',
          'click',
          'dblclick',
        ]);
      });
    });
  });

  module('focusable and non-focusable elements interaction', function () {
    test('clicking on non-focusable element triggers blur on active element', async function (assert) {
      await render(hbs`
        <div id="test-target-div" />
        <input id="test-target-input" />
      `);

      let focusableElement = document.querySelector('#test-target-input');

      setupEventStepListenersForActiveElementInteraction(assert, focusableElement);

      await doubleClick(focusableElement);
      await doubleClick('#test-target-div');

      assert.verifySteps([
        'mousedown',
        'focus',
        'focusin',
        'mouseup',
        'click',
        'mousedown',
        'mouseup',
        'click',
        'dblclick',
        'blur',
        'focusout',
      ]);
    });

    test('clicking on focusable element triggers blur on active element', async function (assert) {
      await render(hbs`
        <input id="test-first-target-input" />
        <input id="test-second-target-input" />
      `);

      let focusableElement = document.querySelector('#test-first-target-input');

      setupEventStepListenersForActiveElementInteraction(assert, focusableElement);

      await doubleClick(focusableElement);
      await doubleClick('#test-second-target-input');

      assert.verifySteps([
        'mousedown',
        'focus',
        'focusin',
        'mouseup',
        'click',
        'mousedown',
        'mouseup',
        'click',
        'dblclick',
        'blur',
        'focusout',
      ]);
    });

    test('clicking on non-focusable element does not trigger blur on non-focusable active element', async function (assert) {
      await render(hbs`
        <div id="test-first-target-div" />
        <div id="test-second-target-div" />
      `);

      let nonFocusableElement = document.querySelector('#test-first-target-div');

      setupEventStepListenersForActiveElementInteraction(assert, nonFocusableElement);

      await doubleClick(nonFocusableElement);
      await doubleClick('#test-second-target-div');

      assert.verifySteps([
        'mousedown',
        'mouseup',
        'click',
        'mousedown',
        'mouseup',
        'click',
        'dblclick',
      ]);
    });
  });
});
