import './App.css';
import {useState} from "react";
import {Alert, AppBar, Button, Snackbar, Toolbar, Typography} from "@mui/material";
import UserCredentialsDialog from './UserCredentialsDialog/UserCredentialsDialog';
import {getUserToken, saveUserToken, clearUserToken} from "./localStorage";


var SERVER_URL = "http://127.0.0.1:5000"

function App() {
    let [userToken, setUserToken] = useState(getUserToken());
    const States = {
        PENDING: "PENDING",
        USER_CREATION: "USER_CREATION",
        USER_LOG_IN: "USER_LOG_IN",
        USER_AUTHENTICATED: "USER_AUTHENTICATED",
    };
    let [authState, setAuthState] = useState(States.PENDING);

    let [amount, setAmount] = useState("");
    let [type, setType] = useState("type1");

    function login(username, password) {
        return fetch(`${SERVER_URL}/authentication`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                user_name: username,
                password: password,
            }),
        })
            .then((response) => response.json())
            .then((body) => {
                setAuthState(States.USER_AUTHENTICATED);
                setUserToken(body.token);
                saveUserToken(body.token);
            });
    }


    function createUser(username, password) {
        return fetch(`${SERVER_URL}/user`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                user_name: username,
                password: password,
            }),
        }).then((response) => login(username, password));
    }


    function logout() {
        setUserToken(null);
        clearUserToken();
    }


    return (
        <div>
            <AppBar position="static">
                <Toolbar classes={{root: "nav"}}>
                    <Typography variant="h5">The Zeta Lending Application</Typography>
                    {userToken !== null ? (
                        <Button color="inherit" onClick={logout}>
                            Logout
                        </Button>
                    ) : (
                        <div>
                            <Button
                                color="inherit"
                                onClick={() => setAuthState(States.USER_CREATION)}
                            >
                                Register
                            </Button>
                            <Button
                                color="inherit"
                                onClick={() => setAuthState(States.USER_LOG_IN)}
                            >
                                Login
                            </Button>
                        </div>
                    )}
                </Toolbar>
            </AppBar>
            <Snackbar
                elevation={6}
                variant="filled"
                open={authState === States.USER_AUTHENTICATED}
                autoHideDuration={2000}
                onClose={() => setAuthState(States.PENDING)}
            >
                <Alert severity="success">Success</Alert>
            </Snackbar>
            <UserCredentialsDialog
                open={authState === States.USER_CREATION}
                onClose={() => setAuthState(States.PENDING)}
                title="Registration"
                submitText="Submit"
                onSubmit={createUser}
            />
            <UserCredentialsDialog
                open={authState === States.USER_LOG_IN}
                onClose={() => setAuthState(States.PENDING)}
                title="Log In"
                submitText="Submit"
                onSubmit={login}
            />
            <div className="wrapper">
                <h2>First Title</h2>
                <p>bla bla bla</p>
                <hr/>
                <h2>Second Title:</h2>
                <form name="input-form">
                    <div className="amount-input">
                        <label htmlFor="amount">some kind of input: </label>
                        <input id="input-amount" type="number" value={amount}
                               onChange={e => setAmount(e.target.value)}/>
                    </div>
                    <select id="input-type" value={type}
                            onChange={e => setType(e.target.value)}>
                        <option value="type1">First Type</option>
                        <option value="type2">Second Type</option>
                    </select>
                </form>
                <button id="add-button" className="button" type="button">Add</button>
            </div>
            <div className="wrapper">
                <h2>Second wrapper:</h2>
            </div>
        </div>
    );
}

export default App;
