const a = {
  name: 'carlotita',
  age: 4,
  color: 'black',
  lat: 5,
  lng: 5,
};

const arr = [{
  name: 'letito',
  age: 4,
  color: 'yellish',
  lat: 4,
  lng: 4,
},
{
  name: 'carlotita',
  age: 4,
  color: 'black',
  lat: 7,
  lng: 5,
},
{
  name: 'radamantis',
  age: 4,
  color: 'black-white',
  lat: 4,
  lng: 4,
},
];

/**
 *
 * @param {Array} arr
 * @param {object} obj
 */
function checkDuplicateCoords(arr, obj) {
  let result = false;
  const objValues = Object.keys(obj);

  arr.forEach((item) => {
    const isEqual = [];
    Object.keys(item).forEach((key1, index) => {
      if ((key1 === 'lat' && objValues[index] === 'lat')
       || (key1 === 'lng' && objValues[index] === 'lng')) {
        if (item[key1] === obj[objValues[index]]) {
          //
          isEqual.push(true);
        }
      }
    });
    if (isEqual.length === 2
      && !isEqual.includes(false)) {
      result = true;
    }
  });
  return result;
}
