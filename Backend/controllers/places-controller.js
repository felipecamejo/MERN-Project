const { v4: uuidv4 } = require('uuid');

const { validationResult } = require('express-validator');

const HttpError = require('./../models/http-error');
const getCoordsForAddress = require('../util/location');

let DUMMY_PLACES = [
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
    return next(new HttpError('Could not find places for the provided user id.', 404));
  }

  res.json({places});
}

const createPlace = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()){
    console.log(errors);
    return next(new HttpError('Invalid inputs passed, please check your data.',422));
  }

  const {title, description, address, creator} = req.body;

  let coordinates;
  try {
    coordinates = await getCoordsForAddress(address);
  } catch (error) {
    return next(error);
  }

  const createPlace = {
    id: uuidv4(),
    title,
    description,
    location: coordinates,
    address,
    creator, 
  };

  DUMMY_PLACES.push(createPlace);

  res.status(201).json({place: createPlace});
};

const updatePlaceById = (req, res, next) => {

  const errors = validationResult(req);

  if (!errors.isEmpty()){
    console.log(errors);
    throw new HttpError('Invalid inputs passed, please check your data.',422);
  }

  const {title, description} = req.body;

  if (!title || !description) {
    throw new HttpError('Title and description are required.', 400);
  }

  const placeId = req.params.pid;

  const place = {...DUMMY_PLACES.find(p => p.id === placeId)};

  if (!place) {
    throw new HttpError('Could not find a place for the provided place id.', 404);
  }

  place.title = title;
  place.description = description;

  const placeIndex = DUMMY_PLACES.findIndex(p => p.id === placeId);

  DUMMY_PLACES[placeIndex] = place;

  res.status(200).json({place: place});

};

const deletePlaceById = (req, res, next) => {

  const placeId = req.params.pid;
  if (!DUMMY_PLACES.find(p => p.id !== placeId)) {
    throw new HttpError('Could not find a place for that id', 404);
  }

  DUMMY_PLACES = DUMMY_PLACES.filter(p => p.id !== placeId);

  res.status(200).json({message: 'Deleted place. Id:' + placeId})
};

exports.deletePlaceById = deletePlaceById;
exports.updatePlaceById = updatePlaceById;
exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;

