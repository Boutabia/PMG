import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import authHeader from '../../../services/auth-header'
import axios from "axios";

const User = () => {
  const [user, setUser] = useState({
    username: "",
    fullname: "",
    email: ""    
  });
  const { id } = useParams();
  useEffect(() => {
    loadUser();
  }, []);
  const loadUser = async () => {
    const res = await axios.get(`https://tuni-pmg.herokuapp.com/api/user/getuser/${id}`,{
      headers: authHeader()
    });
    setUser(res.data);
  };
  return (
    <div className="container py-4">
      <Link className="btn btn-primary" to="/users">
        back to Users List
      </Link>
      <h1 className="display-4">User Id: {id}</h1>
      <hr />
      <ul className="list-group w-50">
        <li className="list-group-item">Username: {user.username}</li>
        <li className="list-group-item">Full Name: {user.fullname}</li>
        <li className="list-group-item">Email: {user.email}</li>
        
      </ul>
    </div>
  );
};

export default User;
