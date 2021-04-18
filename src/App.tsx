import React, { useEffect } from 'react';
import axios from 'axios';


import './App.css';
import Chat from "./components/Chat";
import { SocketEventsEnum, configs } from "./config";
import socket from './socket';
import reducer from "./reducer";

function App() {
    const [state, dispatch] = React.useReducer(reducer, {
        isJoined: false,
        chatId: null,
        chatUsers: {
            patient: null,
            doctor: null,
        },
        role: null,
        oppositeRole: null,
        userName: null,
        messages: []
    });

    const onJoin = async (obj: any) => {
        dispatch({
            type: 'JOIN',
            payload: obj
        });
        socket.emit(SocketEventsEnum.ROOM_JOIN, obj);

        const { data } = await axios.get(`${configs.REACT_APP_API_URL}/chats/${obj.chatId}`);
        console.log(data.messages)

        dispatch({
            type: 'SET_DATA',
            payload: data,
        });
    };

    const setUsers = (users: any) => {
        dispatch({
            type: 'SET_USERS',
            payload: users
        });
    };

    const addMessage = (message: any) => {
        dispatch({
            type: 'NEW_MESSAGE',
            payload: message,
        });
    };

    useEffect( () => {
        async function Login() {
            const search = window.location.search;
            const params = new URLSearchParams(search);
            const queryRoom = params.get('roomId');
            const queryDoctor = params.get('doctorName');
            const queryPatient = params.get('patientName');

            if(!queryRoom) {
                return alert('No information about room!')
            }

            if(!queryDoctor && !queryPatient) {
                return alert('No information about user!')
            }

            const { data } = await axios.get(`${configs.REACT_APP_API_URL}/chats/${queryRoom}`);

            if (!data) {
                return alert('Unknown Room')
            }

            let loginObj = {};

            if(queryDoctor) {
                if(data.doctorName !== queryDoctor) {
                    return alert('This is wrong room, Doctor!')
                }

                loginObj = {
                    chatId: data._id,
                    chatUsers: {
                        patient: data.patientName,
                        doctor: data.doctorName,
                    },
                    role: 'doctor',
                    oppositeRole: 'patient',
                    userName: data.doctorName,
                    messages: data.messages
                }
            }

            if(queryPatient) {
                if(data.patientName !== queryPatient) {
                    return alert('This is wrong room, Patient!')
                }

                loginObj = {
                    chatId: data._id,
                    chatUsers: {
                        patient: data.patientName,
                        doctor: data.doctorName,
                    },
                    role: 'patient',
                    oppositeRole: 'doctor',
                    userName: data.patientName,
                    messages: data.messages
                }
            }

            await onJoin(loginObj);
    }
    if (!state.isJoined) {
        Login()
    }
    })

    useEffect(() => {
        socket.on(SocketEventsEnum.ROOM_SET_USERS, users => {
            setUsers(users);
        });
        socket.on(SocketEventsEnum.ROOM_NEW_MESSAGE, addMessage);
    }, [])


  return (
    <div className="App">
      <div className={'container'}>
          {
              state.isJoined ? <Chat onAddMessage={addMessage} {...state}/> : <h2>"Something went wrong"</h2>
          }
      </div>
    </div>
  );
}

export default App;
