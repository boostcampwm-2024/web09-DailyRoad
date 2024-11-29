import { http, HttpResponse, passthrough } from 'msw';
import { faker } from '@faker-js/faker';

function getRandomInRange(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

const googleMapsHandler = http.all('*', ({ request }) => {
  const url = new URL(request.url);
  if (url.hostname.includes('maps.googleapis.com')) {
    return passthrough();
  }
});

const placeHandler = http.get('http://localhost:5173/places', ({ request }) => {
  const url = new URL(request.url);
  const search = url.searchParams.get('search') || 'Place';
  const page = parseInt(url.searchParams.get('page') || '1', 10);

  const places = Array.from({ length: 5 }, (_, i) => ({
    id: faker.number.int({ min: 1, max: 1000 }),
    name: `${search} ${i + 1 + (page - 1) * 5}`,
    location: {
      lat: getRandomInRange(34, 39),
      lng: getRandomInRange(124, 132),
    },
    google_place_id: faker.string.uuid(),
    detail_page_url: faker.internet.url(),
    thumbnail_url: faker.image.urlLoremFlickr({
      category: 'city',
      width: 200,
      height: 200,
    }),
    rating: parseFloat((Math.random() * 5).toFixed(1)),
    formed_address: faker.location.streetAddress(),
  }));

  const results = places;

  return HttpResponse.json({ results });
});

export const handlers = [googleMapsHandler, placeHandler];
