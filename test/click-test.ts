import { hbs } from '@emberx/component';
import { module, test } from 'qunitx';
import { render } from '@emberx/test-helpers';
import { click } from '../src/index';
import { setupRenderingTest } from './helpers/index';

function setupClickEventListenersForInput(assert, element) {
  ['mousedown', 'focus', 'mouseup', 'click'].forEach((eventName) => {
    element.addEventListener(eventName, () => assert.step(eventName));
  });
}

function setupClickEventListenersForInputInteraction(assert, element) {
  ['mousedown', 'focus', 'focusin', 'mouseup', 'click', 'blur', 'focusout'].forEach((eventName) => {
    element.addEventListener(eventName, () => assert.step(eventName));
  });
}

function setupClickEventListenersForNonInputInteraction(assert, element) {
  ['mousedown', 'mouseup', 'click'].forEach((eventName) => {
    element.addEventListener(eventName, () => assert.step(eventName));
  });
}

module('emberx/test-helpers | click', function (hooks) {
  setupRenderingTest(hooks);

  test('it works', async function (assert) {
    assert.expect(3);

    this.title = 'some title';
    this.assertTrue = (param) => assert.equal(param, 'some title');

    await render(hbs`
      <button type="button" {{on "click" (fn this.assertTrue this.title)}} data-test-some-button>
        Something
      </button>
    `);

    assert.dom('[data-test-some-button]').hasText('Something');

    await click('[data-test-some-button]');

    assert.dom('[data-test-some-button]').hasText('Something');
  });

  test('it throws when called without target', async function (assert) {
    let done = assert.async();

    click().catch((error) => {
      assert.ok(error instanceof Error);
      assert.equal(error.message, 'Must pass an element or selector to `click`.');
      done();
    });
  });

  test('it throws when target does not exist', async function (assert) {
    let done = assert.async();

    click('#asdasdasd').catch((error) => {
      assert.ok(error instanceof Error);
      assert.equal(error.message, "Element not found when calling `click('#asdasdasd')`.");
      done();
    });
  });

  test('it calls mousedown, focus, mouseup, click once on focusable element', async function (assert) {
    await render(hbs`
      <button type="button" data-test-outside></button>
      <form data-test-form>
        <input id="test-input"/>
      </form>
    `);

    assert.dom('#test-input').hasValue('').isNotFocused();

    let input = document.querySelector('#test-input');

    setupClickEventListenersForInput(assert, input);

    assert.verifySteps([]);

    await click('#test-input');

    assert.verifySteps(['mousedown', 'focus', 'mouseup', 'click']);

    assert.dom('#test-input').isFocused();

    await click('[data-test-outside]');

    assert.verifySteps([]);
    assert.dom('#test-input').isNotFocused();

    await click('#test-input');

    assert.verifySteps(['mousedown', 'focus', 'mouseup', 'click']);
    assert.dom('#test-input').isFocused();
  });

  test('it doesnt call mousedown, mouseup, click on disabled form element', async function (assert) {
    assert.expect(9);

    let done = assert.async();

    await render(hbs`
      <button type="button" data-test-outside></button>
      <form data-test-form>
        <input id="test-input" disabled/>
      </form>
    `);

    assert.dom('#test-input').isNotFocused().isDisabled();

    let input = document.querySelector('#test-input');

    setupClickEventListenersForInput(assert, input);

    assert.verifySteps([]);

    click('#test-input')
      .catch(() => {
        assert.verifySteps([]);
        assert.dom('#test-input').isNotFocused().isDisabled();

        return click('#test-input');
      })
      .catch(() => {
        assert.verifySteps([]);
        assert.dom('#test-input').isNotFocused().isDisabled();
        done();
      });
  });

  module('focusable and non-focusable elements interaction', function () {
    test('clicking on non-focusable element triggers blur on active element', async function (assert) {
      await render(hbs`
        <div id="test-target-div" />
        <input id="test-target-input" />
      `);

      let focusableElement = document.querySelector('#test-target-input');

      setupClickEventListenersForInputInteraction(assert, focusableElement);

      await click(focusableElement);
      await click('#test-target-div');

      assert.verifySteps(['mousedown', 'focus', 'focusin', 'mouseup', 'click', 'blur', 'focusout']);
    });

    test('clicking on focusable element triggers blur on active element', async function (assert) {
      await render(hbs`
        <input id="test-first-target-input" />
        <input id="test-second-target-input" />
      `);

      let focusableElement = document.querySelector('#test-first-target-input');

      setupClickEventListenersForInputInteraction(assert, focusableElement);

      await click(focusableElement);
      await click('#test-second-target-input');

      assert.verifySteps(['mousedown', 'focus', 'focusin', 'mouseup', 'click', 'blur', 'focusout']);
    });

    test('clicking on non-focusable element does not trigger blur on non-focusable active element', async function (assert) {
      await render(hbs`
        <div id="test-first-target-div" />
        <div id="test-second-target-div" />
      `);

      let nonFocusableElement = document.querySelector('#test-first-target-div');

      setupClickEventListenersForNonInputInteraction(assert, nonFocusableElement);

      await click(nonFocusableElement);
      await click('#test-second-target-div');

      assert.verifySteps(['mousedown', 'mouseup', 'click']);
    });
  });
});
