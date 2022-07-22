// @ts-nocheck
export const leaftletMaps = {
  tileLayers: {
    1: 'https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png',
    2: `https://{s}.tile.jawg.io/jawg-light/{z}/{x}/{y}{r}.png?access-token=${import.meta.env.VITE_MAP_ACCESS_TOKEN}`,
    3: `https://{s}.tile.jawg.io/jawg-sunny/{z}/{x}/{y}{r}.png?access-token=${import.meta.env.VITE_MAP_ACCESS_TOKEN}`,
    4: `https://{s}.tile.jawg.io/jawg-terrain/{z}/{x}/{y}{r}.png?access-token=${import.meta.env.VITE_MAP_ACCESS_TOKEN}`,
  },
  options: {
    attribution: `
      <a href="http://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank">
        &copy; <b>Jawg</b>Maps</a> &copy; 
      <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>`,
    minZoom: 3,
    maxZoom: 19,
    subdomains: 'abcd',
  },
};

export const openWeatherMaps = {
  appId: import.meta.env.VITE_API_APPID,
  apiUrl: import.meta.env.VITE_API_URL,
};
