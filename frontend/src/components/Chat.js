import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';

const ChatContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`;

const SetupCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 30px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
`;

const SetupTitle = styled.h2`
  font-size: 28px;
  font-weight: 600;
  color: #333;
  margin-bottom: 20px;
  text-align: center;
`;

const GenderSelection = styled.div`
  display: flex;
  gap: 20px;
  justify-content: center;
  margin-bottom: 30px;
`;

const GenderButton = styled.button`
  padding: 15px 30px;
  border: 2px solid ${props => props.selected ? '#667eea' : '#e1e5e9'};
  border-radius: 12px;
  background: ${props => props.selected ? '#667eea' : 'white'};
  color: ${props => props.selected ? 'white' : '#333'};
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #667eea;
    background: ${props => props.selected ? '#667eea' : 'rgba(102, 126, 234, 0.1)'};
  }
`;

const StartButton = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 15px 40px;
  border-radius: 12px;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: block;
  margin: 0 auto;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const ChatInterface = styled.div`
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 600px;
`;

const ChatHeader = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px;
  text-align: center;
`;

const ChatTitle = styled.h3`
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 5px;
`;

const ChatSubtitle = styled.p`
  opacity: 0.9;
  font-size: 14px;
`;

const MessagesContainer = styled.div`
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const Message = styled.div`
  display: flex;
  justify-content: ${props => props.isUser ? 'flex-end' : 'flex-start'};
  margin-bottom: 10px;
`;

const MessageBubble = styled.div`
  max-width: 70%;
  padding: 12px 16px;
  border-radius: 18px;
  background: ${props => props.isUser ? '#667eea' : '#f1f3f4'};
  color: ${props => props.isUser ? 'white' : '#333'};
  word-wrap: break-word;
  line-height: 1.4;
`;

const InputContainer = styled.div`
  padding: 20px;
  border-top: 1px solid #e1e5e9;
  display: flex;
  gap: 10px;
`;

const MessageInput = styled.input`
  flex: 1;
  padding: 12px 16px;
  border: 2px solid #e1e5e9;
  border-radius: 25px;
  font-size: 16px;
  outline: none;
  
  &:focus {
    border-color: #667eea;
  }
`;

const SendButton = styled.button`
  background: #667eea;
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 25px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: #5a6fd8;
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const EndChatButton = styled.button`
  background: #dc3545;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 10px;
  
  &:hover {
    background: #c82333;
  }
`;

const LoadingMessage = styled.div`
  text-align: center;
  color: #666;
  font-style: italic;
  padding: 10px;
`;

function Chat() {
  const location = useLocation();
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [selectedGender, setSelectedGender] = useState(null);
  const [chatStarted, setChatStarted] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (location.state?.selectedScenario) {
      setSelectedScenario(location.state.selectedScenario);
    } else {
      navigate('/');
    }
  }, [location, navigate]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleStartChat = () => {
    if (!selectedGender) return;
    
    setChatStarted(true);
    setMessages([
      {
        id: 1,
        text: 'Merhaba! Sohbete başlayalım. Ne hakkında konuşmak istiyorsun?',
        isUser: false,
        timestamp: new Date()
      }
    ]);
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: messages.length + 1,
      text: inputMessage,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await axios.post('/api/chat', {
        message: inputMessage,
        scenario: selectedScenario,
        gender: selectedGender,
        message_count: messages.length + 1  // Mesaj sayısını gönder
      });

      // Ghosting durumunda boş cevap gelebilir
      if (response.data.ghosting) {
        // Ghosting durumunda bot mesajı ekleme
        console.log('Ghosting yapılıyor...');
      } else {
        const botMessage = {
          id: messages.length + 2,
          text: response.data.response,
          isUser: false,
          timestamp: new Date()
        };

        setMessages(prev => [...prev, botMessage]);
      }
    } catch (error) {
      console.error('Mesaj gönderilirken hata:', error);
      const errorMessage = {
        id: messages.length + 2,
        text: 'Üzgünüm, bir hata oluştu. Lütfen tekrar deneyin.',
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEndChat = () => {
    navigate('/analysis', { 
      state: { 
        messages, 
        scenario: selectedScenario,
        gender: selectedGender 
      } 
    });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!selectedScenario) {
    return (
      <ChatContainer>
        <div className="text-center">
          <p style={{ color: 'white', fontSize: '18px' }}>Yönlendiriliyor...</p>
        </div>
      </ChatContainer>
    );
  }

  if (!chatStarted) {
    return (
      <ChatContainer>
        <SetupCard>
          <SetupTitle>Senaryo Ayarları</SetupTitle>
          <p style={{ textAlign: 'center', marginBottom: '30px', color: '#666' }}>
            Chatbot'un cinsiyetini seçin ve sohbete başlayın
          </p>
          
          <GenderSelection>
            <GenderButton
              selected={selectedGender === 'male'}
              onClick={() => setSelectedGender('male')}
            >
              👨 Erkek
            </GenderButton>
            <GenderButton
              selected={selectedGender === 'female'}
              onClick={() => setSelectedGender('female')}
            >
              👩 Kadın
            </GenderButton>
            <GenderButton
              selected={selectedGender === 'neutral'}
              onClick={() => setSelectedGender('neutral')}
            >
              🚶 Nötr
            </GenderButton>
          </GenderSelection>
          
          <StartButton 
            onClick={handleStartChat}
            disabled={!selectedGender}
          >
            Sohbete Başla
          </StartButton>
        </SetupCard>
      </ChatContainer>
    );
  }

  return (
    <ChatContainer>
      <ChatInterface>
        <ChatHeader>
          <ChatTitle>Manipülasyon Simülasyonu</ChatTitle>
          <ChatSubtitle>
            Senaryo: {selectedScenario === 'gaslighting' ? 'Gaslighting' :
                     selectedScenario === 'love_bombing' ? 'Love Bombing' :
                     selectedScenario === 'ghosting' ? 'Ghosting' :
                     selectedScenario === 'guilt_tripping' ? 'Guilt Tripping' : 'Bilinmeyen'}
          </ChatSubtitle>
        </ChatHeader>
        
        <MessagesContainer>
          {messages.map((message) => (
            <Message key={message.id} isUser={message.isUser}>
              <MessageBubble isUser={message.isUser}>
                {message.text}
              </MessageBubble>
            </Message>
          ))}
          
          {isLoading && (
            <LoadingMessage>
              Chatbot yazıyor...
            </LoadingMessage>
          )}
          
          <div ref={messagesEndRef} />
        </MessagesContainer>
        
        <InputContainer>
          <MessageInput
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Mesajınızı yazın..."
            disabled={isLoading}
          />
          <SendButton 
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isLoading}
          >
            Gönder
          </SendButton>
        </InputContainer>
      </ChatInterface>
      
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <EndChatButton onClick={handleEndChat}>
          Sohbeti Bitir ve Analiz Et
        </EndChatButton>
      </div>
    </ChatContainer>
  );
}

export default Chat; 