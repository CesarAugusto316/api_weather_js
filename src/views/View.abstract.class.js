/**
 * @description Abstract Class
 *
 * All Views in the App that have state or are rendered onto the screen
 * will inherit from this class, such as WeatherCityView or FormView.
 */
export class View {
  markup = '';

  /**
   *
   * @param {string} selector '.class' or '#id'
   * @returns Element
   */
  constructor(selector) {
    this._parentElement = this._$(selector);
  }

  /**
   * @param {EventListener} handler
   */
  addClickHandler(handler) {
    this._parentElement.addEventListener('click', handler);
  }

  /**
   * @param {EventListener} handler
   */
  addLoadHandler(handler) {
    this._parentElement.addEventListener('load', handler);
  }

  /**
   * @description Abstract Instance Method
   * every subclass should implement its own way to
   * generate markup, and store the result in this.markup
   *
   * @param {import('../WeatherModel').WeatherData} weatherData
   * @return this
   */
  generateMarkup(weatherData) {}

  /**
   *
   * @description once .generateMarkup() executes, it must store
   * the result in this.markup before calling this method.
   */
  render() {
    this._parentElement.innerHTML = this.markup;
    return this;
  }

  /**
   *
   * @param {string} htmlMarkup
   */
  updateView(htmlMarkup) {
    this.markup = htmlMarkup;
    this._parentElement.innerHTML = this.markup;
    return this;
  }

  /**
   *
   * @param {string} fontSize
   */
  showSpinner(fontSize = 'font-4') {
    const spinnerMarkup = `
    <div class="spinner-container">
      <i class="fa-solid fa-circle-notch icon--spiner ${fontSize}"></i>
    </div>
    `;
    this._parentElement.innerHTML = spinnerMarkup;
    return this;
  }

  clearView() {
    this._parentElement.innerHTML = '';
    return this;
  }

  /**
   *
   * @param {string} message
   */
  showError(message) {
    const errorMarkup = `
    <div class="message message--error">
      <p>${message}</p>
    </div>
    `;
    this._parentElement.innerHTML = errorMarkup;
    return this;
  }

  /**
   *
   * @param {string} message
   */
  showSucces(message) {
    const successMarkup = `
    <div class="message message--success">
      <p>${message}</p>
    </div>
    `;
    this._parentElement.innerHTML = successMarkup;
    return this;
  }

  /**
   *
   * @param {string} selector
   * @return {HTMLElement}
   */
  _$(selector) {
    return document.querySelector(selector);
  }
}