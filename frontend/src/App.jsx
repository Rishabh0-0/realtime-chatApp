import ChatRoom from "./components/ChatRoom";
import LoginForm from "./components/LoginForm";
import { ChatProvider, useChat } from "./context/ChatContext";

const ChatApp = () => {
  const { state } = useChat();

  return state.isUsernameSet ? <ChatRoom /> : <LoginForm />;
};

const App = () => {
  return (
    <ChatProvider>
      <ChatApp />
    </ChatProvider>
  );
};

export default App;
