import React, {useEffect, useState} from 'react';
import { useParams } from 'react-router-dom';

import Input from '../../shared/components/FormElements/input';
import Button from '../../shared/components/FormElements/Button';
import Card from '../../shared/components/UIElements/Card';

import { useForm } from '../../shared/hooks/form-hook';

import './PlaceForm.css';

import { VALIDATOR_REQUIRE, VALIDATOR_MINLENGTH} from '../../shared/util/validators';

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
    title: 'Emp. State Building',
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

const UpdatePlace = () => {
  const placeId = useParams().placeId;
  
  const [isLoading, setIsLoading] = useState(true);

  const [formState, inputHandler, setFormData] = useForm({
    title: {
      value: '',
      isValid: false
    },
    description: {
      value: '',
      isValid: false
    }
  }, false);

  const identifiedPlace = DUMMY_PLACES.find(p => p.id === placeId);

  useEffect(() => {
    if (identifiedPlace) {
      setFormData({
      title: {
        value: identifiedPlace.title,
        isValid: true
      },
      description: {
        value: identifiedPlace.description,
        isValid: true
      }
    }, true);
    }

    setIsLoading(false);
  }, [setFormData, identifiedPlace]);

  

  const placeUpdateSubmitHandler = event => {
    event.preventDefault();

    console.log(formState.inputs);
  };

  if (!identifiedPlace) {
    return (
      <div className='center'>
        <Card>
          <h2>Coult not find place!</h2>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className='center'>
        <h2>Loading</h2>
      </div>
    );
  }  

  return (
    <form className='place-form' onSubmit={placeUpdateSubmitHandler}>
      <Input 
        id="title" 
        element="input" 
        type="text" 
        label="Title" 
        validators={[VALIDATOR_REQUIRE()]} 
        errorText="Please enter a valid title."
        onInput={inputHandler}
        initialValue={formState.inputs.title.value}
        intialValid={formState.inputs.title.isValid}
      />

      <Input 
        id="description" 
        element="textarea" 
        label="Description" 
        validators={[VALIDATOR_MINLENGTH(5)]} 
        errorText="Please enter a valid description."
        onInput={inputHandler}
        initialValue={formState.inputs.description.value}
        intialValid={formState.inputs.description.isValid}
      />

      <Button type="submit" disabled={!formState.isValid}>
        UPDATE PLACE
      </Button>
    </form>
  );
};

export default UpdatePlace;