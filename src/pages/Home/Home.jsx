import { Link } from "react-router-dom";
import { useContext, useEffect, useState, useRef } from "react";
import { AuthContext } from "../../AuthContext";
import Sidebar from "../../components/Sidebar/Sidebar";
import Chatroom from "../../components/Chatroom/Chatroom";

import styles from "./Home.module.css"
import { PiPlanetFill, PiGearFill, PiPhoneFill, PiVideoCameraFill, PiDotsThreeVerticalBold } from "react-icons/pi";
import Login from "../Login/Login";



export default function Home() {
    const { loading: authLoading, loggedIn, userDetails, logout } = useContext(AuthContext);

    const [loading, setLoading] = useState(false);

    const [usersList, setUsersList] = useState([]);
    const [chatsList, setChatsList] = useState([]);
    const [currentChat, setCurrentChat] = useState("");
    const [currentChatDetails, setCurrentChatDetails] = useState(null);

    const dropdownRef = useRef(null);
    const [dropdownVisible, setDropdownVisible] = useState(false);

    const usersUrl = "https://messaging-app-kzuu.onrender.com/users/all"
    const chatsUrl = "https://messaging-app-kzuu.onrender.com/users/chats"
    const chatDetailsUrl = `https://messaging-app-kzuu.onrender.com/chat/${currentChat}/messages`

    const handleNewChatUpdate = (updatedChatsList) => {
        setChatsList(updatedChatsList);
    }

    const handleChatUpdate = (updatedChat) => {
        setCurrentChatDetails(updatedChat);
    }

    const handleLogout = () => {
        setDropdownVisible(false);
        logout();
    }

    useEffect(() => {
        if (authLoading) return;

        const fetchUsers = async () => {
            setLoading(true);

            const storedToken = localStorage.getItem("token");

            if (storedToken) {
                const response = await fetch(usersUrl, {
                    method: "get",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${storedToken}`
                    }
                });

                if (response.status !== 200) {
                    setLoading(false);
                    return alert("Error");
                }

                setLoading(false);
                const data = await response.json();
                setUsersList(data);
            }
        };

        fetchUsers();
        
    }, [authLoading, userDetails]);

    useEffect(() => {
        if (authLoading) return;

        const fetchChats = async () => {
            setLoading(true);

            const storedToken = localStorage.getItem("token");

            if (storedToken) {
                const response = await fetch(chatsUrl, {
                    method: "get",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${storedToken}`
                    }
                });

                if (response.status !== 200) {
                    setLoading(false);
                    return alert("Error");
                }

                setLoading(false);
                const data = await response.json();

                setChatsList(data.chats);
            }
        };

        fetchChats();
        
    }, [authLoading, userDetails]);

    useEffect(() => {
        if (authLoading) return;

        if (currentChat === "") return;

        const fetchCurrentChatDetails = async () => {
            setLoading(true);

            const storedToken = localStorage.getItem("token");

            if (storedToken) {
                const response = await fetch(chatDetailsUrl, {
                    method: "get",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${storedToken}`
                    }
                });

                if (response.status !== 200) {
                    setLoading(false);
                    return alert("Error");
                }

                setLoading(false);
                const data = await response.json();

                setCurrentChatDetails(data);
            }
        };

        fetchCurrentChatDetails();
        
    }, [authLoading, currentChat]);

    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownVisible(false);
            }
        }

        document.addEventListener("mousedown", handleOutsideClick);
        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        }
    }, [dropdownVisible])
    
    return (
        <>
            {authLoading ? (
                <div>Loading...</div>
            ) : loggedIn ? (
                <div className={styles.homeContainer}>
                        <div className={styles.logoContainer} style={{ gridArea: "logo" }}>
                            <div className={styles.logo}><PiPlanetFill /> OdinChat</div>
                            <div>
                                <div className={styles.settings}>
                                    <PiGearFill onClick={() => setDropdownVisible(dropdownVisible => !dropdownVisible)} className={styles.icon} />
                                </div>
                                {dropdownVisible && <div ref={dropdownRef} className={styles.settingsDropdown}>
                                    <div><Link to="/settings">Profile Settings</Link></div>
                                    <div className={styles.logout} onClick={() => handleLogout()}>Logout</div>
                                </div>}
                            </div>
                        </div>

                        <div className={styles.sidebarContainer} style={{ gridArea: "sidebar" }}>
                            <Sidebar chatsList={chatsList} usersList={usersList} setCurrentChat={setCurrentChat} onNewChatUpdate={handleNewChatUpdate}></Sidebar>
                        </div>

                        <div className={styles.chatheaderContainer} style={{ gridArea: "chatHeader" }}>
                            {currentChatDetails &&
                                <>
                                    <div>{currentChatDetails.name}</div>
                                    <div className={styles.chatheaderIcons}>
                                        <PiPhoneFill className={styles.icon} />
                                        <PiVideoCameraFill className={styles.icon} />
                                        <PiDotsThreeVerticalBold className={styles.icon} />
                                    </div>
                                </>
                            }
                        </div>

                        <div className={styles.chatroomContainer} style={{ gridArea: "chatroom" }}>
                            <Chatroom chatDetails={currentChatDetails} chatId={currentChat} onChatUpdate={handleChatUpdate}></Chatroom>
                        </div>
                </div>
            ) : (
                <Login></Login>
            )}
        </>
    );
}