import React, {useContext, useState} from "react";
import { useHistory } from "react-router-dom";
import {CredentialsContext} from "../App";

export const handleErrors = async (response) => {
    if (!response.ok) {
        const { message } = await response.json();
        throw Error(message);
    }
    return response.json();
};

export default function Login() {
    // bring a hook to communicate with the backend
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [, setCredentials] = useContext(CredentialsContext);


    // function to use the upper variables to make HTTP requests in backend
    const login = (e) => {
        e.preventDefault();
        fetch(`http://localhost:5000/login`, {
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
                // jump to the home page
                // https://reactrouter.com/web/api/Hooks/usehistory
                history.push("/");
            })
            .catch((error) => {
                setError(error.message);
            });

    };
    const history = useHistory();
    return (
        <div>
            <h1>Login</h1>
            {error && <span style={{ color: "red" }}>{error}</span>}
            {/*when submit call th register function and save data to the database*/}
            <form onSubmit={login}>
                <input
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="username"/>
                <br/>
                <input
                    type ="password"
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="password"/>
                <br/>
                <button type="submit">Login</button>
            </form>
        </div>
    )
}
