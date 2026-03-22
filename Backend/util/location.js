const fetch = require('node-fetch');

async function getCoordsForAddress(address) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'mern-project/1.0 (your@email.com)'
    }
  });
  const data = await response.json();
  if (!data || data.length === 0) {
    throw new Error('No se encontraron coordenadas para la dirección.');
  }
  return {
    lat: parseFloat(data[0].lat),
    lng: parseFloat(data[0].lon)
  };
}

module.exports = getCoordsForAddress;