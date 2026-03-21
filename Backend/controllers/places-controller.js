const { v4: uuidv4 } = require('uuid');

const HttpError = require('./../models/http-error');

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
]

const  getPlaceById = (req, res, next) => {

  const placeId = req.params.pid;

  const place = DUMMY_PLACES.find(p => {
    return p.id === placeId
  });

  if (!place) {
    throw new HttpError('Could not find a place for the provided id.', 404); 
  }

  res.json({place});
}

const getPlacesByUserId = (req, res, next) => {
  const userId = req.params.uid;

  const places = DUMMY_PLACES.filter(p => {
    return p.creator === userId;
  });

  if (!places || places.length === 0) {
    return next(new HttpError('Could not find a place for the provided user id.', 404));
  }

  res.json({places});
}

const createPlace = (req, res, next) => {
  const {title, description, coordinates, address, creator} = req.body;

  const createPlace = {
    id: uuidv4(),
    title: title,
    description: description,
    location: coordinates,
    address: address,
    creator, creator, 
  };

  DUMMY_PLACES.push(createPlace);

  res.status(201).json({place: createPlace});
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;

