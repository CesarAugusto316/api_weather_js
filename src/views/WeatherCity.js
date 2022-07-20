import { View } from './View';


export class WeatherCity extends View {
  generateMarkup({
    main, sys, weather, name,
  }) {
    const {
      pressure, temp, humidity, sea_level: seaLevel,
    } = main;
    const { description, icon } = weather[0];

    this._markup = `
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

    return this;
  }
}
