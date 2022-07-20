import { Map } from 'leaflet';
import { View } from './View';


export class MyMap extends View {
  /**
   *
   * @param {string} parent
   */
  constructor(parent) {
    super(parent);
    this._parentElement = this._$(parent);
  }


  /**
   *
   * @param {Map} map
   */
  _registerClickHandler(map) {
    map.on('click', async (e) => {
      const { lat, lng } = e.latlng;

      // const weatherData = await this.weatherApi.fetchByCoords(lat, lng).then((res) => res);

      // this.appendWeatherCard(weatherData);
      // console.log(weatherData);

      // marker([lat, lng]).addTo(map);
      map.setView([lat, lng]);
    });
  }

  // appendWeatherCard(weatherdata) {
  //   this._parentElement.innerHTML = this._createWeatherCard(weatherdata);
  // }

  // async init() {
  //   // try {
  //   //   // this logic should go in the controller
  //   //   const { latitude, longitude } = await model._getClientLocation();
  //   //   this._clearView(); // clears the spinner
  //   //   this._loadMap(latitude, longitude); // loads the map
  //   // } catch (error) {
  //   //   console.log(error.message);
  //   // }
  // }
}
