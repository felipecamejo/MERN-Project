const { v4: uuidv4 } = require('uuid');

const fs = require('fs');

const { validationResult } = require('express-validator');

const HttpError = require('./../models/http-error');
const getCoordsForAddress = require('../util/location');

const Place = require('../models/place');

const User = require('../models/user');

const mongoose = require('mongoose');

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
    image: req.file.path,
    creator,
  })

  let user;

  if (!mongoose.Types.ObjectId.isValid(creator)) {
    const error = new HttpError('Could not find user for the provided id.', 404);
    return next(error);
  }

  try {
    user = await User.findById(creator);
  } catch (err) {
    const error = new HttpError('Creating place failed, please try again', 500);
    return next(error);
  }

  if (!user) {
    const error = new HttpError ('Could not find user for the provided id.', 404);
    return next(error);
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createPlace.save({session: sess});

    user.places.push(createPlace);
    await user.save({session: sess})

    await sess.commitTransaction();
  } catch(err) {
    console.log(err);
    const error = new HttpError (
      
      'Creating place failed, please try again.',
      500
    );
    return next(error);
  }

  res.status(201).json({place: createPlace.toObject({getters: true})});
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

  if (place.creator !== req.userData.userId) {
    const error = new HttpError(
        'You are not allowed to edit this place.', 
        401
    );
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
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    console.log(err);
    const error = new HttpError('Something went wrong, could not find place for deletion', 500);
    return next(error);
  }

  if (!place) {
    const error = new HttpError('Could not find place for this id.', 404);
    return next(error);
  }
   
  const imagePath = place.image;

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();

    await User.findByIdAndUpdate(place.creator, { $pull: { places: placeId } }, { session: sess });
    await Place.findByIdAndDelete(placeId, { session: sess });
    await sess.commitTransaction();
  } catch (err) {
    console.log(err);
    const error = new HttpError('Something went wrong, could not delete place', 500);
    return next(error);
  }

  fs.unlink(imagePath, err => {
    console.log(err);
  });

  res.status(200).json({message: 'Deleted place. Id:' + placeId})
};

exports.deletePlaceById = deletePlaceById;
exports.updatePlaceById = updatePlaceById;
exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;

