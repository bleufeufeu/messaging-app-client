import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Link } from "react-router";

export default function Signup() {
    const navigate = useNavigate();

    const [formState, setFormState] = useState({
        username: "",
        password: "",
        confirmPassword: "",
    });

    const [errorMessages, setErrorMessages] = useState([]);

    const [loading, setLoading] = useState(false);

    const onChange = (event) => {
        const { name, value } = event.target;
        setFormState({...formState, [name]: value})
    }

    const signupUrl = "http://localhost:3000/signup/"

    const onSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);

        const response = await fetch(signupUrl, {
            method: "post",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: formState.username,
                password: formState.password,
                confirmPassword: formState.confirmPassword,
            })
        })

        const data = await response.json();

        console.log(data);

        if (response.status !== 201) {
            setLoading(false);
            if (data.errors) {
                setErrorMessages(data.errors.map(error => error.msg))
            } else {
                alert("Error: " + (data.error || "Unknown error"));
            }
            return;
        }
        
        setLoading(false);

        navigate("/login");
    }

    return (
        <div className="loginContainer">
            <h1>Signup</h1>

            {errorMessages.length > 0 && (
                <div className="errorMessages">
                    {errorMessages.map((error, index) => (
                        <div key={index}>{error}</div>
                    ))}
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

                <div className="loginFormItem">
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input type="password" name="confirmPassword" id="confirmPassword" value={formState.confirmPassword} onChange={onChange} required/>
                </div>

                <button type="submit" disabled={loading}>Sign Up</button>

                <div>Already have an account? <Link to="/login">Login</Link></div>
            </form>
        </div>
    )
}