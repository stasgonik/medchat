import React, { useState, useRef, useEffect} from 'react'

import socket from "../socket";
import './chat.css'
import axios from "axios";
import reducer from "../reducer";



function Chat({chatId, chatUsers, role, oppositeRole, messages, onAddMessage} : any) {
    const [messageValue, setMessageValue] = useState('');
    const messagesRef = useRef(null);

    const onSendMessage = async () => {
        socket.emit('ROOM:NEW_MESSAGE', {
            chatId,
            chatUsers,
            role,
            oppositeRole,
            body: messageValue,
        });
        // const { data: { messages } } = await axios.get(`http://localhost:5000/chats/${chatId}`);
        onAddMessage({ chatId, from: chatUsers[role], to: chatUsers[oppositeRole], body: messageValue, type: 'regularMessage'});
        setMessageValue('');
    };

    useEffect(() => {
        // @ts-ignore
        messagesRef.current.scrollTo(0, 99999);
    }, [messages]);

    return (
        <div className='chat'>
            <div className='height-full'>
                <div ref={messagesRef} className='chatMessages'>
                    {messages.map((message: any) => (
                        <div className= {message.from === chatUsers[role]? "message message_me" : "message message_notMe"}>
                            <p>{message.body}</p>
                            <div>
                                <span>{message.from}</span>
                            </div>
                        </div>
                    ))}

                    {/*<div className="message message_notMe">*/}
                    {/*    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit Excepteur sint occaecat cupidatat non </p>*/}
                    {/*    <div>*/}
                    {/*        <span>Stas</span>*/}
                    {/*    </div>*/}
                    {/*</div>*/}
                    {/*<div className="message message_me">*/}
                    {/*    <p>proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>*/}
                    {/*    <div>*/}
                    {/*        <span>Viktor</span>*/}
                    {/*    </div>*/}
                    {/*</div>*/}
                </div>

                <form className='messageForm'>
                    <textarea className='messageInput float-left  height-full' value={messageValue}
                              onChange={(e) => setMessageValue(e.target.value)}>

                    </textarea>
                    <div className='messageButtonBlock float-left  height-full'>
                        <button onClick={onSendMessage} type="button" className='messageButton'>
                    </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Chat;
