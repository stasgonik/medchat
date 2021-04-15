import React from 'react'
import {classnames} from '../classnames/tailwind'

const chat = classnames('w-full', 'border', 'rounded-xl')

const Chat = () => {
    return (
        <div className={chat}>
            <div className="chat-messages">
                <div className="messages">
                    <div className="message">
                        <p>Text</p>
                        <div>
                            <span>User</span>
                        </div>
                    </div>
                </div>
                <form>
          <textarea className="form-control">

          </textarea>
                    <button type="button" className="btn btn-primary">
                        Send
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Chat;
