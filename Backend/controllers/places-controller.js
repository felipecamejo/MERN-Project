const { v4: uuidv4 } = require('uuid');

const { validationResult } = require('express-validator');

const HttpError = require('./../models/http-error');
const getCoordsForAddress = require('../util/location');

const Place = require('./../models/place');

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

const  getPlaceById =  async (req, res, next) => {

  const placeId = req.params.pid;
  
  let place;

  try{
    place = await Place.findById(placeId);
  } catch(err){
    const error = new HttpError(
      'Something went wrong, could not find a place.',
      500
    );
    return next(error);
  }
  

  if (!place) {
    const error = new HttpError('Could not find a place for the provided id.', 404); 
    return next(error);
  }

  res.json({place: place.toObject({getters: true}) });
}

const getPlacesByUserId = async (req, res, next) => {
  const userId = req.params.uid;

  let places; 

  try{
    places = await Place.find({creator: userId});
  } catch(err){
    console.log(err);
    const error = new HttpError(
      'Fetching places failed, please try again later',
      500
    );
    return next(error);
  }

  if (!places || places.length === 0) {
    return next(new HttpError('Could not find places for the provided user id.', 404));
  }

  res.json({places: places.map(p => p.toObject({getters: true}))});
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

  const createPlace = new Place({
    title, 
    description,
    address,
    location: coordinates,
    image: 'https://media.istockphoto.com/id/486334510/es/foto/edificios-de-la-ciudad-de-nueva-york.jpg?s=612x612&w=0&k=20&c=N_x_BnbJXBufDcVVCz1s1A26Q84isBpbozbb9yXS9Us=',
    creator,
  })

  try {
    await createPlace.save();
  } catch(err) {
    const error = new HttpError (
      'Creating place failed, please try again.',
      500
    );
    return next(error);
  }

  
  res.status(201).json({place: createPlace});
};

const updatePlaceById = async (req, res, next) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()){
    console.log(errors);
    throw new HttpError('Invalid inputs passed, please check your data.',422);
  }

  const {title, description} = req.body;
  const placeId = req.params.pid;

  let place;

  try{
    place = await Place.findById(placeId);
  }catch (err){
    const error = new HttpError('Something went wrong, could not update place', 500);
    return next(error);
  }

  place.title = title;
  place.description = description;

  try {
    await place.save();
  } catch (err) {
    const error = new HttpError('Something went wrong, could not update place', 500);
    return next(error);
  }



  res.status(200).json({place: place.toObject({getters: true})});

};

const deletePlaceById = async (req, res, next) => {
  const placeId = req.params.pid;

  let place;

  try{
    place = await Place.findByIdAndDelete(placeId);
  }catch (err){
    console.log(err);
    const error = new HttpError('Something went wrong, could not delete place', 500);
    return next(error);
  }

  res.status(200).json({message: 'Deleted place. Id:' + placeId})
};

exports.deletePlaceById = deletePlaceById;
exports.updatePlaceById = updatePlaceById;
exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;

