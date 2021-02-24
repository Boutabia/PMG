import React, { useState, useEffect } from "react";
import axios from "axios";
import authHeader from '../../../services/auth-header'
import { Link, NavLink } from "react-router-dom";

const UserHome = () => {
  const [users, setUser] = useState([]);

  useEffect(() => {
    loadUsers();
  }, []);
  
  const loadUsers = async () => {
    const result = await axios.get('https://tuni-pmg.herokuapp.com/api/user/allusers',{
      headers: authHeader()
    });
    setUser(result.data.reverse());
  };

  const deleteUser = async id => {
    await axios.delete(`https://tuni-pmg.herokuapp.com/api/user/delete/${id}`,{
      headers: authHeader()
    });
    loadUsers();
  };

  return (
    <div className="container">
      
      <div className="py-4">
        <h1>Users List</h1>
        <div>
        <Link className="btn btn-secondary btn-lg" style={{float: 'right'}} to="/users/add">Add User</Link></div>
        <table class="table border shadow">
          <thead class="thead-dark">
            <tr>
              <th scope="col">#</th>
              <th scope="col">Full Name</th>
              <th scope="col">UserName</th>
              <th scope="col">Email</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody >
            {users.map((user, index) => (
              <tr>
                <th scope="row">{user.userId}</th>
                <td>{user.fullName}</td>
                <td>{user.userName}</td>
                <td>{user.email}</td>
                <td>
                  <Link class="btn btn-primary mr-2" to={`/users/${user.userId}`}>
                    View
                  </Link>
                  <Link
                    class="btn btn-outline-primary mr-2"
                    to={`/users/edit/${user.userId}`}
                  >
                    Edit
                  </Link>
                  <Link
                    class="btn btn-danger"
                    onClick={() => deleteUser(user.userId)}
                  >
                    Delete
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserHome;
