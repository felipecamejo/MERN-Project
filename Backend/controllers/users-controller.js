const { v4: uuidv4 } = require('uuid');

const HttpError = require('./../models/http-error');

const User = require('../models/user');

const { validationResult } = require('express-validator');

let DUMMY_USERS = [
  {
   id:'u1',
   name: 'Max Scwarz',
   email: 'test@test.com',
   password: 'testers',
  },
]

const getUsers = (req, res, next) => {
  res.json({users: DUMMY_USERS});
};

const singup = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()){
    console.log(errors);
    return next(
      new HttpError('Invalid inputs passed, please check your data.',422)
    );
  }
  const {name, email, password, places} = req.body;

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
    places
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

const login = (req, res, next) => {

  const errors = validationResult(req);

  if (!errors.isEmpty()){
    console.log(errors);
    throw new HttpError('Invalid inputs passed, please check your data.',422);
  }
  
  const {email, password} = req.body;

  const user = DUMMY_USERS.find(p => p.email === email)

  if (!user || user.password !== password) {
    throw new HttpError('Could not identify user, credentials seem to be wrong', 401);
  }

  res.json({message: 'Logged in!'})

};

exports.getUsers = getUsers;
exports.singup = singup;
exports.login = login;
