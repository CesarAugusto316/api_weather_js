import { View } from './View.abstract.class';


/**
 *
 * @description NavbarMenu that is absolute positioned in relation
 * to NavbarTogglerView instance, when .navbar__toggle-button is
 * click we render a collections in cities from localStorage
 */
class NavbarMenuView extends View {
  /**
   *
   * @override
   * @param {Array<import('../WeatherModel').WeatherData>}fromLocalStorage
   */
  generateMarkup(fromLocalStorage) {
    if (fromLocalStorage.length === 0) {
      this.markup = `
        <div>No hay marcadores</div>
      `;
    } else {
      const menuItemsMarkup = fromLocalStorage.map((item, index, arr) => `
        <div data-index="${index}" class="navbar__menu-item 
        ${index === arr.length - 1 ? 'navbar__menu-item--last-item' : ''}" 
        title="ver marcador">
          <span class="text-ellipsis">
            ${item.name}
          </span>
          <i class="fa-solid fa-trash-can" title="borrar marcador"></i>
        </div>
      `).join('');

      this.markup = `
      ${menuItemsMarkup}
        <div
          class="navbar__menu-item--see-all"
          title="ver todos los marcadores">
            Ver Todos
        </div>
      `;
    }
    return this;
  }
}

export class NavbarTogglerView extends View {
  navbarMenu = new NavbarMenuView('.navbar__menu');
  toggleButton = this.$('.nabvar__toggle-botton-CTA');
}
