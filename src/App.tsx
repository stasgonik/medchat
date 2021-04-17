import React, {useEffect, useState} from 'react';
import axios from 'axios';


import socket from './socket';
import reducer from "./reducer";
import './App.css';
import Chat from "./components/Chat";

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
        console.log(obj)
        dispatch({
            type: 'JOIN',
            payload: obj
        });
        console.log(state);

        socket.emit('ROOM:JOIN', obj);

        const { data } = await axios.get(`http://localhost:5000/chats/${obj.chatId}`);
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

            const { data } = await axios.get(`http://localhost:5000/chats/${queryRoom}`);

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
    console.log(state);
    if (!state.isJoined) {
        Login()
        console.log(state)
    }
    }, [])

    useEffect(() => {
        socket.on('ROOM:SET_USERS', users => {
            setUsers(users);
        });
        socket.on('ROOM:NEW_MESSAGE', addMessage);
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
