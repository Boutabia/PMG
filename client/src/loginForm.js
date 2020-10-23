import React from 'react';
import InputField from './inputField';
import SubmitButton from './submitButton';

class LoginForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      buttonDisabled: false
    }
  }

  setInputValue(property, val) {
    val = val.trim();
    if (val.length > 100) {
      return;
    }
    this.setState({
      [property]: val
    })
  }

  resetForm() {
    this.setState({
      username: '',
      password: '',
      buttonDisabled: false
    })
  }

  async doLogin() {
    
    if (!this.state.username) {
      return;
    }
    if (!this.state.password) {
      return;
    }

    this.setState({
      buttonDisabled: true
    })

    
  }

  render() {
    return (
      <div className="loginForm">

        <h2>Log in</h2>

        <InputField
          type='email'
          placeholder='Email'
          value={this.state.email ? this.state.email : ''}
          onChange={(val) => this.setInputValue('email', val) }

        />

        <InputField
          type='password'
          placeholder='Password'
          value={this.state.password ? this.state.password : ''}
          onChange={(val) => this.setInputValue('password', val) }

        />

        <SubmitButton
          text='Log in'
          disabled={this.state.buttonDisabled}
          onClick={ () => this.doLogin() }
        />

        <p>Forgot your password?</p>

      </div>
    );
  }
}

export default LoginForm;