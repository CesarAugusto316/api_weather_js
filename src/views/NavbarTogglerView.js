/* eslint-disable max-classes-per-file */
import { View } from './View.abstract.class';


/**
 *
 * @description MenuBar that is absolute positioned in relation
 * to NavbarTogglerView instance, when .navbar__toggle-button is
 * click we render a collections in cities from localStorage
 */
class NavbarMenuView extends View {
  /**
   * @override
   * @param {Array<import('../WeatherModel').WeatherData>}fromLocalStorage
   */
  generateMarkup(fromLocalStorage) {
    const menuItemsMarkup = fromLocalStorage.map((item) => `
      <div class="navbar__menu-item" title="ver marcador">
        <span class="text-ellipsis">
          ${item.name}
        </span>
        <i class="fa-solid fa-trash-can" title="borrar marcador"></i>
      </div>
    `).join('');

    this.markup = `
    ${menuItemsMarkup}
 
    <div
        class="navbar__menu-item navbar__menu-item--see-all"
        title="ver todos los marcadores">
        Ver Todos
      </div>
    `;
    return this;
  }
}

export class NavbarTogglerView extends View {
  navbarMenu = new NavbarMenuView('.navbar__menu');
  toggleButton = this._$('.nabvar__toggle-botton-CTA');
}
