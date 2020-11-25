import './App.css';
import { BrowserRouter as Router, Switch, Route} from "react-router-dom"
import Register from "./pages/Register";
import Login from "./pages/Login";
import Welcome from "./pages/Welcome";
import React, { useState } from "react";

export const CredentialsContext = React.createContext(null);

function App() {
    // useState to save the credential value
    const credentialsState = useState({
        username:"asdf",
        password:"1234",
    });

      return (
        <div className="App">
            {/*have access to the context the value save here are some tates*/}
            <CredentialsContext.Provider value={ credentialsState }>
                <Router>
                    <Switch>
                        <Route exact path ='/'>
                            <Welcome/>
                        </Route>
                        <Route exact path ='/register'>
                            <Register/>
                        </Route>
                        <Route exact path ='/login'>
                            <Login/>
                        </Route>
                    </Switch>
                </Router>
            </CredentialsContext.Provider>
        </div>
      );
}

export default App;
