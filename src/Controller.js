import {
  map, tileLayer, marker,
} from 'leaflet';
import { MyMap } from './views/MyMap';
import { model } from './WeatherModel';
import { leaftletMaps } from './apiConfigs';
import { WeatherCity } from './views/WeatherCity';


const { tileLayers, options } = leaftletMaps;

export class Controller {
  _offSetX = 5.2;
  _initialZoom = 6;
  weatherCard = new WeatherCity('.weather-data-card');


  /**
   *
   * @param {number} latitude
   * @param {number} longitude
   */
  _renderMap(latitude, longitude) {
    const myMap = map('map')
      .setView([latitude, longitude + this._offSetX], this._initialZoom);

    tileLayer(tileLayers[2], options).addTo(myMap);
    marker([latitude, longitude]).addTo(myMap);
    return myMap;
  }

  async init() {
    try {
      // map
      this.map = new MyMap('#map');
      this.map.showSpinner('font-7');
      const { latitude, longitude } = await model._getClientLocation();
      this.map.clearSpinner(); // clears the spinner
      this.map = this._renderMap(latitude, longitude);

      // weather-data-card
      this.weatherCard.showSpinner('font-4');

      model.fetchByCoords(latitude, longitude).then((res) => {
        this.weatherCard
          .clearSpinner()
          .generateMarkup(res)
          .renderMarkup();
      });
      //
    } catch (error) {
      console.log(error.message);
    }
  }
}
