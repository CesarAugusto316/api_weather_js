import { leaftletMaps, openWeatherMaps } from './apiConfigs';

const { apiUrl, appId } = openWeatherMaps;

class Model {
  globalState = {
    weatherCities: [],
    currCountry: '',
    currWeatherCity: {
      description: '',
      lang: 'es',
      coords: {
        lat: '',
        lon: '',
      },
    },
  };

  fetchweatherData() {}

  getClientLocation() {}

  setLocalStorage() {}

  getLocalStorage() {}
}


export const model = new Model();
