import React, {useContext} from 'react';

import { useHistory } from 'react-router-dom';

import Input from '../../shared/components/FormElements/input';

import { VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from '../../shared/util/validators';
import Button from '../../shared/components/FormElements/Button';

import './PlaceForm.css';

import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';

import { useForm } from '../../shared/hooks/form-hook';

import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context-';

import ImageUpload from '../../shared/components/FormElements/ImageUpload';

const NewPlace = () => {
    const {isLoading, error, sendRequest, clearError} = useHttpClient();
    const auth = useContext(AuthContext);
    const [formState, inputHandler] = useForm(
        {
            title: {
                value: '',
                isValid: true,
            },
            description: {
                value: '',
                isValid: true,
            },
            address: {
                value: '',
                isValid: true,
            },
            image: {
                value: null,
                isValid: false,
            }
        }, 
        false
    );

    const history = useHistory();


    const placeSubmitHandler = async event => {
        event.preventDefault();
  
        const formData = new FormData();

        formData.append('title', formState.inputs.title.value);
        formData.append('description', formState.inputs.description.value);
        formData.append('address', formState.inputs.address.value);
        formData.append('image', formState.inputs.image.value);

        try {
            await sendRequest(
                `${process.env.REACT_APP_BACKEND_URL}/places`, 
                'POST',
                formData,
                {Authorization: 'Bearer ' + auth.token}
            );
            history.push('/');
            
        } catch(err){}
    };

    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError}/>
            <form className='place-form' onSubmit={placeSubmitHandler}>
                {isLoading && <LoadingSpinner asOverlay/>}
                <Input 
                    id="title"
                    element="input" 
                    type="text" 
                    label="Title" 
                    validators={[
                        VALIDATOR_REQUIRE(),
                    ]} 
                    errorText="Please enter a valid title."
                    onInput={inputHandler}
                />
                <Input 
                    id="description"
                    element="textarea" 
                    label="Description" 
                    validators={[
                        VALIDATOR_MINLENGTH(5),
                    ]} 
                    errorText="Please enter a valid description (at least 5 characters)."
                    onInput={inputHandler}
                />
                <Input 
                    id="address"
                    element="input" 
                    label="Address" 
                    validators={[
                        VALIDATOR_REQUIRE(),
                    ]} 
                    errorText="Please enter a valid address."
                    onInput={inputHandler}
                />
                <ImageUpload  
                    id="image" 
                    onInput={inputHandler} 
                    errorText="Please provide an image."
                />
                <Button type="submit" disabled={!formState.isValid}>
                    ADD PLACE
                </Button>
            </form>
        </React.Fragment>
    );
};

export default NewPlace;