import {
  map, tileLayer, marker, Map,
} from 'leaflet';
import { Weather } from './Weather';


export class MyMap {
  _accessToken = '6MBBGH7WycwgDzmY0slg0GYB65TuW2pdSFVErSykGpN59cAA0cpyC2KbzNoGovAQ';
  tileLayersProviders = {
    1: 'https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png',
    2: 'https://{s}.tile.jawg.io/jawg-light/{z}/{x}/{y}{r}.png?access-token=6MBBGH7WycwgDzmY0slg0GYB65TuW2pdSFVErSykGpN59cAA0cpyC2KbzNoGovAQ',
    3: 'https://{s}.tile.jawg.io/jawg-sunny/{z}/{x}/{y}{r}.png?access-token=6MBBGH7WycwgDzmY0slg0GYB65TuW2pdSFVErSykGpN59cAA0cpyC2KbzNoGovAQ',
  };
  weatherApi = new Weather();
  weatherCard = document.querySelector('.weather-data');

  constructor() {
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
    const rightOffSet = 2.2;

    this.weatherApi.fetchByCoords(latitude, longitude)
      .then((weatherData) => {
        this.appendWeatherCard(weatherData);
      });

    const myMap = map('map').setView([latitude, longitude + rightOffSet], 7);
    tileLayer(this.tileLayersProviders['3'], {
      attribution: '<a href="http://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank">&copy; <b>Jawg</b>Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      minZoom: 0,
      maxZoom: 22,
      subdomains: 'abcd',
    }).addTo(myMap);

    marker([latitude, longitude]).addTo(myMap);
    return myMap;
  }

  /**
   *
   * @param {Map} map
   */
  _registerClickHandler(map) {
    map.on('click', async (e) => {
      const { lat, lng } = e.latlng;

      const weatherData = await this.weatherApi.fetchByCoords(lat, lng).then((res) => res);

      this.appendWeatherCard(weatherData);
      console.log(weatherData);

      marker([lat, lng]).addTo(map);
      map.setView([lat, lng]);
    });
  }

  _createWeatherCard({
    main, sys, weather, name,
  }) {
    const {
      pressure, temp, humidity, sea_level: seaLevel,
    } = main;
    const { description, icon } = weather[0];

    return `
      <div class="weather-header">
        <figure>
          <img
            class="weather-image"
            src="https://openweathermap.org/img/w/${icon}.png"
            alt="openweather"
          />
        </figure>
        <h4 class="weather-title">${description}</h4>
      </div>

      <p><b>Ciudad</b>${name || 'desconocida'}, ${sys.country}</p>
      <p><b>Nivel del mar</b> ${seaLevel} m</p>
      <p><b>Temperatura</b> ${temp} °F </p>
      <p><b>Humedad</b> ${humidity} % </p>
      <p><b>Presion</b> ${pressure} Pa</p>
    `;
  }

  appendWeatherCard(weatherdata) {
    this.weatherCard.innerHTML = this._createWeatherCard(weatherdata);
  }

  async init() {
    try {
      const { latitude, longitude } = await this._getClientLocation();
      const map = this._loadMap(latitude, longitude);
      this._registerClickHandler(map);
    } catch (error) {
      console.log(error.message);
    }
  }
}
