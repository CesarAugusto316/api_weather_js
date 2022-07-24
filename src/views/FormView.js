import { View } from './View.abstract.class';


export class FormView extends View {
  /**
   *
   * @param {string} parent
   */
  constructor(parent) {
    super(parent);
    this.inputCityCountry = this.$('input.form__input');
    this.inputSelect = this.$('select.form__input');
  }

  /**
   *
   * @param {EventListener} handler
   */
  addSubmitHandler(handler) {
    this._parentElement.addEventListener('submit', handler);
  }

  /**
   *
   * @param {EventListener} handler
   */
  addChangeHandler(handler) {
    this._parentElement.addEventListener('change', handler);
  }

  /**
   *
   * @override
   * @param {string} selector
   * @return {HTMLInputElement}
   */
  $(selector) {
    return document.querySelector(selector);
  }
}
