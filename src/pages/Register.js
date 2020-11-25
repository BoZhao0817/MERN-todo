import React, {useState} from "react";
import { useHistory } from "react-router-dom";

export default function Register() {

    const handleErrors = async (response) => {
        if (!response.ok) {
            const { message } = await response.json();
            throw Error(message);
        }
        return response.json();
    };
    // bring a hook to communicate with the backend
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

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
