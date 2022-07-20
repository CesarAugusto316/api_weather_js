import { MyMap } from './views/MyMap';
import { model } from './Model';


export class Controller {
  init() {
    this.map = new MyMap('#map');
  }
}
