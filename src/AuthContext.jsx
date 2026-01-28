import { useState, useEffect, createContext } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [loading, setLoading] = useState(true);

    const [loggedIn, setLoggedIn] = useState(false);
    const [userDetails, setUserDetails] = useState({
        id: "",
        username: ""
    });
    const [isVerified, setIsVerified] = useState(false);

    const [token, setToken] = useState(localStorage.getItem("token"));

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        if (storedToken) {
            fetch("https://messaging-app-kzuu.onrender.com/users/me", {
                headers: { "Authorization": `Bearer ${storedToken}` }
            })
            .then(response => {
                if (response.status === 401) {
                    localStorage.removeItem("token");
                    setUserDetails({
                        id: "",
                        username: ""
                    })
                    setLoading(false);
                    return;
                }
                return response.json();
            })
            .then(data => {
                setLoggedIn(true);
                setIsVerified(true);
                setUserDetails({
                    id: data.id,
                    username: data.username
                });
            })
            .catch(error => console.error("Error getting user:", error))
            .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    const login = (userDetails, token) => {
        localStorage.setItem("token", token);
        setLoggedIn(true);
        if (userDetails.username) {
            setIsVerified(true);
        }
        setUserDetails({
            id: userDetails.id,
            username: userDetails.username,
        });
    }

    const logout = () => {
        localStorage.removeItem("token");
        setLoggedIn(false);
        setUserDetails({
            id: "",
            username: ""
        });
        setDropdownVisible(false);
    }

    const verify = () => {
        console.log("run verify");
        setIsVerified(true);
        setUserDetails(prev => ({
            ...prev,
            isAuthor: true
        }));
    }

    return (
        <AuthContext.Provider
        value={{
            loading,
            loggedIn,
            userDetails,
            isVerified,
            token,
            login,
            logout,
            verify
        }}
        >
        {children}
        </AuthContext.Provider>
    );
};