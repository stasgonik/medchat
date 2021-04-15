import React from 'react';
import './App.css';
import { classnames } from './classnames/tailwind'
import Chat from "./components/Chat";
const container = classnames('flex', 'justify-center', 'py-8')

function App() {
  return (
    <div className="App">
      <div className={container}>
        <Chat/>
      </div>
    </div>
  );
}

export default App;
