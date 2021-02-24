import React, { useState } from "react";
import axios from 'axios'
import { useHistory } from "react-router-dom";
import authHeader from '../../../services/auth-header'

const AddUser = () => {
  let history = useHistory();
  const [newuser, setUser] = useState({
    usernameVar: "",
    fullnameVar: "",
    emailVar: "",  
    passwordVar: "",
    cpasswordVar:""
  });

  const { username, fullname, email, password,cpassword} = newuser;
  const onInputChange = e => {
    setUser({ ...newuser, [e.target.name]: e.target.value });
  };

  const onSubmit = async e => {
    e.preventDefault();
    await axios.post('https://tuni-pmg.herokuapp.com/api/user/register', newuser, {
      headers: authHeader()
    });
    history.push("/users");
  };
  return (
    <div className="container">
      <div className="w-75 mx-auto shadow p-5">
        <h2 className="text-center mb-4">Add A User</h2>
        <form onSubmit={e => onSubmit(e)}>
          <div className="form-group">
            <input
              type="text"
              className="form-control form-control-lg"
              placeholder="Enter UserName"
              name="username"
              value={username}
              onChange={e => onInputChange(e)}
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              className="form-control form-control-lg"
              placeholder="Enter Full Name"
              name="fullname"
              value={fullname}
              onChange={e => onInputChange(e)}
            />
          </div>
          <div className="form-group">
            <input
              type="email"
              className="form-control form-control-lg"
              placeholder="Enter E-mail Address"
              name="email"
              value={email}
              onChange={e => onInputChange(e)}
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              className="form-control form-control-lg"
              placeholder="Enter Password"
              name="password"
              value={password}
              onChange={e => onInputChange(e)}
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              className="form-control form-control-lg"
              placeholder="Confirm Password"
              name="cpassword"
              value={cpassword}
              onChange={e => onInputChange(e)}
            />
          </div>
          <button className="btn btn-primary btn-block">Add User</button>
        </form>
      </div>
    </div>
  );
};

export default AddUser;
