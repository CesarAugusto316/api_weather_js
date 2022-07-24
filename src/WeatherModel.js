import axios from 'axios';
import { Marker } from 'leaflet';
import { openWeatherMaps } from './apiConfigs';


const { apiUrl, appId } = openWeatherMaps;

/**
 * @typedef {object} WeatherData
 *    @property {number} humidity
 *    @property {number} pressure
 *    @property {number} seaLevel
 *    @property {number} temp
 *    @property {number} lat
 *    @property {number} lng
 *    @property {string} icon
 *    @property {string} name
 *    @property {string} country
 *    @property {string} description
 */

/**
 * @description Global State Object for the entire App,
 * State keeps in Sync with LocalStorage, through
 * the WeatherModel instance, (Single Source of Truth).
 */
export const state = {
  /** @type Array<WeatherData> */
  cities: [],
  /** @type WeatherData */
  currentCity: {
    humidity: 0,
    pressure: 0,
    seaLevel: 0,
    temp: 0,
    lat: 0,
    lng: 0,
    icon: '',
    name: '',
    country: '',
    description: '',
  },
  /** @type Array<Marker> */
  markers: [],
  /** @type Marker */
  currentMarker: new Marker([0, 0]), // {lat, lng}
  /** @type Array<WeatherData> */
  citiesFromLocalStorage: [],
};

class WeatherModel {
  /**
   *
   * @return {Promise<{latitude:number, longitude: number}>}
   */
  getClientLocation() {
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
   * @param {number} lat
   * @param {number} lng
   * @return {Promise<WeatherData>}
   */
  async fetchByCoords(lat, lng) {
    try {
      const { data } = await axios.get(apiUrl, {
        params: {
          lang: 'es',
          lat,
          lon: lng,
          appid: appId,
        },
      });
      const {
        main: {
          humidity, pressure, sea_level: seaLevel, temp,
        }, name, sys: { country }, weather,
      } = data;
      /** @type WeatherData */
      const weatherData = {
        temp,
        country,
        humidity,
        lat,
        lng,
        name,
        pressure,
        seaLevel,
        description: weather[0].description,
        icon: weather[0].icon,
      };
      state.currentCity = weatherData; // handles state
      return weatherData;
    } catch (error) {
      console.log(error.message);
      return error;
    }
  }

  /**
   *
   * @param {string} q
   * @return {Promise<WeatherData>}
   */
  async fetchByCityName(q) {
    try {
      const { data } = await axios.get(apiUrl, {
        params: {
          lang: 'es',
          q,
          appid: appId,
        },
      });
      const {
        main: {
          humidity, pressure, sea_level: seaLevel, temp,
        }, name, sys: { country }, weather, coord: { lon, lat },
      } = data;
      /** @type WeatherData */
      const weatherData = {
        temp,
        country,
        humidity,
        lat,
        lng: lon,
        name,
        pressure,
        seaLevel,
        description: weather[0].description,
        icon: weather[0].icon,
      };

      state.currentCity = weatherData; // handles state
      return weatherData;
    } catch (error) {
      console.log(error.message);
      return error;
    }
  }

  /**
   *
   * @description When we write to localStorage, we keep localStorage
   * in Sync with the state object.
   * @param {Array<WeatherData>} newState
   */
  writeToLocalStorage(newState) {
    const cities = JSON.stringify(newState); // handles state
    localStorage.setItem('cities', cities);
    this.readFromLocalStorage(); // will update our state
  }

  /**
   *
   * @description When we write to localStorage, we keep localStorage
   * in Sync with the state object.
   * @return {Array<WeatherData>}
   */
  readFromLocalStorage() {
    /** @type Array<WeatherData> */
    const cities = JSON.parse(localStorage.getItem('cities')) || [];
    state.citiesFromLocalStorage = cities; // handles state
    return cities;
  }

  /**
   *
   * @return void
   */
  deleteLocalStorage() {
    localStorage.removeItem('cities');
    location.reload();
  }

  /**
  *
  * @description cheks if there are duplicates in
  * localStorage before any operation.
  * @return boolean
  */
  checkDuplicateCoords() {
    let result = false;
    const objValues = Object.keys(state.currentCity);
    const cities = this.readFromLocalStorage();

    cities.forEach((item) => {
      const areEqual = [];
      Object.keys(item).forEach((key1, index) => {
        if ((key1 === 'lat' && objValues[index] === 'lat')
         || (key1 === 'lng' && objValues[index] === 'lng')
        ) {
          if (item[key1] === state.currentCity[objValues[index]]) {
            areEqual.push(true);
          }
        }
      });
      if (areEqual.length === 2
        && !areEqual.includes(false)) {
        result = true;
      }
    });
    return result;
  }
}

export const weatherModel = new WeatherModel();
