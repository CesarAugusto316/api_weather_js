import {
  map, tileLayer, Marker, control,
} from 'leaflet';
import { leaftletMaps } from './apiConfigs';
import { weatherModel, state } from './WeatherModel';
import {
  FormView, MyMapView, ThemeSelector, WeatherCityView,
} from './views';


const { tileLayers, options } = leaftletMaps; // configurations

export class WeatherController {
  _layersThemes = {
    1: tileLayer(tileLayers[1], options),
    2: tileLayer(tileLayers[2], options),
    3: tileLayer(tileLayers[3], options),
    4: tileLayer(tileLayers[4]),
  };
  // for tileLayer selector-control (themes)
  _baseMaps = {
    Light: this._layersThemes[1],
    Sunny: this._layersThemes[2],
    Cheerfull: this._layersThemes[3],
    Dark: this._layersThemes[4],
  };
  // Views
  _weatherCardView = new WeatherCityView('.weather-data-card');
  _formView = new FormView('.form');
  _themeSelectorView = new ThemeSelector('.select__themes');
  _mapView = map('map', {
    zoom: 7,
    layers: [
      this._layersThemes[1], // initial theme
    ],
    minZoom: 3,
    maxZoom: 19,
    zoomControl: false,
  }).addControl(control.zoom({ position: 'bottomleft' }));


  constructor() {
    // registering eventHandlers
    this._mapView.on('click', this._onClickMapHandler.bind(this));
    this._formView.addSubmitHandler(this._onSearchByNameFormInputHandler.bind(this));
    this._formView.addChangeHandler(this._onSearchByRegionFormInputHandler.bind(this));
    this._weatherCardView.addClickHandler(this._onBookMarkedHandler.bind(this));
    this._weatherCardView.addClickHandler(this._onTrashedHandler.bind(this));
    this._themeSelectorView.addChangeHandler(this._onSelectThemeHandler.bind(this));
  }

  /**
   *
   * @param {HashChangeEvent} e
   */
  _onSelectThemeHandler(e) {
    // @ts-ignore
    const theme = e.target.value;
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else if (theme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
    }
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
      const { value } = this._formView.inputSelect;
      this._weatherCardView
        .clearView()
        .showSpinner();
      weatherModel.fetchByCityName(value.trim())
        .then((weatherData) => {
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

  /**
   * @description sideEffect function
   *
   * @param {MouseEvent} e
   */
  _onBookMarkedHandler(e) {
    // @ts-ignore
    if (e.target.closest('.fa-bookmark')) {
      state.cities.push({ ...state.currentCity });
      weatherModel.writeToLocalStorage();
    }
  }

  /**
   *
   * @param {MouseEvent} e
   */
  _onTrashedHandler(e) {
    // @ts-ignore
    if (e.target.closest('.fa-trash-can')) {
      // console.log(this._weatherCardView);
    }
  }

  /**
   * @description sideEffect function
   *
   * @param {import('./WeatherModel').WeatherData} weatherData
   */
  _flyTo(weatherData, zoom = 9) {
    const { lat, lng } = weatherData;
    this._mapView.flyTo([lat, lng], zoom);
    state.currentMarker = new Marker({ lat, lng }, { draggable: false });
    state.markers.forEach((m) => this._mapView.removeLayer(m));
    state.markers = [state.currentMarker];
    this._mapView.addLayer(state.currentMarker);
  }

  /**
   * @description sideEffect function
   *
   * @param {{lat: number, lng: number}} latlng
   */
  _renderOneMarker({ lat, lng }) {
    state.currentMarker = new Marker({ lat, lng }, { draggable: false });
    state.markers.forEach((m) => this._mapView.removeLayer(m));
    state.markers = [state.currentMarker];
    this._mapView.addLayer(state.currentMarker).setView([lat, lng]);
  }

  /**
   *  @description sideEffect function
   *
   * @param {{lat: number, lng: number}} latlng
   */
  _renderManyMarkers({ lat, lng }) {
    state.currentMarker = new Marker({ lat, lng }, { draggable: false });
    state.markers.push(state.currentMarker);
    this._mapView.addLayer(state.currentMarker).setView([lat, lng]);
  }

  _logger() {
    // console.log('weatherData from weatherApi:', weatherData);
    console.log('state.currentCity:', state.currentCity);
    console.log('state.cities:', state.cities);
    console.log('this.currentMarker:', state.currentMarker);
    console.log('this.markers:', state.markers);
    console.log('hello from localStorege, cities:', state.citiesFromLocalStorage);
  }

  /**
   *
   * @description When the App first loads, it reads 'cities' from
   * localStorage (if available) or fetches new 'cities' data from the Apis
   * defined in WeatherModel using the client's currentLocation.
   * @return void
   */
  init() {
    weatherModel.getClientLocation()
      .then(({ latitude, longitude }) => {
        this._mapView.setView([latitude, longitude]);
        control.layers(this._baseMaps).addTo(this._mapView)
          .setPosition('bottomright');
        return { latitude, longitude };
      })
      .then(({ latitude, longitude }) => {
        weatherModel.readFromLocalStorage(); // update
        if (state.citiesFromLocalStorage?.length > 0) {
          // console.log('hello from localStorage:', cities);
          // console.log('hello from markers:', this.markers);
          state.citiesFromLocalStorage.forEach((weatherData) => {
            this._renderManyMarkers(weatherData);
          });
          // now we render only the last weatherCityCardView
          this._weatherCardView
            .clearView()
            .generateMarkup(state.currentCity)
            .render();

          // we keep track of cities from localstorage
          // state.cities = cities;
          // state.currentCity = cities[cities.length - 1];
        } else {
          // if no Data in LocalStorage we fetch data from the apis.
          weatherModel.fetchByCoords(latitude, longitude)
            .then((weatherData) => {
              this._renderOneMarker(weatherData);
              this._weatherCardView
                .clearView()
                .generateMarkup(weatherData)
                .render();

              // state.currentCity = weatherData;
              // this._handleState(weatherData);

              this._logger();
              return weatherData;
            })
            // .then((weatherData) => {
            //   weatherModel.updateLocalStorage([weatherData]);
            // })
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
