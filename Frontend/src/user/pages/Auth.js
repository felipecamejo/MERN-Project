import React, {useState} from 'react';

import './Auth.css';

import Card from '../../shared/components/UIElements/Card';
import Input from '../../shared/components/FormElements/input';
import Button from '../../shared/components/FormElements/Button';

import { useForm } from '../../shared/hooks/form-hook';

import { VALIDATOR_REQUIRE, VALIDATOR_EMAIL, VALIDATOR_MINLENGTH } from '../../shared/util/validators';

const Auth = () => {

  const [isLogin, setIsLogin] = useState(true);

  const authSubmitHandler = event => {
    event.preventDefault();

    console.log(formState.inputs);
  };

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

  return (
    <Card className="authentication">
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
          validators={[VALIDATOR_MINLENGTH(5)]} 
          errorText="Please enter a valid password, at least 5 characters"
          onInput={inputHandler}
        />

        {/*!isLogin && <Input
          id="password-repeat" 
          element="input" 
          type="password" 
          label="Repeat Password" 
          validators={[VALIDATOR_MINLENGTH(5)]} 
          errorText="Please enter the same password as above"
          onInput={inputHandler}
        />
        */}
        

        <Button type="submit" disabled={!formState.isValid}>
          {isLogin ? 'LOGIN': 'REGISTER'}
        </Button>

        <Button inverse onClick={switchModeHandler}>
          SWITCH TO {isLogin ? 'SIGNUP' : 'LOGIN'}
        </Button>

      </form>
    </Card>
  );
};

export default Auth;