import axios from 'axios';
import { openWeatherMaps } from '../apiConfigs';
import { View } from './View';


const { apiUrl, appId } = openWeatherMaps;

export class WeatherCity extends View {
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
}
