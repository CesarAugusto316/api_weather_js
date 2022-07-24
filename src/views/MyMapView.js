import { Map } from 'leaflet';
import { View } from './View.abstract.class';


export class MyMapView extends View {
  /**
   *
   * @param {string} parent
   */
  constructor(parent) {
    super(parent);
    this._parentElement = this.$(parent);
  }
}
