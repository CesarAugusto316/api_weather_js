import {
  map, tileLayer, Marker,
} from 'leaflet';
import { leaftletMaps } from './apiConfigs';
import { weatherModel, state } from './WeatherModel';
import { MyMapView } from './views/MyMapView';
import { WeatherCityView } from './views/WeatherCityView';
import { FormView } from './views/FormView';
import { ThemeSelector } from './views/NavbarThemeSelector';


const { tileLayers, options } = leaftletMaps; // configurations

export class WeatherController {
  /** @type Array<Marker> */
  markers = [];
  /** @type Marker */
  currentMarker;
  currentWeatherCityData = state.currentCity;
  _initialZoom = 7;
  _theme = 1;
  // Views
  _weatherCardView = new WeatherCityView('.weather-data-card');
  _formView = new FormView('.form');
  _themeSelectorView = new ThemeSelector('.select__themes');
  _mapView = map('map'); // leafletMap


  constructor() {
    // REGISTERS EVENT_HANDLERS
    this._mapView.on('click', this._onClickMapHandler.bind(this));
    this._formView.addSubmitHandler(this._onSearchByNameFormInputHandler.bind(this));
    this._formView.addChangeHandler(this._onSearchByRegionFormInputHandler.bind(this));
    this._themeSelectorView.addChangeHandler(this._onSelectThemeHandler.bind(this));
  }


  /**
   *
   * @param {HashChangeEvent} e
   */
  _onSelectThemeHandler(e) {
    // @ts-ignore
    this._theme = +e.target.value;
    // weatherModel.deleteLocalStorage();
    this.init();
  }

  /**
   *
   * @param {import("leaflet").LeafletMouseEvent} e
   */
  _onClickMapHandler(e) {
    const { lat, lng } = e.latlng;
    this._renderOneMarker({ lat, lng });
    this._weatherCardView.showSpinner();

    weatherModel.fetchByCoords(lat, lng)
      .then((weatherData) => {
        this._weatherCardView
          .clearView()
          .generateMarkup(weatherData)
          .render();
      })
      .catch((error) => {
        this._weatherCardView
          .clearView()
          .showError(error.message);
      });
  }

  /**
   *
   * @param {HashChangeEvent} e
   */
  _onSearchByRegionFormInputHandler(e) {
    if (e.target === this._formView.inputSelect) {
      console.log(this._formView.inputSelect.value);
      const { value } = this._formView.inputSelect;
      this._weatherCardView
        .clearView()
        .showSpinner();
      weatherModel.fetchByCityName(value.trim())
        .then((weatherData) => {
          // this is different from _onSearchByNameFormInputHandler
          this._flyTo(weatherData, 4);
          this._weatherCardView
            .clearView()
            .generateMarkup(weatherData)
            .render();
        })
        .catch((error) => {
          this._weatherCardView
            .clearView()
            .showError(error.message);
        });
    }
  }

  /**
   *
   * @param {SubmitEvent} e
   */
  _onSearchByNameFormInputHandler(e) {
    e.preventDefault();
    if (e.target) {
      const { value } = this._formView.inputCityCountry;
      this._formView.inputCityCountry.value = '';
      this._weatherCardView
        .clearView()
        .showSpinner();
      weatherModel.fetchByCityName(value.trim())
        .then((weatherData) => {
          this._flyTo(weatherData);
          this._weatherCardView
            .clearView()
            .generateMarkup(weatherData)
            .render();
        })
        .catch((error) => {
          this._weatherCardView
            .clearView()
            .showError(error.message);
        });
    }
  }

  _onBookMarkedHandler() {}
  _onTrashedHandler() {}

  /**
   *
   * @param {import('./WeatherModel').WeatherData} weatherData
   */
  _flyTo(weatherData, zoom = 9) {
    const { lat, lng } = weatherData;
    this._mapView.flyTo([lat, lng], zoom);
    this.currentMarker = new Marker({ lat, lng }, { draggable: false });
    this.markers.forEach((m) => this._mapView.removeLayer(m));
    this.markers = [this.currentMarker];
    this._mapView.addLayer(this.currentMarker);
  }

  /**
   *
   * @param {{lat: number, lng: number}} latlng
   */
  _renderOneMarker({ lat, lng }) {
    this.currentMarker = new Marker({ lat, lng }, { draggable: false });
    this.markers.forEach((m) => this._mapView.removeLayer(m));
    this.markers = [this.currentMarker];
    this._mapView.addLayer(this.currentMarker).setView([lat, lng]);
    console.log('render all markers:', this.markers);
  }

  _renderAllMarkers({ lat, lng }) {}

  /**
   *
   * @description When the App first loads, it reads 'cities' from
   * localStorage (if available) or fetches new 'cities' data from the Apis
   * defined in WeatherModel using the client's currentLocation.
   */
  init() {
    weatherModel.getClientLocation()
      .then(({ latitude, longitude }) => {
        this._mapView.setView([latitude, longitude], this._initialZoom);

        tileLayer(tileLayers[this._theme], options).addTo(this._mapView); // loads the map's Layer
        return { latitude, longitude };
      })
      .then(({ latitude, longitude }) => {
        const cities = weatherModel.readLocalStorage(); // synchronous

        if (cities?.length > 0) {
          console.log('hello from localStorage:', cities);

          cities.forEach((weatherData) => {
            this._renderOneMarker(weatherData);
          });
          // now we render only the last weatherCityCardView
          this._weatherCardView
            .clearView()
            .generateMarkup(cities[cities.length - 1])
            .render();
        } else {
          // if no Data in LocalStorage we fetch data from the apis.
          weatherModel.fetchByCoords(latitude, longitude)
            .then((weatherData) => {
              console.log('hello from weatherApi:', weatherData);

              this._renderOneMarker(weatherData);
              this._weatherCardView
                .clearView()
                .generateMarkup(weatherData)
                .render();

              return weatherData;
            })
            .then((weatherData) => {
              weatherModel.updateLocalStorage([weatherData]);
            })
            .catch((error) => {
              this._weatherCardView
                .clearView()
                .showError(error.message);
            });
        }
      })
      .catch((error) => {
        new MyMapView('#map').showError(error.message);
      });
  }
}


