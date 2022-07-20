import axios from 'axios';
import { openWeatherMaps } from './apiConfigs';


const { apiUrl, appId } = openWeatherMaps;

class WeatherModel {
  state = {
    cities: [],
    currCountry: '',
    currCity: {
      description: '',
      lang: 'es',
      coords: {
        lat: '',
        lon: '',
      },
      seaLevel: '',
      temp: '',
      pressure: '',
      humidity: '',
    },
  };

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
   * @param {number} lat
   * @param {number} lon
   */
  async fetchByCoords(lat, lon) {
    try {
      const { data } = await axios.get(apiUrl, {
        params: {
          lang: 'es',
          lat,
          lon,
          appid: appId,
        },
      });
      return data;
    } catch (error) {
      return console.log(error.message);
    }
  }

  /**
   *
   * @param {string} q
   */
  async fetchByCityName(q) {
    try {
      const { data } = await axios.get(apiUrl, {
        params: {
          q,
          appid: appId,
        },
      });
      return data;
    } catch (error) {
      return console.log(error.message);
    }
  }


  setLocalStorage() {}

  getLocalStorage() {}
}


export const model = new WeatherModel();
