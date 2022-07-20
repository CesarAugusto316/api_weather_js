/**
 *
 * All Views in the App that have state or are rendered onto the screen
 * will inherit from this class, such as WeatherCity or MyMap.
 */
export class View {
  _markup = '';

  /**
   *
   * @param {string} selector '.class' or '#id'
   * @returns Element
   */
  constructor(selector) {
    this._parentElement = this._$(selector);
  }

  /**
   * @description Abstract Instance Method
   * every subclass should implement its own way to
   * generate markup, and store the result in this._markup
   */
  _generateMarkup() {}

  /**
   *
   * @description once _generateMarkup executes, it must store
   * the result in this._markup before calling this method.
   */
  _render() {
    this._parentElement.innerHTML = this._markup;
  }

  /**
   *
   * @param {string} htmlMarkup
   */
  _updateView(htmlMarkup) {
    this.markup = htmlMarkup;
    this._parentElement.innerHTML = this._markup;
  }

  /**
   *
   * @param {string} fontSize
   */
  _showSpinner(fontSize = 'font-5') {
    const spinnerMarkup = `
    <div class="spinner-container">
      <i class="fa-solid fa-circle-notch icon--spiner ${fontSize}"></i>
    </div>
    `;
    this._parentElement.innerHTML = spinnerMarkup;
  }

  _clearView() {
    this._parentElement.innerHTML = '';
  }

  /**
   *
   * @param {string} message
   */
  _showError(message) {
    const errorMarkup = `
    <div class="message-error">
      <p>${message}</p>
    </div>
    `;
    this._parentElement.innerHTML = errorMarkup;
  }

  /**
   *
   * @param {string} message
   */
  _showSucces(message) {
    const successMarkup = `
    <div class="message-success">
      <p>${message}</p>
    </div>
    `;
    this._parentElement.innerHTML = successMarkup;
  }

  /**
   *
   * @param {string} selector
   * @returns Element
   */
  _$(selector) {
    return document.querySelector(selector);
  }
}
