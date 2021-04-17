export default (state : any, action : any) => {
    switch (action.type) {
        case 'JOIN':
            return {
                ...state,
                isJoined: true,
                chatId: action.payload.chatId,
                chatUsers: action.payload.chatUsers,
                role: action.payload.role,
                oppositeRole: action.payload.oppositeRole,
                userName: action.payload.userName,
                messages: action.payload.messages,
            }

        case 'SET_DATA':
            return {
                ...state,
                messages: action.payload.messages,
            }

        case 'SET_USERS':
            return {
                ...state
            }

        case 'NEW_MESSAGE':
            return {
                ...state,
                messages: [...state.messages, action.payload],
            }

        default:
            return state;
    }
}
