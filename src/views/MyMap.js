import {
  map, tileLayer, marker, Map,
} from 'leaflet';
import { WeatherCity } from './WeatherCity';
import { leaftletMaps } from '../apiConfigs';
import { View } from './View';


const { tileLayers, options } = leaftletMaps;

export class MyMap extends View {
  weatherApi = new WeatherCity('.weather-data');

  /**
   *
   * @param {string} parent
   */
  constructor(parent) {
    super(parent);
    this._parentElement = this._$(parent);
    this.init();
  }

  _getClientLocation() {
    return new Promise((resolve, reject) => {
      window.navigator.geolocation.getCurrentPosition((pos) => {
        const { latitude, longitude } = pos.coords;
        resolve({ latitude, longitude });
      }, (error) => {
        reject(error);
      });
    });
  }

  /**
   *
   * @param {number} latitude
   * @param {number} longitude
   */
  _loadMap(latitude, longitude) {
    const rightOffSet = 5.2;

    this.weatherApi.fetchByCoords(latitude, longitude)
      .then((weatherData) => {
        // this.appendWeatherCard(weatherData);
      });

    const myMap = map('map').setView([latitude, longitude + rightOffSet], 5);

    tileLayer(tileLayers[2], options).addTo(myMap);

    marker([latitude, longitude]).addTo(myMap);
    return myMap;
  }

  // /**
  //  *
  //  * @param {Map} map
  //  */
  // _registerClickHandler(map) {
  //   map.on('click', async (e) => {
  //     const { lat, lng } = e.latlng;

  //     const weatherData = await this.weatherApi.fetchByCoords(lat, lng).then((res) => res);

  //     this.appendWeatherCard(weatherData);
  //     console.log(weatherData);

  //     marker([lat, lng]).addTo(map);
  //     map.setView([lat, lng]);
  //   });
  // }

  // _createWeatherCard({
  //   main, sys, weather, name,
  // }) {
  //   const {
  //     pressure, temp, humidity, sea_level: seaLevel,
  //   } = main;
  //   const { description, icon } = weather[0];

  //   return `
  //     <div class="weather-header">
  //       <figure>
  //         <img
  //           class="weather-image"
  //           src="https://openweathermap.org/img/w/${icon}.png"
  //           alt="openweather"
  //         />
  //       </figure>
  //       <h4 class="weather-title">${description}</h4>
  //     </div>

  //     <p><b>Ciudad</b>${name || 'desconocida'}, ${sys.country}</p>
  //     <p><b>Nivel del mar</b> ${seaLevel} m</p>
  //     <p><b>Temperatura</b> ${temp} °F </p>
  //     <p><b>Humedad</b> ${humidity} % </p>
  //     <p><b>Presion</b> ${pressure} Pa</p>
  //   `;
  // }

  // appendWeatherCard(weatherdata) {
  //   this._parentElement.innerHTML = this._createWeatherCard(weatherdata);
  // }

  async init() {
    try {
      const { latitude, longitude } = await this._getClientLocation();
      this._loadMap(latitude, longitude);
    } catch (error) {
      console.log(error.message);
    }
  }
}
