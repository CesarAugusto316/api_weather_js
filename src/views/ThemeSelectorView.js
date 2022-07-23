import { View } from './View.abstract.class';


export class ThemeSelectorView extends View {
  /**
   * @param {EventListener} handler
   */
  addChangeHandler(handler) {
    this._parentElement.addEventListener('change', handler);
  }

  /**
   * @override
   * @param {string} selector
   * @return {HTMLSelectElement}
   */
  _$(selector) {
    return document.querySelector(selector);
  }
}
