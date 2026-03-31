const HttpError = require('./../models/http-error');
const mongoose = require('mongoose');
const fs = require('fs');

const User = require('../models/user');
const Place = require('../models/place');

const { validationResult } = require('express-validator');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const KEY = 'supersecret_dont_share';

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

  if (!req.file) {
    return next(
      new HttpError('Please provide an image for your profile.', 422)
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

  let hashedPassword;
  
  try {
    hashedPassword = await bcrypt.hash(password, 12)
  } catch(err) {
    const error = new HttpError (
      'Could not create user, please try again', 500
    );
    return next(error);
  }

  const createdUser = new User({
    name,
    email,
    image: req.file.path,
    password: hashedPassword,
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

  let token;
  try {
    token = jwt.sign({
      userId: createdUser.id,
      email: createdUser.email,
    }, KEY, 
    {expiresIn: '1h', }
  );    
  }catch(err){
    const error = new HttpError (
      'Signing up failed, please try again.',
      500
    );
    return next(error);
  }

  res.status(201).json({userId: createdUser.id, email: createdUser.email, token: token});
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


  if (!existingUser ) {
    const error = new HttpError('Invalid credentials, could not log you in', 403);
    return next(error);
  }

  let isValidPassword = false;

  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch(err){
    const error = new HttpError(
      'Could not log you in, please check your credentials and try again.',
      500
    );
    return next(error);
  }
  
  if (!isValidPassword) {
    const error = new HttpError('Invalid credentials, could not log you in', 403);
    return next(error);
  }

  let token;
  try {
    token = jwt.sign({
      userId: existingUser.id,
      email: existingUser.email,
    }, KEY, 
    {expiresIn: '1h', }
  );    
  }catch(err){
    const error = new HttpError (
      'Logging in failed, please try again.',
      500
    );
    return next(error);
  }

  res.json({
    userId: existingUser.id,
    email: existingUser.email,
    token: token
  });

};

const deleteUserById = async (req, res, next) => {
    const userId = req.params.uid;
  
    let user;
    try {
      user = await User.findById(userId);
    } catch (err) {
      console.log(err);
      const error = new HttpError('Something went wrong, could not find user for deletion', 500);
      return next(error);
    }
  
    if (!user) {
      const error = new HttpError('Could not find user for this id.', 404);
      return next(error);
    }
     
    const imagePath = user.image;
  
    try {
      const sess = await mongoose.startSession();
      sess.startTransaction();
  
      await Place.deleteMany({creator: userId});
      
      await User.findByIdAndDelete(userId, { session: sess });
      await sess.commitTransaction();
    } catch (err) {
      console.log(err);
      const error = new HttpError('Something went wrong, could not delete user', 500);
      return next(error);
    }
  
    fs.unlink(imagePath, err => {
      console.log(err);
    });
  
    res.status(200).json({message: 'Deleted user. Id:' + userId});
};

exports.deleteUserById = deleteUserById;
exports.getUsers = getUsers;
exports.singup = singup;
exports.login = login;
