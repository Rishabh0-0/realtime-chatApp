import { createContext, useContext, useEffect, useReducer } from "react";

const ChatContext = createContext();

const initialState = {
  socket: null,
  connectionStatus: "Disconnected",
  messages: [],
  username: "",
  isUsernameSet: false,
  userCount: 0,
  typingUsers: [],
  isTyping: false,
};

const chatReducer = (state, action) => {
  switch (action.type) {
    case "SET_SOCKET":
      return { ...state, socket: action.payload };
    case "SET_CONNECTION_STATUS":
      return { ...state, connectionStatus: action.payload };
    case "ADD_MESSAGE":
      return { ...state, messages: [state.messages, action.payload] };
    case "SET_USERNAME":
      return { ...state, username: state.payload };
    case "SET_USRNAME_STATUS":
      return { ...state, isUsernameSet: state.payload };
    case "SET_USER_COUNT":
      return { ...state, userCount: state.payload };
    case "SET_TYPING_USERS":
      return { ...state, typingUsers: state.payload };
    case "SET_IS_TYPING":
      return { ...state, isTyping: state.payload };
    case "CLEAR_MESSAGES":
      return { ...state, messages: [] };
    default:
      return state;
  }
};

const useWebSocket = (dispatch) => {
  useEffect(() => {
    const connectWebSocket = () => {
      const ws = new WebSocket("ws://localhost:8080");

      ws.onopen = () => {
        dispatch({ type: SET_CONNECTION_STATUS, payload: "Connected" });
        dispatch({ type: SET_SOCKET, payload: ws });
        dispatch({
          type: ADD_MESSAGE,
          payload: {
            id: Date.now(),
            type: "system",
            message: "Connected to the chat system",
            timestamp: new Date().toISOString(),
          },
        });
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        handleWebSocketMessage(data, dispatch);
      };

      ws.onclose = () => {
        dispatch({ type: SET_CONNECTION_STATUS, payload: "Disconnected" });
        dispatch({
          type: ADD_MESSAGE,
          payload: {
            id: Date.now(),
            type: "system",
            message: "Disconnected from the server",
            timestamp: new Date().toISOString(),
          },
        });

        // Auto reconnect
        setTimeout(connectWebSocket, 3000);
      };

      ws.onerror = () => {
        dispatch({
          type: "SET_CONNECTION_STATUS",
          payload: "Error",
        });
      };

      connectWebSocket();
    };
  }, [dispatch]);

  const handleWebSocketMessage = (data, dispatch) => {
    switch (data.type) {
      case "chat":
        dispatch({
          type: "ADD_MESSAGE",
          payload: {
            ...data,
            type: "chat",
          },
        });
        break;
      case "userJoined":
        dispatch({
          type: "ADD_MESSAGE",
          payload: {
            id: Date.now(),
            type: "system",
            message: `${data.username} joined the chat`,
            timestamp: data.timestamp,
          },
        });
        break;
      case "userLeft":
        dispatch({
          type: "ADD_MESSAGE",
          payload: {
            id: Date.now(),
            type: "system",
            message: `${data.username} left the chat`,
            timestamp: data.timestamp,
          },
        });
        break;
      case "userCount":
        dispatch({
          type: "SET_USER_COUNT",
          payload: data.count,
        });
        break;
      case "typing":
        dispatch({
          type: "SET_TYPING_USERS",
          payload: (prevUsers) => {
            if (data.isTyping) {
              return [
                ...prevUsers.filter((user) => user !== data.username),
                username,
              ];
            } else {
              return prevUsers.filter((user) => user !== data.username);
            }
          },
        });
        break;
    }
  };
};

export const ChatProvider = ({ children }) => {
  const [state, dispatch] = useReducer(chatReducer, initialState);

  useWebSocket(dispatch);

  const actions = {
    setUsername: (username) => {
      dispatch({ type: "SET_USERNAME", payload: username });
    },

    joinChat: () => {
      if (
        state.username.trim() &&
        state.socket &&
        state.socket.readyState === WebSocket.OPEN
      ) {
        state.socket.send(
          JSON.stringify({
            type: "setUsername",
            username: state.username.trim(),
          })
        );
        dispatch({ type: "SET_USERNAME_STATUS", payload: true });
      }
    },

    sendMessage: (message) => {
      if (
        message.trim() &&
        state.socket &&
        state.socket.readyState === WebSocket.OPEN
      ) {
        state.socket.send(
          JSON.stringify({
            type: "chat",
            message: message.trim(),
          })
        );
        actions.stopTyping();
      }
    },

    startTyping: () => {
      if (
        !state.isTyping &&
        state.socket &&
        state.socket.readyState === WebSocket.OPEN
      ) {
        dispatch({ type: "SET_IS_TYPING", payload: true });
        state.socket.send(
          JSON.stringify({
            type: "typing",
            isTyping: true,
          })
        );
      }
    },

    stopTyping: () => {
      if (
        state.isTyping &&
        state.socket &&
        state.socket.readyState === WebSocket.OPEN
      ) {
        dispatch({ type: "SET_IS_TYPING", payload: false });
        state.socket.send(
          JSON.stringify({
            type: "typing",
            isTyping: false,
          })
        );
      }
    },

    clearMessages: () => {
      dispatch({ type: "CLEAR_MESSAGES" });
    },
  };

  return (
    <ChatContext.Provider value={{ state, actions, dispatch }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};
