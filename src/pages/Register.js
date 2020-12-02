import React, {useContext, useState} from "react";
import { useHistory } from "react-router-dom";
import {CredentialsContext} from "../App";
import {handleErrors} from "./Login"

export default function Register() {

    // bring a hook to communicate with the backend
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [, setCredentials] = useContext(CredentialsContext);


    // function to use the upper variables to make HTTP requests in backend
    const register= (e) => {
        e.preventDefault();
        fetch(`http://localhost:5000/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username,
                password,
            }),
        })
            .then(handleErrors)
            .then(() => {
                setCredentials({
                    username,
                    password,
                });
                // jump to the login page (url)
                // https://reactrouter.com/web/api/Hooks/usehistory
                history.push("/login");
            })
            .catch((error) => {
                setError(error.message);
            });

    };
    const history = useHistory();
    return (
        <div>
            <h1>Register</h1>
            {error && <span style={{ color: "red" }}>{error}</span>}
            {/*when submit call th register function and save data to the database*/}
            <form onSubmit={register}>
                <input
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="username"/>
                <br/>
                <input
                    type ="password"
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="password"/>
                <br/>
                <button type="submit">Register</button>
            </form>
        </div>
    )
}
