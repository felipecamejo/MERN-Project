import React from 'react';
import { useParams } from 'react-router-dom';

import PlaceList from '../components/PlaceList';

const DUMMY_PLACES = [
  {
    id: 'p1',
    title: 'Empire State Building',
    description: 'One of the most famouse sky scrapes in the world',
    image: 'https://media.istockphoto.com/id/486334510/es/foto/edificios-de-la-ciudad-de-nueva-york.jpg?s=612x612&w=0&k=20&c=N_x_BnbJXBufDcVVCz1s1A26Q84isBpbozbb9yXS9Us=',
    address: '20 W 34th St., New York, NY 10001',
    location: {
      lat: 40.7484405, 
      lng: -73.9882393,
    },
    creator: 'u1',
  },
  {
    id: 'p2',
    title: 'Empire State Building',
    description: 'One of the most famouse sky scrapes in the world',
    image: 'https://media.istockphoto.com/id/486334510/es/foto/edificios-de-la-ciudad-de-nueva-york.jpg?s=612x612&w=0&k=20&c=N_x_BnbJXBufDcVVCz1s1A26Q84isBpbozbb9yXS9Us=',
    address: '20 W 34th St., New York, NY 10001',
    location: {
      lat: 40.7484405, 
      lng: -73.9882393,
    },
    creator: 'u2',
  }
]

const UserPlaces = () => {
  const userId = useParams().userId;
  const loadedPlaces = DUMMY_PLACES.filter(place => place.creator === userId);

  return <PlaceList items={loadedPlaces}/>
};

export default UserPlaces;