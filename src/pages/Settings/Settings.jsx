import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../AuthContext";
import { useNavigate } from "react-router";
import styles from "./Settings.module.css"


export default function Settings() {
    const navigate = useNavigate();

    const { loading: authLoading, loggedIn, userDetails, logout } = useContext(AuthContext);

    const [loading, setLoading] = useState(false);

    const [formState, setFormState] = useState({
        password: "",
        confirmPassword: "",
    });

    const [errorMessages, setErrorMessages] = useState([]);

    const onChange = (event) => {
        const { name, value } = event.target;
        setFormState({...formState, [name]: value})
    }


    const updateUrl = "https://messaging-app-kzuu.onrender.com/users/newpassword"

    const onSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);

        const storedToken = localStorage.getItem("token");

        if (storedToken) {
            const response = await fetch(updateUrl, {
                method: "put",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${storedToken}`
                },
                body: JSON.stringify({
                    password: formState.password,
                    confirmPassword: formState.confirmPassword,
                })
            })

            const data = await response.json();

            if (response.status !== 201) {
                setLoading(false);
                if (data.errors) {
                    setErrorMessages(data.errors.map(error => error.msg))
                } else {
                    alert("Error: " + (data.error || "Unknown error"));
                }
                return;
            }
        }

        setLoading(false);
        navigate("/")
    }
    
    return (
        <div className={styles.settingsContainer}>
            {errorMessages.length > 0 && (
                <div className="errorMessages">
                    {errorMessages.map((error, index) => (
                        <div key={index}>{error}</div>
                    ))}
                </div>
            )}
            
            <form className="loginForm" onSubmit={onSubmit}>
                <div className="loginFormItem">
                    <label htmlFor="password">New Password</label>
                    <input type="password" name="password" id="username" value={formState.password} onChange={onChange} required/>
                </div>

                <div className="loginFormItem">
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input type="password" name="confirmPassword" id="confirmPassword" value={formState.confirmPassword} onChange={onChange} required/>
                </div>

                <button type="submit" disabled={loading}>Confirm</button>
            </form>
        </div>
    );
}