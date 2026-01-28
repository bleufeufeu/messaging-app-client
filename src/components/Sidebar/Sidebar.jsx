import { useState, useContext } from "react";
import { AuthContext } from "../../AuthContext";
import { format } from "date-fns";
import { PiNotePencilFill } from "react-icons/pi";

import styles from "./Sidebar.module.css"

export default function Sidebar({ chatsList, usersList, setCurrentChat, onNewChatUpdate }) {

    const { userDetails } = useContext(AuthContext);

    const [loading, setLoading] = useState(false);
    const [isCreatingChat, setIsCreatingChat] = useState(false);
    const [formState, setFormState] = useState([{ id: userDetails.id, username: userDetails.username }]);

    const handleChange = (event, user) => {
        const isChecked = event.target.checked;

        if (isChecked) {
            setFormState([...formState, user]);
        } else {
            setFormState(formState.filter(u => u.id !== user.id));
        }

    }

    const createChat = async (event) => {
        event.preventDefault();

        setLoading(true);

            const storedToken = localStorage.getItem("token");

            if (storedToken) {
                const response = await fetch(`http://localhost:3000/chat/new`, {
                    method: "post",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${storedToken}`
                    },
                    body: JSON.stringify({
                        users: formState
                    })
                });

                setLoading(false);
                const data = await response.json();

                if (response.status !== 201) {
                    setLoading(false);
                    if (data.error) {
                        alert(data.error);
                    } else {
                        alert("Error: " + (data.error || "Unknown error"));
                    }
                    return;
                }


                const refetchChatList = await fetch(`http://localhost:3000/users/chats`, {
                     method: "get",
                     headers: {
                         'Content-Type': 'application/json',
                         'Authorization': `Bearer ${storedToken}`
                     }
                 });

                const updatedChatList = await refetchChatList.json();

                onNewChatUpdate(updatedChatList.chats);

                setIsCreatingChat(false);

                setLoading(false);
                setFormState([{ id: userDetails.id, username: userDetails.username }]);

            }
    }

    return (
        <div className={styles.sidebar}>
            {!isCreatingChat ? (
                <>
                    <div className={styles.headerContainer}>
                        <div>Chats</div>
                        <PiNotePencilFill className={styles.icon} onClick={() => setIsCreatingChat(isCreating => !isCreating)}/>
                    </div>
                    {chatsList.length > 0 ? (
                        <div className={styles.chatsList}>
                            {chatsList.map((chat) => (
                                <div className={styles.chatPanel} key={chat.id} onClick={() => setCurrentChat(chat.id)}>
                                    <div className={styles.chatname}>{chat.name}</div>
                                    <div className={styles.chatLastupdated}>Last updated at {chat.lastupdated && !isNaN(new Date(chat.lastupdated).getTime())
                                        ? format(new Date(chat.lastupdated), "MMM dd, HH:mm")
                                        : "N/A"}
                                    </div>
                                </div>
                            ))}
                        </div>
                            ) : (
                                <p>No chats</p>
                            )}
                </>
                ) : (
                    <>
                        <div className={styles.headerContainer}>
                            <div>New Chat</div>
                            <button onClick={() => setIsCreatingChat(false)}>Cancel</button>
                        </div>

                        {usersList.length > 0 ? (
                        <>
                            <form className={styles.createForm} onSubmit={createChat}>
                                <div>
                                    <div>Select members:</div>
                                    {usersList.map((user) => (
                                        <label key={user.id}>
                                            <input type="checkbox" name={user.username} checked={formState.some(u => u.id === user.id)} onChange={(e) => handleChange(e, user)} key={user.id} />
                                            <div>{user.username}</div>
                                        </label>
                                    ))}
                                </div>
                                <button className={styles.createButton}>Create Chat</button>
                            </form>
                        </>
                            ) : (
                                <p>No chats</p>
                            )}
                    </>
                )

            }
        </div>            
    )
}