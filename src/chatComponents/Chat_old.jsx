// Chat.jsx
import React from 'react';
import Chatbot from 'react-chatbot-kit';
import 'react-chatbot-kit/build/main.css';
import './ifbbot.css';

import BotAvatar from './avatar1.webp';
import UserAvatar from './avatar2.webp';

// === Configuração do chatbot ===
const config = {
  initialMessages: [
    {
      type: 'bot',
      id: '1',
      message: 'Olá! Sou seu assistente 🤖 de ajuda no IFB, vamos conversar???',
    },
  ],
  botName: 'IFB',
  customStyles: {
    botMessageBox: {
      backgroundColor: '#98A92C',
    },
    chatButton: {
      backgroundColor: '#509E2F',
    },
  },
  // === Avatares customizados ===
  customComponents: {
    botAvatar: (props) => (
      <img
        src={BotAvatar}
        alt="Assistente IFB"
        style={{
          width: 40,
          height: 40,
          borderRadius: '50%',
          backgroundColor: '#fff',
          border: '2px solid #98A92C',
          padding: 3,
        }}
      />
    ),
    userAvatar: (props) => (
      <img
        src={UserAvatar}
        alt="Futuro Estudante IFB"
        style={{
          width: 40,
          height: 40,
          borderRadius: '50%',
          backgroundColor: '#fff',
          border: '2px solid #509E2F',
          padding: 3,
        }}
      />
    ),
  },
};

// === Funções do chatbot ===
const MessageParser = ({ children, actions }) => {
  const parse = (message) => {
    actions.handleUserMessage(message);
  };
  return (
    <>
      {React.Children.map(children, (child) =>
        React.cloneElement(child, { parse })
      )}
    </>
  );
};

const ActionProvider = ({ createChatBotMessage, setState, children }) => {
  const handleUserMessage = async (message) => {
    // Envia a mensagem ao webhook do n8n
    try {
      const response = await fetch(
        'https://seu-n8n-endpoint/webhook/ai-agent',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_message: message }),
        }
      );

      const data = await response.json();
      const botReply = data.reply || 'Não consegui entender sua solicitação.';

      const botMessage = createChatBotMessage(botReply);
      setState((prev) => ({
        ...prev,
        messages: [...prev.messages, botMessage],
      }));
    } catch (error) {
      console.error('Erro ao conectar com o webhook:', error);
      const botMessage = createChatBotMessage(
        'Erro ao conectar com o agente de IA 😢'
      );
      setState((prev) => ({
        ...prev,
        messages: [...prev.messages, botMessage],
      }));
    }
  };

  return (
    <>
      {React.Children.map(children, (child) =>
        React.cloneElement(child, { actions: { handleUserMessage } })
      )}
    </>
  );
};

export default function Chat() {
  return (
    <div style={{ width: '90%', margin: 'auto', marginTop: '30px' }}>
      <Chatbot
        config={config}
        messageParser={MessageParser}
        actionProvider={ActionProvider}
        headerText="Assistente IFB"
        placeholderText="Digite sua Dúvida"
      />
    </div>
  );
}
