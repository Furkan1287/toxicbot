import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';

const AnalysisContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
`;

const AnalysisCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 30px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
`;

const AnalysisTitle = styled.h2`
  font-size: 32px;
  font-weight: 600;
  color: #333;
  margin-bottom: 20px;
  text-align: center;
`;

const AnalysisSubtitle = styled.p`
  color: #666;
  text-align: center;
  margin-bottom: 30px;
  font-size: 16px;
`;

const ChatHistory = styled.div`
  background: #f8f9fa;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 30px;
  max-height: 400px;
  overflow-y: auto;
`;

const ChatHistoryTitle = styled.h3`
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin-bottom: 20px;
`;

const MessageHistory = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const HistoryMessage = styled.div`
  display: flex;
  justify-content: ${props => props.isUser ? 'flex-end' : 'flex-start'};
`;

const HistoryBubble = styled.div`
  max-width: 70%;
  padding: 10px 14px;
  border-radius: 16px;
  background: ${props => props.isUser ? '#667eea' : '#e9ecef'};
  color: ${props => props.isUser ? 'white' : '#333'};
  font-size: 14px;
  line-height: 1.4;
`;

const AnalysisContent = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 12px;
  padding: 25px;
  margin-bottom: 30px;
`;

const AnalysisContentTitle = styled.h3`
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 20px;
  text-align: center;
`;

const AnalysisText = styled.div`
  line-height: 1.8;
  font-size: 16px;
  white-space: pre-wrap;
`;

const LoadingSpinner = styled.div`
  text-align: center;
  padding: 40px;
  color: #666;
`;

const ErrorMessage = styled.div`
  background: #f8d7da;
  color: #721c24;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
  text-align: center;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 15px;
  justify-content: center;
  margin-top: 30px;
`;

const ActionButton = styled.button`
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &.primary {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
  }
  
  &.secondary {
    background: white;
    color: #667eea;
    border: 2px solid #667eea;
  }
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
  }
`;

const ScenarioInfo = styled.div`
  background: rgba(102, 126, 234, 0.1);
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 20px;
  text-align: center;
`;

const ScenarioInfoText = styled.p`
  color: #667eea;
  font-weight: 500;
  margin: 0;
`;

function Analysis() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [messages, setMessages] = useState([]);
  const [scenario, setScenario] = useState('');
  const [gender, setGender] = useState('');
  const [analysis, setAnalysis] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (location.state?.messages) {
      setMessages(location.state.messages);
      setScenario(location.state.scenario);
      setGender(location.state.gender);
      analyzeConversation(location.state.messages, location.state.scenario);
    } else {
      navigate('/');
    }
  }, [location, navigate]);

  const analyzeConversation = async (chatMessages, chatScenario) => {
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('/api/analysis', {
        messages: chatMessages,
        scenario: chatScenario
      });

      setAnalysis(response.data.analysis);
    } catch (error) {
      console.error('Analiz hatası:', error);
      setError('Analiz yapılırken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  const handleNewChat = () => {
    navigate('/');
  };

  const handleBackToChat = () => {
    navigate('/chat', { 
      state: { 
        selectedScenario: scenario 
      } 
    });
  };

  const getScenarioName = (scenarioKey) => {
    const scenarioNames = {
      gaslighting: 'Gaslighting',
      love_bombing: 'Love Bombing',
      ghosting: 'Ghosting',
      guilt_tripping: 'Guilt Tripping'
    };
    return scenarioNames[scenarioKey] || 'Bilinmeyen';
  };

  const getGenderName = (genderKey) => {
    const genderNames = {
      male: 'Erkek',
      female: 'Kadın',
      neutral: 'Nötr'
    };
    return genderNames[genderKey] || 'Bilinmeyen';
  };

  if (!messages.length) {
    return (
      <AnalysisContainer>
        <div className="text-center">
          <p style={{ color: 'white', fontSize: '18px' }}>Yönlendiriliyor...</p>
        </div>
      </AnalysisContainer>
    );
  }

  return (
    <AnalysisContainer>
      <AnalysisCard>
        <AnalysisTitle>Manipülasyon Analizi</AnalysisTitle>
        <AnalysisSubtitle>
          Sohbetiniz analiz edildi. Aşağıda detaylı bulguları görebilirsiniz.
        </AnalysisSubtitle>

        <ScenarioInfo>
          <ScenarioInfoText>
            Senaryo: {getScenarioName(scenario)} | 
            Chatbot Cinsiyeti: {getGenderName(gender)}
          </ScenarioInfoText>
        </ScenarioInfo>

        <ChatHistory>
          <ChatHistoryTitle>📝 Sohbet Geçmişi</ChatHistoryTitle>
          <MessageHistory>
            {messages.map((message) => (
              <HistoryMessage key={message.id} isUser={message.isUser}>
                <HistoryBubble isUser={message.isUser}>
                  {message.text}
                </HistoryBubble>
              </HistoryMessage>
            ))}
          </MessageHistory>
        </ChatHistory>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        {loading ? (
          <LoadingSpinner>
            <p>Analiz yapılıyor...</p>
          </LoadingSpinner>
        ) : (
          <AnalysisContent>
            <AnalysisContentTitle>🔍 Manipülasyon Analizi</AnalysisContentTitle>
            <AnalysisText>{analysis}</AnalysisText>
          </AnalysisContent>
        )}

        <ActionButtons>
          <ActionButton className="secondary" onClick={handleBackToChat}>
            Yeni Sohbet Başlat
          </ActionButton>
          <ActionButton className="primary" onClick={handleNewChat}>
            Ana Sayfaya Dön
          </ActionButton>
        </ActionButtons>
      </AnalysisCard>
    </AnalysisContainer>
  );
}

export default Analysis; 