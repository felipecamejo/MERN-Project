const HttpError = require('./../models/http-error');

const User = require('../models/user');

const { validationResult } = require('express-validator');

const getUsers = async(req, res, next) => {
  let users;
  try {
    users = await User.find({}, '-password');
  }catch (err){
    const error = new HttpError('Fetching users failed, please try again later', 500);
    return next(error);
  }

  res.json({users: users.map(u => u.toObject({getters: true}))});
 
};

const singup = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()){
    console.log(errors);
    return next(
      new HttpError('Invalid inputs passed, please check your data.',422)
    );
  }
  const {name, email, password} = req.body;

  let existingUser

  try {
    existingUser = await User.findOne({email: email});
  }catch(err) {
    const error = new HttpError('Signing up failed, please try again later.',500);
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError ('User exists already, please login instead.', 422);
    return next(error);
  }

  const createdUser = new User({
    name,
    email,
    image: 'https://static-cdn.jtvnw.net/jtv_user_pictures/9187e6b7-1297-4913-bfd3-9f2e415f7eec-profile_image-300x300.png',
    password,
    places: []
  });

  try {
    await createdUser.save();
  } catch(err) {
    const error = new HttpError (
      'Signing up failed, please try again.',
      500
    );
    return next(error);
  }

  res.status(201).json({user: createdUser.toObject({getters: true})});
};

const login = async (req, res, next) => {

  const {email, password} = req.body;

  let existingUser

  try {
    existingUser = await User.findOne({email: email});
  }catch(err) {
    const error = new HttpError('Logging in failed, please try again later.',500);
    return next(error);
  }

  if (!existingUser || existingUser.password !== password) {
    const error = new HttpError('Invalid credentials, could not log you in', 401);
    return next(error);
  }

  res.json({message: 'Logged in!'})

};

exports.getUsers = getUsers;
exports.singup = singup;
exports.login = login;
