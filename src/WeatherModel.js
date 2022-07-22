import axios from 'axios';
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
 *
 * @description Global State Object for the App.
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
      return weatherData;
    } catch (error) {
      console.log(error.message);
      return error;
    }
  }

  /**
   *
   * @param {Array<WeatherData>} weatherCities
   */
  updateLocalStorage(weatherCities) {
    const cities = JSON.stringify(weatherCities);
    localStorage.setItem('cities', cities);
  }

  /**
   *
   * @return {Array<WeatherData>}
   */
  readLocalStorage() {
    /** @type Array<WeatherData> */
    const cities = JSON.parse(localStorage.getItem('cities'));
    return cities;
  }

  deleteLocalStorage() {
    localStorage.removeItem('cities');
    location.reload();
  }
}

export const weatherModel = new WeatherModel();
