import React, {useState, useContext} from 'react';

import './Auth.css';

import Card from '../../shared/components/UIElements/Card';
import Input from '../../shared/components/FormElements/input';
import Button from '../../shared/components/FormElements/Button';

import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';


import { useHttpClient } from '../../shared/hooks/http-hook';

import { AuthContext } from '../../shared/context/auth-context-';

import { useForm } from '../../shared/hooks/form-hook';

import { VALIDATOR_REQUIRE, VALIDATOR_EMAIL, VALIDATOR_MINLENGTH } from '../../shared/util/validators';

const Auth = () => {

  const auth = useContext(AuthContext);

  const [isLogin, setIsLogin] = useState(true);
 
  const {isLoading, error, sendRequest, clearError} = useHttpClient();

  const [formState, inputHandler, setFormData] = useForm({
      email: {
        value: '',
        isValid: false
      },
      password: {
        value: '',
        isValid: false
      }
  }, false);

    const switchModeHandler = () => {
    if (!isLogin) {
      setFormData({
          ...formState.inputs,
          name: undefined
        },
        formState.inputs.email.isValid && formState.inputs.password.isValid
      );
    } else {
      setFormData({
        ...formState.inputs,
        name: {
          value: '',
          isValid: false
        }
      }, false);
    }

    setIsLogin(prevMode => !prevMode);
  };

  const authSubmitHandler = async event => {
    event.preventDefault();
 

    if (isLogin) {

      try {
        const responseData = await sendRequest(
          'http://localhost:5000/api/users/login', 
          'POST',
          JSON.stringify({
            email: formState.inputs.email.value,
            password: formState.inputs.password.value,
          }),
          {
            'Content-Type': 'application/json'
          },
        );
        auth.login(responseData.user.id);
      } catch(err){}

    } else {

      try {
        const responseData = await sendRequest(
          'http://localhost:5000/api/users/singup', 
          'POST',
            
          JSON.stringify({
            name: formState.inputs.name.value,
            email: formState.inputs.email.value,
            password: formState.inputs.password.value,
          }),
          {
            'Content-Type': 'application/json'
          }
        );
        auth.login(responseData.user.id);
      } catch(err){}
      
    }
  }


  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError}/>
      <Card className="authentication">
        {isLoading && <LoadingSpinner asOverlay/>}
        <h2>{isLogin ? 'Login' : 'Register'} Required</h2>
        <hr/>
        <form  
          onSubmit={authSubmitHandler} 
        >
          {!isLogin && <Input
            id="name" 
            element="input" 
            type="text" 
            label="Name" 
            validators={[VALIDATOR_REQUIRE()]} 
            errorText="Please enter a name."
            onInput={inputHandler}
          />
          }

          <Input
            id="email" 
            element="input" 
            type="email" 
            label="E-Mail" 
            validators={[VALIDATOR_REQUIRE(), VALIDATOR_EMAIL()]} 
            errorText="Please enter a valid email."
            onInput={inputHandler}
          />
          <Input
            id="password" 
            element="input" 
            type="password" 
            label="Password" 
            validators={[VALIDATOR_MINLENGTH(6)]} 
            errorText="Please enter a valid password, at least 5 characters"
            onInput={inputHandler}
          />
          
          <Button type="submit" disabled={!formState.isValid}>
            {isLogin ? 'LOGIN': 'REGISTER'}
          </Button>

          <Button type="button" inverse onClick={switchModeHandler}>
            SWITCH TO {isLogin ? 'SIGNUP' : 'LOGIN'}
          </Button>

        </form>
      </Card>
    </React.Fragment>
  );

};
export default Auth;