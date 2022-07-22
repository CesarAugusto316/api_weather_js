import { View } from './View.abstract.class';

/**
 *
 * @description controls the rendring of the card component
 * with data about its weather
 */
export class WeatherCityView extends View {
  /**
   *
   * @param {import('../WeatherModel').WeatherData} weatherData
   */
  generateMarkup(weatherData) {
    const {
      pressure, temp, humidity, seaLevel, description, icon, country, name,
    } = weatherData;

    this.markup = `
      <div>
       <span class="weather-card__icons font-2">
        <i class="fa-solid fa-bookmark"></i>
        <i class="fa-solid fa-trash-can"></i>
       </span> 
      </div> 
      <div class="weather-card__header">
        <figure>
          <img
            class="weather-card__image"
            src="https://openweathermap.org/img/w/${icon}.png"
            alt="openweather"
          />
        </figure>
        <h4 class="weather-card__title">${description}</h4>
      </div>

      <p><b>Ciudad</b>${name || 'desconocida'}, ${country || ''}</p>
      <p><b>Nivel del mar</b> ${seaLevel || 0} m</p>
      <p><b>Temperatura</b> ${temp} °F </p>
      <p><b>Humedad</b> ${humidity || 0} % </p>
      <p><b>Presion</b> ${pressure} Pa</p>
    `;

    return this;
  }
}
