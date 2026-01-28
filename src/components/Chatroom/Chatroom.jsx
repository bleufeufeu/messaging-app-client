import { useState, useContext } from "react";
import { AuthContext } from "../../AuthContext";
import { format } from "date-fns";
import { PiPencilSimpleBold, PiPaperPlaneTiltBold } from "react-icons/pi";

import styles from "./Chatroom.module.css"

export default function Chatroom({ chatDetails, chatId, onChatUpdate }) {

    const { userDetails } = useContext(AuthContext);

    const [loading, setLoading] = useState(false);
    const [formState, setFormState] = useState({ message: "" });

    const onChange = (event) => {
        const { name, value } = event.target;
        setFormState({...formState, [name]: value})
    }

    const sendMessage = async (event) => {
        event.preventDefault();

        setLoading(true);

            const storedToken = localStorage.getItem("token");

            if (storedToken) {
                const response = await fetch(`https://messaging-app-kzuu.onrender.com/chat/${chatId}/messages`, {
                    method: "post",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${storedToken}`
                    },
                    body: JSON.stringify({
                        content: formState.message
                    })
                });

                if (response.status !== 201) {
                    setLoading(false);
                    if (data.error) {
                        alert(data.error);
                    } else {
                        alert("Error: " + (data.error || "Unknown error"));
                    }
                    return;
                }

                setLoading(false);
                const data = await response.json();

                const refetchChat = await fetch(`https://messaging-app-kzuu.onrender.com/chat/${chatId}/messages`, {
                    method: "get",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${storedToken}`
                    }
                });

                const updatedChat = await refetchChat.json();

                onChatUpdate(updatedChat);

                setLoading(false);
                setFormState({ message: "" });

            }
    }

    return (
        <>

            {chatDetails ? (
                <div className={styles.chatroom}>
                    {chatDetails.messages.length > 0 ? (
                        <div className={styles.messagesContainer}>
                            {chatDetails.messages.map((message) => (
                                message.User.username === userDetails.username ? (
                                    <div className={styles.msgboxSelf} key={message.id}>
                                        <div>
                                            <div className={styles.msgUsername}>{message.User.username}</div>
                                            <div className={styles.msgText}>{message.content}</div>
                                            <div className={styles.msgTime}>{format(new Date(message.publishedat), "MMM dd, HH:mm")}</div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className={styles.msgboxOther} key={message.id}>
                                        <div className={styles.msgUsername}>{message.User.username}</div>
                                        <div className={styles.msgText}>{message.content}</div>
                                        <div className={styles.msgTime}>{format(new Date(message.publishedat), "MMM dd, HH:mm")}</div>
                                    </div>
                                )
                                
                            ))}
                        </div>
                    ) : (
                        <p></p>
                    )}
                        <form className={styles.inputContainer} onSubmit={sendMessage}>
                            <input className={styles.input} name="message" id="message" type="text" value={formState.message} onChange={onChange} autoComplete="off" placeholder="Start typing"/>
                            <button className={styles.button} disabled={loading} type="submit"><PiPaperPlaneTiltBold /></button>
                        </form>
                </div>
            ) : (
                <p></p>
            )}

        </>            
    )
}