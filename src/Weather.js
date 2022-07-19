// @ts-nocheck
import axios from 'axios';


export class Weather {
  _apiUrl = import.meta.env.VITE_API_URL;
  _appId = import.meta.env.VITE_API_APPID;


  /**
   *
   * @param {number} lat
   * @param {number} lon
   */
  async fetchByCoords(lat, lon) {
    try {
      const { data } = await axios.get(this._apiUrl, {
        params: {
          lang: 'es',
          lat,
          lon,
          // q,
          appid: this._appId,
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
      const { data } = await axios.get(this._apiUrl, {
        params: {
          q,
          appid: this._appId,
        },
      });
      return data;
    } catch (error) {
      return console.log(error.message);
    }
  }
}
