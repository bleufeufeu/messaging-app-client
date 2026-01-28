import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { AuthContext } from "../../AuthContext";
import { Link } from "react-router";

export default function Login() {
    const { loggedIn, login } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem("token")) {
            navigate("/");
        }
    },[]);

    const [formState, setFormState] = useState({
        username: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);

    const [errorMessages, setErrorMessages] = useState("");

    const onChange = (event) => {
        const { name, value } = event.target;
        setFormState({...formState, [name]: value})
    }

    const loginUrl = "https://messaging-app-kzuu.onrender.com/login"

    const onSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);

        const response = await fetch(loginUrl, {
            method: "post",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: formState.username,
                password: formState.password,
            })
        })

        const data = await response.json();

        if (response.status !== 200) {
            setLoading(false);
            if (data.error) {
                setErrorMessages(data.error);
                console.log(errorMessages);
            } else {
                alert("Error: " + (data.error || "Unknown error"));
            }
            return;
        }

        login(data.user, data.token);

        navigate("/");
    }

    return (
        <div className="loginContainer">
            <h1>Login</h1>

            {errorMessages && (
                <div className="errorMessages">
                    {errorMessages}
                </div>
            )}

            <form className="loginForm" onSubmit={onSubmit}>
                <div className="loginFormItem">
                    <label htmlFor="username">Username</label>
                    <input type="text" name="username" id="username" value={formState.username} onChange={onChange} required/>
                </div>

                <div className="loginFormItem">
                    <label htmlFor="password">Password</label>
                    <input type="password" name="password" id="password" value={formState.password} onChange={onChange} required/>
                </div>

                <button type="submit" disabled={loading}>Login</button>

                <div>Don't have an account? <Link to="/signup">Sign up</Link></div>
            </form>
        </div>
    )
}