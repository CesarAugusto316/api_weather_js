import { MyMap } from './Map';


class App {
  map = new MyMap();

  /**
   *
   * @param {string} str
   */
  _select(str) {
    return document.querySelector(str);
  }

  init() {
  }
}


const app = new App();
app.init();
