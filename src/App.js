import './App.css';
import {useCallback, useEffect, useState} from "react";
import {
    Alert,
    AppBar,
    Avatar,
    Box,
    Button,
    IconButton,
    Snackbar,
    Tab,
    Tabs,
    Toolbar,
    Typography,
    Container, Divider, MenuItem, InputLabel, Select, FormControl, TextField
} from "@mui/material";
import UserCredentialsDialog from './UserCredentialsDialog/UserCredentialsDialog';
import LoginCredentialsDialog from './LoginCredentialsDialog/LoginCredentialsDialog';
import {getUserToken, saveUserToken, clearUserToken} from "./localStorage";
import AddIcon from '@mui/icons-material/Add';
import logo from './zetalogo.png';
import {DataGrid} from "@mui/x-data-grid";


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

    let [value, setValue] = useState("Home");
    let [username, setUsername] = useState("");
    let [email, setEmail] = useState("");
    let [occupation, setOccupation] = useState("");
    let [userType, setUserType] = useState("user");
    let [wallet, setWallet] = useState("");
    let [score, setScore] = useState("");
    let [userAskings, setUserAskings] = useState([]);
    let [userOffers, setUserOffers] = useState([]);
    let [userAgreements, setUserAgreements] = useState([]);
    let [publicOffers, setPublicOffers] = useState([]);
    let [publicAskings, setPublicAskings] = useState([]);
    let [takeOfferIdInput, setTakeOfferIdInput] = useState("");
    let [giveAskingIdInput, setGiveAskingIdInput] = useState("");
    let [takeOfferMessageInput, setTakeOfferMessageInput] = useState("");
    let [giveAskingMessageInput, setGiveAskingMessageInput] = useState("");
    let [offerAmountInput, setOfferAmountInput] = useState("");
    let [offerInterestInput, setOfferInterestInput] = useState("");
    let [offerDueDateInput, setOfferDueDateInput] = useState("");
    let [offerDescriptionInput, setOfferDescriptionInput] = useState("");
    let [askingAmountInput, setAskingAmountInput] = useState("");
    let [askingRepayDateInput, setAskingRepayDateInput] = useState("");
    let [askingDescriptionInput, setAskingDescriptionInput] = useState("");

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

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
                setValue('Profile');
            });
    }


    function createUser(username, password, email, occupation, userType) {
        var isAdmin = (userType === "admin");
        return fetch(`${SERVER_URL}/user`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                user_name: username,
                password: password,
                user_email: email,
                occupation: occupation,
                is_Admin: isAdmin
            }),
        }).then((response) => login(username, password));
    }


    function logout() {
        setUserToken(null);
        clearUserToken();
        setValue('Home');
    }


    const fetchUserInfo = useCallback(() => {
        fetch(`${SERVER_URL}/user`, {
            headers: {
                Authorization: `bearer ${userToken}`,
            },
        })
            .then((response) => response.json())
            .then((user) => {
                setUsername(user.user_name);
                setEmail(user.user_email);
                setOccupation(user.occupation);
                setWallet(user.wallet);
                setScore(user.credit_score);
                user.is_Admin ? setUserType("admin") : setUserType("user");
            });
    }, [userToken]);


    useEffect(() => {
        if (userToken) {
            fetchUserInfo();
        }
    }, [fetchUserInfo, userToken]);


    const fetchUserAskings = useCallback(() => {
        fetch(`${SERVER_URL}/getUserAskings`, {
            headers: {
                Authorization: `bearer ${userToken}`,
            },
        })
            .then((response) => response.json())
            .then((askings) => setUserAskings(askings));
    }, [userToken]);


    useEffect(() => {
        if (userToken) {
            fetchUserAskings();
        }
    }, [fetchUserAskings, userToken]);


    const fetchUserOffers = useCallback(() => {
        fetch(`${SERVER_URL}/getUserOffers`, {
            headers: {
                Authorization: `bearer ${userToken}`,
            },
        })
            .then((response) => response.json())
            .then((userOffers) => setUserOffers(userOffers));
    }, [userToken]);


    useEffect(() => {
        if (userToken) {
            fetchUserOffers();
        }
    }, [fetchUserOffers, userToken]);


    const fetchUserAgreements = useCallback(() => {
        fetch(`${SERVER_URL}/getUserAgreements`, {
            headers: {
                Authorization: `bearer ${userToken}`,
            },
        })
            .then((response) => response.json())
            .then((userAgreements) => setUserAgreements(userAgreements));
    }, [userToken]);


    useEffect(() => {
        if (userToken) {
            fetchUserAgreements();
        }
    }, [fetchUserAgreements, userToken]);


    function addOffer() {
        fetch(`${SERVER_URL}/offer`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `bearer ${userToken}`,
                },
                body: JSON.stringify({
                    amount: offerAmountInput,
                    interest: offerInterestInput,
                    due_date: offerDueDateInput,
                    description: offerDescriptionInput
                }),
            }
        )
            .then(response => response.json())
            .then(data => {
                console.log('Success', data);
                setOfferAmountInput('');
                setOfferInterestInput('');
                setOfferDueDateInput('');
                setOfferDescriptionInput('');
                fetchUserOffers();
            });
    }

    const fetchPublicOffers = useCallback(() => {
        fetch(`${SERVER_URL}/publicOffers`, {
            headers: {
                Authorization: `bearer ${userToken}`,
            },
        })
            .then((response) => response.json())
            .then((publicOffers) => setPublicOffers(publicOffers));
    }, [userToken]);


    useEffect(() => {
        if (userToken) {
            fetchPublicOffers();
        }
    }, [fetchPublicOffers, userToken]);


    const fetchPublicAskings = useCallback(() => {
        fetch(`${SERVER_URL}/publicAskings`, {
            headers: {
                Authorization: `bearer ${userToken}`,
            },
        })
            .then((response) => response.json())
            .then((publicAskings) => setPublicAskings(publicAskings));
    }, [userToken]);


    useEffect(() => {
        if (userToken) {
            fetchPublicAskings();
        }
    }, [fetchPublicAskings, userToken]);


    function addAsking() {
        fetch(`${SERVER_URL}/asking`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `bearer ${userToken}`,
                },
                body: JSON.stringify({
                    amount: askingAmountInput,
                    repay_date: askingRepayDateInput,
                    description: askingDescriptionInput
                }),
            }
        )
            .then(response => response.json())
            .then(data => {
                console.log('Success', data);
                setAskingAmountInput('');
                setAskingRepayDateInput('');
                setAskingDescriptionInput('');
                fetchUserAskings();
            });
    }


    function takeOffer() {
        fetch(`${SERVER_URL}/publicOffers`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `bearer ${userToken}`,
                },
                body: JSON.stringify({
                    offer_id: takeOfferIdInput,
                    message: takeOfferMessageInput
                }),
            }
        )
            .then(response => response.json())
            .then(data => {
                console.log('Success', data);
                setTakeOfferIdInput('');
                setTakeOfferMessageInput('');
                fetchPublicOffers();
                fetchUserAgreements();
            });
    }


    function giveAsking() {
        fetch(`${SERVER_URL}/publicAskings`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `bearer ${userToken}`,
                },
                body: JSON.stringify({
                    request_id: giveAskingIdInput,
                    message: giveAskingMessageInput
                }),
            }
        )
            .then(response => response.json())
            .then(data => {
                console.log('Success', data);
                setGiveAskingIdInput('');
                setGiveAskingMessageInput('');
                fetchPublicAskings();
                fetchUserAgreements();
            });
    }


    return (
        <Container>
            <AppBar position="static">
                <Container maxWidth="xl" classes={{root: "nav"}}>
                    <Toolbar disableGutters>
                        <Typography
                            sx={{
                                mr: 2,
                                display: {xs: 'none', md: 'flex'},
                            }}
                        >
                            <Avatar sx={{bgcolor: "#0d47a1"}}>Z </Avatar>
                        </Typography>
                        <Typography
                            sx={{
                                mr: 16,
                                display: {xs: 'none', md: 'flex'},
                            }}
                        >
                            The Zeta Lending Application
                        </Typography>

                        <Box sx={{flexGrow: 1, display: {xs: 'none', md: 'flex'}}}>
                            {userToken !== null ? (
                                <Tabs value={value} onChange={handleChange} textColor="#fff">
                                    <Tab label="Profile" value="Profile"/>
                                    <Tab label="Loan Offers" value="Offers"/>
                                    <Tab label="Loan Requests" value="Requests"/>
                                    <Tab label="Notifications" value="Notifications"/>
                                </Tabs>
                            ) : (
                                <Tabs value={value} onChange={handleChange} textColor="#fff">
                                    <Tab label="Home Page" value="Home"/>
                                </Tabs>
                            )}
                        </Box>
                        {userToken !== null ? (<IconButton onClick={() => setValue("calc")}>
                            <Avatar sx={{bgcolor: "#0d47a1"}}><AddIcon/> </Avatar>
                        </IconButton>) : null}
                        <Box>
                            {userToken !== null ? (
                                <Button
                                    float="right"
                                    style={{
                                        backgroundColor: "#51d1e1",
                                        padding: "10px 16px",
                                        fontSize: "16px"
                                    }}
                                    variant="contained" onClick={logout}>
                                    Logout
                                </Button>
                            ) : (
                                <Container>
                                    <Button
                                        float="right"
                                        sx={{mr: 2}}
                                        style={{
                                            backgroundColor: "#0d47a1",
                                            padding: "10px 16px",
                                            fontSize: "16px"
                                        }}
                                        variant="contained"
                                        onClick={() => setAuthState(States.USER_LOG_IN)}>
                                        Login </Button>
                                    <Button
                                        float="right"
                                        style={{
                                            backgroundColor: "#51d1e1",
                                            padding: "10px 16px",
                                            fontSize: "16px"
                                        }}
                                        variant="contained"
                                        onClick={() => setAuthState(States.USER_CREATION)}>
                                        Register </Button>
                                </Container>
                            )}
                        </Box>
                    </Toolbar>
                </Container>
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
            <LoginCredentialsDialog
                open={authState === States.USER_LOG_IN}
                onClose={() => setAuthState(States.PENDING)}
                title="Log In"
                submitText="Submit"
                onSubmit={login}
            />

            {value === "Home" && userToken == null && (<Container className="wrapper">
                <Typography variant="h3"> Welcome to the ZETA Lending Application!</Typography>
                <Divider sx={{borderBottomWidth: 5}}/>
                <Typography style={{marginLeft:400}} variant="h6"> Login or register to continue</Typography>
                <br/>
                <img src={logo} width="200" height="200"/>
            </Container>)}

            {value === "Profile" && (<Container>
                <Container className="wrapper">
                    <Typography style={{marginLeft:380}} variant="h3">Hello, {username}!</Typography>
                    <Divider sx={{borderBottomWidth: 5}}/>
                    <Typography variant="h6">Email: {email}</Typography>
                    <Typography variant="h6">Occupation: {occupation}</Typography>
                    <Typography variant="h6">Your credit score: {score}</Typography>
                    <Typography variant="h6">Your balance: {wallet}</Typography>
                    <Typography variant="h6">Account type: {userType}</Typography>
                </Container>
                <Container className="wrapper">
                    <Typography style={{marginLeft:450}} variant="h5">Your Requests</Typography>
                    <br/>
                    <DataGrid
                        columns={[
                            {
                                field: 'request_id',
                                headerName: 'Request ID',
                                headerAlign: 'center',
                                align: 'center',
                                width: 130
                            },
                            {
                                field: 'amount',
                                headerName: 'Amount',
                                headerAlign: 'center',
                                align: 'center',
                                valueGetter: (params) => '$' + params.row.amount.toString(),
                                width: 130
                            },
                            {
                                field: 'request_date',
                                headerName: 'Added Date',
                                headerAlign: 'center',
                                align: 'center',
                                width: 130
                            },
                            {
                                field: 'repay_date',
                                headerName: 'Repay Date',
                                headerAlign: 'center',
                                align: 'center',
                                width: 130
                            },
                            {
                                field: 'is_accepted',
                                headerName: 'Status',
                                headerAlign: 'center',
                                align: 'center',
                                valueGetter: (params) => params.row.is_accepted ? 'Accepted' : 'Pending',
                                width: 130
                            },
                        ]}
                        getRowId={(row) => row.request_id}
                        rows={userAskings}
                        pageSize={10}
                        autoHeight
                    />
                </Container>
                <Container className="wrapper">
                    <Typography style={{marginLeft:450}} variant="h5">Your Offers</Typography>
                    <br/>
                    <DataGrid
                        columns={[
                            {
                                field: 'offer_id',
                                headerName: 'Offer ID',
                                headerAlign: 'center',
                                align: 'center',
                                width: 130
                            },
                            {
                                field: 'amount',
                                headerName: 'Amount',
                                headerAlign: 'center',
                                align: 'center',
                                valueGetter: (params) => '$' + params.row.amount.toString(),
                                width: 130
                            },
                            {
                                field: 'interest',
                                headerName: 'Interest',
                                headerAlign: 'center',
                                align: 'center',
                                valueGetter: (params) => params.row.interest.toString() + '%',
                                width: 130
                            },
                            {
                                field: 'offer_date',
                                headerName: 'Added Date',
                                headerAlign: 'center',
                                align: 'center',
                                width: 130
                            },
                            {
                                field: 'due_date',
                                headerName: 'Due Date',
                                headerAlign: 'center',
                                align: 'center',
                                width: 130
                            },
                            {
                                field: 'is_accepted',
                                headerName: 'Status',
                                headerAlign: 'center',
                                align: 'center',
                                valueGetter: (params) => params.row.is_accepted ? 'Accepted' : 'Pending',
                                width: 130
                            }
                        ]}
                        getRowId={(row) => row.offer_id}
                        rows={userOffers}
                        pageSize={10}
                        autoHeight
                    />

                </Container>
                <Container className="wrapper">
                    <Typography style={{marginLeft:450}} variant="h5">Your Agreements</Typography>
                    <br/>
                    <DataGrid
                        columns={[
                            {
                                field: 'agreement_id',
                                headerName: 'Agreement ID',
                                headerAlign: 'center',
                                align: 'center',
                                width: 130
                            },
                            {
                                field: 'receiver_name',
                                headerName: 'Deal with',
                                headerAlign: 'center',
                                align: 'center',
                                width: 130
                            },
                            {
                                field: 'receiver_email',
                                headerName: 'Their email',
                                headerAlign: 'center',
                                align: 'center',
                                width: 130
                            },
                            {
                                field: 'type',
                                headerName: 'Deal Type',
                                headerAlign: 'center',
                                align: 'center',
                                width: 130
                            },
                            {
                                field: 'message',
                                headerName: 'Message',
                                headerAlign: 'center',
                                align: 'center',
                                width: 130
                            }
                        ]}
                        getRowId={(row) => row.agreement_id}
                        rows={userAgreements}
                        pageSize={10}
                        autoHeight
                    />

                </Container>
            </Container>)}


            {value === "Offers" && (<Container>
                    <Container className="wrapper">
                    <Typography style={{marginLeft:280}} variant="h4">Available offers made by other users:</Typography>
                    <br/>
                    <DataGrid
                        columns={[
                            {
                                field: 'offer_id',
                                headerName: 'Offer ID',
                                headerAlign: 'center',
                                align: 'center',
                                width: 130
                            },
                            {
                                field: 'amount',
                                headerName: 'Amount',
                                headerAlign: 'center',
                                align: 'center',
                                valueGetter: (params) => '$' + params.row.amount.toString(),
                                width: 130
                            },
                            {
                                field: 'interest',
                                headerName: 'Interest',
                                headerAlign: 'center',
                                align: 'center',
                                valueGetter: (params) => params.row.interest.toString() + '%',
                                width: 130
                            },
                            {
                                field: 'score',
                                headerName: "User's Score",
                                headerAlign: 'center',
                                align: 'center',
                                width: 130
                            },
                            {
                                field: 'offer_date',
                                headerName: 'Added Date',
                                headerAlign: 'center',
                                align: 'center',
                                width: 130
                            },
                            {
                                field: 'due_date',
                                headerName: 'Due Date',
                                headerAlign: 'center',
                                align: 'center',
                                width: 130
                            },
                            {
                                field: 'description',
                                headerName: 'Description',
                                headerAlign: 'center',
                                align: 'center',
                                width: 200
                            },
                        ]}
                        getRowId={(row) => row.offer_id}
                        rows={publicOffers}
                        pageSize={10}
                        autoHeight
                    />

                </Container>
                <Container className="wrapper">
                        <Typography style={{marginLeft:450}} variant="h5">Take up an offer!</Typography>
                        <Divider sx={{borderBottomWidth: 5}}/>
                        <Typography variant="h6">Please enter the offer's ID & a message to the lender:</Typography>
                        <form name="take-offer-entry">
                            <Container className="amount-input">
                                <TextField
                                    id="take-offer-id"
                                    margin="normal"
                                    label="Offer ID"
                                    type="number"
                                    InputLabelProps={{shrink: true}}
                                    value={takeOfferIdInput}
                                    onChange={e => setTakeOfferIdInput(e.target.value)}
                                />
                            </Container>
                            <Container className="amount-input">
                                <TextField
                                    id="take-offer-message"
                                    margin="normal"
                                    label="Message"
                                    type="text"
                                    InputLabelProps={{shrink: true}}
                                    value={takeOfferMessageInput}
                                    onChange={e => setTakeOfferMessageInput(e.target.value)}
                                />
                            </Container>
                            <Box mt={2}>
                                <Button
                                    id="take-offer-button"
                                    type="button"
                                    color="primary"
                                    variant="contained"
                                    onClick={takeOffer}
                                >
                                    Take Up Offer
                                </Button>
                            </Box>
                        </form>
                    </Container>
                </Container>
            )}

            {value === "Requests" && (<Container>
                    <Container className="wrapper">
                    <Typography style={{marginLeft:280}} variant="h4">Loan requests made by other users:</Typography>
                    <br/>
                    <DataGrid
                        columns={[
                            {
                                field: 'request_id',
                                headerName: 'Request ID',
                                headerAlign: 'center',
                                align: 'center',
                                width: 130
                            },
                            {
                                field: 'amount',
                                headerName: 'Amount',
                                headerAlign: 'center',
                                align: 'center',
                                valueGetter: (params) => '$' + params.row.amount.toString(),
                                width: 130
                            },
                            {
                                field: 'score',
                                headerName: "User's Score",
                                headerAlign: 'center',
                                align: 'center',
                                width: 130
                            },
                            {
                                field: 'request_date',
                                headerName: 'Added Date',
                                headerAlign: 'center',
                                align: 'center',
                                width: 130
                            },
                            {
                                field: 'repay_date',
                                headerName: 'Repay Date',
                                headerAlign: 'center',
                                align: 'center',
                                width: 130
                            },
                            {
                                field: 'description',
                                headerName: 'Description',
                                headerAlign: 'center',
                                align: 'center',
                                width: 200
                            },
                        ]}
                        getRowId={(row) => row.request_id}
                        rows={publicAskings}
                        pageSize={10}
                        autoHeight
                    />

                </Container>
                <Container className="wrapper">
                        <Typography style={{marginLeft:450}} variant="h5">Fulfil a request!</Typography>
                        <Divider sx={{borderBottomWidth: 5}}/>
                        <Typography variant="h6">Please enter the request's ID & a message to the borrower:</Typography>
                        <form name="give-asking-entry">
                            <Container className="amount-input">
                                <TextField
                                    id="give-asking-id"
                                    margin="normal"
                                    label="Request ID"
                                    type="number"
                                    InputLabelProps={{shrink: true}}
                                    value={giveAskingIdInput}
                                    onChange={e => setGiveAskingIdInput(e.target.value)}
                                />
                            </Container>
                            <Container className="amount-input">
                                <TextField
                                    id="give-asking-message"
                                    margin="normal"
                                    label="Message"
                                    type="text"
                                    InputLabelProps={{shrink: true}}
                                    value={giveAskingMessageInput}
                                    onChange={e => setGiveAskingMessageInput(e.target.value)}
                                />
                            </Container>
                            <Box mt={2}>
                                <Button
                                    id="give-asking-button"
                                    type="button"
                                    color="primary"
                                    variant="contained"
                                    onClick={giveAsking}
                                >
                                    Fulfil Request
                                </Button>
                            </Box>
                        </form>
                    </Container>

                </Container>
            )}

            {/*{value === "Notifications" && (<Container className="wrapper">
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
            </Container>)}*/}

            {value === "calc" && (<Container>
                    <Container className="wrapper">
                        <Typography style={{marginLeft:450}} variant="h4">Add Offer</Typography>
                        <hr/>
                        <form name="offer-entry">
                            <Container className="amount-input">
                                <TextField
                                    id="offer-amount"
                                    margin="normal"
                                    label="Amount ($)"
                                    type="number"
                                    InputLabelProps={{shrink: true}}
                                    value={offerAmountInput}
                                    onChange={e => setOfferAmountInput(e.target.value)}
                                />
                            </Container>
                            <Container className="amount-input">
                                <TextField
                                    id="interest"
                                    margin="normal"
                                    label="Interest (%)"
                                    type="number"
                                    InputLabelProps={{shrink: true}}
                                    value={offerInterestInput}
                                    onChange={e => setOfferInterestInput(e.target.value)}
                                />
                            </Container>
                            <Container className="amount-input">
                                <TextField
                                    id="due_date"
                                    margin="normal"
                                    label="Due Date (YYYY-MM-DD)"
                                    type="text"
                                    InputLabelProps={{shrink: true}}
                                    value={offerDueDateInput}
                                    onChange={e => setOfferDueDateInput(e.target.value)}
                                />
                            </Container>
                            <Container className="amount-input">
                                <TextField
                                    id="description"
                                    margin="normal"
                                    label="Description (may be left empty)"
                                    type="text"
                                    InputLabelProps={{shrink: true}}
                                    value={offerDescriptionInput}
                                    onChange={e => setOfferDescriptionInput(e.target.value)}
                                />
                            </Container>
                            <Box mt={2}>
                                <Button
                                    id="add-offer-button"
                                    type="button"
                                    color="primary"
                                    variant="contained"
                                    onClick={addOffer}
                                >
                                    Add Offer
                                </Button>
                            </Box>
                        </form>
                    </Container>
                    <Container className="wrapper">
                        <Typography style={{marginLeft:450}} variant="h4">Add Request</Typography>
                        <hr/>
                        <form name="request-entry">
                            <Container className="amount-input">
                                <TextField
                                    id="request-amount"
                                    margin="normal"
                                    label="Amount ($)"
                                    type="number"
                                    InputLabelProps={{shrink: true}}
                                    value={askingAmountInput}
                                    onChange={e => setAskingAmountInput(e.target.value)}
                                />
                            </Container>
                            <Container className="amount-input">
                                <TextField
                                    id="repay_date"
                                    margin="normal"
                                    label="Repay Date (YYYY-MM-DD)"
                                    type="text"
                                    InputLabelProps={{shrink: true}}
                                    value={askingRepayDateInput}
                                    onChange={e => setAskingRepayDateInput(e.target.value)}
                                />
                            </Container>
                            <Container className="amount-input">
                                <TextField
                                    id="description"
                                    margin="normal"
                                    label="Description (may be left empty)"
                                    type="text"
                                    InputLabelProps={{shrink: true}}
                                    value={askingDescriptionInput}
                                    onChange={e => setAskingDescriptionInput(e.target.value)}
                                />
                            </Container>
                            <Box mt={2}>
                                <Button
                                    id="add-request-button"
                                    type="button"
                                    color="primary"
                                    variant="contained"
                                    onClick={addAsking}
                                >
                                    Add Request
                                </Button>
                            </Box>
                        </form>
                    </Container>
                </Container>
            )}

        </Container>
    );
}

export default App;
