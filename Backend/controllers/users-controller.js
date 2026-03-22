const { v4: uuidv4 } = require('uuid');

const HttpError = require('./../models/http-error');

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

const singup = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()){
    console.log(errors);
    throw new HttpError('Invalid inputs passed, please check your data.',422);
  }

  const {name, email, password} = req.body;

  const hasUser = DUMMY_USERS.find(u => u.email === email);

  if (hasUser) {
    throw new HttpError('Could not create user, email already exists.', 401);
  }

  const createdUser = {
    id: uuidv4(),
    name,
    email,
    password,
  }

  DUMMY_USERS.push(createdUser);

  res.status(201).json({user: createdUser});
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
