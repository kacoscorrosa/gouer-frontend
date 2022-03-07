import React, { useCallback, useContext, useState } from "react";
import { withRouter, Redirect } from "react-router";
import app from "./base.js";

const Login = ({ history }) => {

  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const handleLogin = useCallback(
    async event => {
      event.preventDefault();
      const { email, password } = event.target.elements;
      try {
        const user = await app
          .auth()
          .signInWithEmailAndPassword(email.value, password.value);

        const token = await user.user.getIdToken()

        const rawResponse = await fetch('http://localhost:8787/auth/validate', {
          method: 'GET',
          headers: {
            'x-token': token
          },
        });

        setIsAuthenticated(true)

        history.push("/");
      } catch (error) {
        alert(error);
      }
    },
    [history]
  );

  if (isAuthenticated) {
    return <Redirect to="/" />;
  }

  return (
    <div>
      <h1>Log in</h1>
      <form onSubmit={handleLogin}>
        <label>
          Email
          <input name="email" type="email" placeholder="Email" />
        </label>
        <label>
          Password
          <input name="password" type="password" placeholder="Password" />
        </label>
        <button type="submit">Log in</button>
      </form>
    </div>
  );
};

export default withRouter(Login);
