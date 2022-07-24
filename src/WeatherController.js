import {
  map, tileLayer, Marker, control,
} from 'leaflet';
import { leaftletMaps } from './apiConfigs';
import { weatherModel, state } from './WeatherModel';
import {
  FormView, MyMapView, ThemeSelectorView, WeatherCityView, NavbarTogglerView,
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
  _themeSelectorView = new ThemeSelectorView('.select__themes');
  _navbarTogglerView = new NavbarTogglerView('.navbar__toggle-button');
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
    // registering eventHandlers for the entire app.
    this._mapView.on('click', this._onClickMapHandler.bind(this));
    this._formView.addSubmitHandler(this._onSearchByNameFormInputHandler.bind(this));
    this._formView.addChangeHandler(this._onSearchByRegionFormInputHandler.bind(this));
    this._weatherCardView.addClickHandler(this._onBookMarkedHandler.bind(this));
    this._themeSelectorView.addChangeHandler(this._onSelectThemeHandler.bind(this));
    this._navbarTogglerView.addClickHandler(this._onToggleNavbarButton.bind(this));
    this._navbarTogglerView.navbarMenu.addClickHandler(this._onTrashBtnClickHandler.bind(this));
    this._navbarTogglerView.navbarMenu.addClickHandler(this._onMenuItemClickHandler.bind(this));
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
   *
   * @param {import('./WeatherModel').WeatherData} weatherData
   */
  _flyTo(weatherData, zoom = 9) {
    const { lat, lng } = weatherData;
    this._mapView.flyTo([lat, lng], zoom);
    this._syncMarkers({ lat, lng });
    this._mapView.addLayer(state.currentMarker);
  }

  /**
   *
   * @description helper function
   * @param {{lat: number, lng: number}} latlng
   */
  _syncMarkers({ lat, lng }) {
    state.currentMarker = new Marker({ lat, lng }, { draggable: false });
    state.markers.forEach((m) => this._mapView.removeLayer(m)); // removes all previous markers
    state.markers = [state.currentMarker];
  }

  /**
   *
   * @description it always keeps only one Marker
   * in Markers Array
   * @param {{lat: number, lng: number}} latlng
   */
  _renderOneMarker({ lat, lng }) {
    this._syncMarkers({ lat, lng });
    this._mapView.addLayer(state.currentMarker).setView([lat, lng]);
  }

  /**
   *
   * @param {{lat: number, lng: number}} latlng
   */
  _renderAllMarkers({ lat, lng }) {
    state.currentMarker = new Marker({ lat, lng }, { draggable: false });
    state.markers.push(state.currentMarker);
    this._mapView.addLayer(state.currentMarker).setView([lat, lng]);
  }

  /**
   *
   * @description helper function
   * @param {import('./WeatherModel').WeatherData} weatherData
   */
  _renderCardAndMenu(weatherData) {
    this._weatherCardView
      .clearView()
      .generateMarkup(weatherData)
      .render();

    this._navbarTogglerView
      .navbarMenu
      .clearView()
      .generateMarkup(state.citiesFromLocalStorage)
      .render();
  }

  /**
   *
   * @description before writing to localStorage,
   * we first need to read if there is any value in localStorage, so we
   * can not loose our localData.
   *
   * @param {MouseEvent} e
   */
  _onBookMarkedHandler(e) {
    // @ts-ignore
    if (e.target.closest('.fa-bookmark')) {
      const duplicates = weatherModel.checkDuplicateCoords();

      if (duplicates) {
        console.log('there are duplicates', duplicates);
        console.log('we can not store your data 😓.');
      } else {
        let cities = weatherModel.readFromLocalStorage();
        cities = [...cities, state.currentCity];
        weatherModel.writeToLocalStorage(cities);
        const newCities = weatherModel.readFromLocalStorage();

        this._navbarTogglerView.navbarMenu
          ._parentElement
          .classList.remove('hidden');

        setTimeout(() => {
          this._navbarTogglerView
            .navbarMenu
            .clearView()
            .generateMarkup(state.citiesFromLocalStorage)
            .render();

          this._navbarTogglerView.navbarMenu._$('.navbar__menu-item--last-item')
            .classList.add('font-succes');
        }, 100);

        setTimeout(() => {
          this._navbarTogglerView.navbarMenu
            ._parentElement
            .classList.add('hidden');

          this._navbarTogglerView.navbarMenu._$('.navbar__menu-item--last-item')
            .classList.remove('font-succes');
        }, 1_400);

        console.log('there no are duplicates', duplicates);
        console.log('we can store your data, 😃, cities added', newCities);
      }
    }
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
   * @param {MouseEvent} e
   */
  _onToggleNavbarButton(e) {
    // @ts-ignore
    if (e.target.closest('.nabvar__toggle-botton-CTA')) {
      this._navbarTogglerView.navbarMenu
        ._parentElement
        .classList.toggle('hidden');
    }
  }

  /**
   *
   * @param {MouseEvent} e
   */
  _onMenuItemClickHandler(e) {
    // @ts-ignore
    if (e.target.closest('.navbar__menu-item') && !e.target.closest('.fa-trash-can')) {
      // @ts-ignore
      const menuItem = e.target.closest('.navbar__menu-item');
      const { index } = menuItem.dataset;

      this._flyTo(state.citiesFromLocalStorage[index]);
    }
  }

  /**
   *
   * @param {MouseEvent} e
   */
  _onTrashBtnClickHandler(e) {
    // @ts-ignore
    if (e.target.closest('.fa-trash-can')) {
      // @ts-ignore
      const menuItem = e.target.closest('.navbar__menu-item');
      const { index } = menuItem.dataset;
      if (state.citiesFromLocalStorage.length > 1) {
        state.citiesFromLocalStorage = state
          .citiesFromLocalStorage
          .filter((city) => city !== state.citiesFromLocalStorage[index]);
        weatherModel.writeToLocalStorage(state.citiesFromLocalStorage);
        const cities = weatherModel.readFromLocalStorage();
        this._renderCardAndMenu(cities[cities.length - 1]);
        this._renderOneMarker(cities[cities.length - 1]);
      } else {
        state.citiesFromLocalStorage = [];
        weatherModel.writeToLocalStorage(state.citiesFromLocalStorage);
        weatherModel.getClientLocation()
          .then(({ latitude, longitude }) => {
            weatherModel.fetchByCoords(latitude, longitude)
              .then((weatherData) => {
                this._renderOneMarker(weatherData);
                this._renderCardAndMenu(weatherData);
              })
              .catch((error) => {
                this._weatherCardView
                  .clearView()
                  .showError(error.message);
              });
          });
      }
    }
  }

  /**
   *
   * @description use during development
   */
  _logger() {
    console.log('state: currentCity', state.currentCity);
    console.log('state: currentMarker:', state.currentMarker);
    console.log('state: cities:', state.cities);
    console.log('state: markers:', state.markers);
    console.log('state: cities from localStorage:', state.citiesFromLocalStorage);
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
        weatherModel.readFromLocalStorage(); // syncs state as well

        if (state.citiesFromLocalStorage?.length > 0) {
          console.log('hello from localStorage');

          state.citiesFromLocalStorage.forEach((weatherData) => {
            this._renderAllMarkers(weatherData);
          });
          const latestCity = state.citiesFromLocalStorage[
            state.citiesFromLocalStorage.length - 1
          ];

          this._renderCardAndMenu(latestCity);
          state.currentCity = latestCity;
        } else {
          // if no Data in LocalStorage we fetch data from the apis.
          console.log('hello from weather API');
          weatherModel.fetchByCoords(latitude, longitude)
            .then((weatherData) => {
              this._renderOneMarker(weatherData);
              this._renderCardAndMenu(weatherData);
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
      })
      .finally(() => {
        this._logger();
      });
  }
}
