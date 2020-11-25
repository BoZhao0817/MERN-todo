import React, {useContext} from "react";
import {Link} from "react-router-dom";
import {CredentialsContext} from "../App";

export default function Welcome() {

    const [credentials] = useContext(CredentialsContext);
    return (
        <div>
            <h1>Welcome { credentials }</h1>
            <Link to= "/register">Register</Link>
            <p/>
            <Link to= "/login">Login</Link>

        </div>
    )
}
