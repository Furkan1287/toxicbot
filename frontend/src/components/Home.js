import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';

const HomeContainer = styled.div`
  padding: 40px 20px;
`;

const Hero = styled.div`
  text-align: center;
  margin-bottom: 60px;
`;

const HeroTitle = styled.h1`
  font-size: 48px;
  font-weight: 700;
  color: white;
  margin-bottom: 20px;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
`;

const HeroSubtitle = styled.p`
  font-size: 20px;
  color: rgba(255, 255, 255, 0.9);
  max-width: 600px;
  margin: 0 auto 40px;
  line-height: 1.6;
`;

const ScenariosGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  margin-bottom: 60px;
`;

const ScenarioCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 30px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
  border: 2px solid transparent;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
    border-color: #667eea;
  }
`;

const ScenarioIcon = styled.div`
  font-size: 48px;
  margin-bottom: 20px;
`;

const ScenarioTitle = styled.h3`
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin-bottom: 15px;
`;

const ScenarioDescription = styled.p`
  color: #666;
  line-height: 1.6;
  margin-bottom: 20px;
`;

const StartButton = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
  }
`;

const FeaturesSection = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 40px;
  margin-bottom: 40px;
`;

const FeaturesTitle = styled.h2`
  font-size: 32px;
  font-weight: 600;
  color: white;
  text-align: center;
  margin-bottom: 40px;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
`;

const FeatureCard = styled.div`
  text-align: center;
  color: white;
`;

const FeatureIcon = styled.div`
  font-size: 36px;
  margin-bottom: 15px;
`;

const FeatureTitle = styled.h3`
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 10px;
`;

const FeatureDescription = styled.p`
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
`;

const scenarioIcons = {
  gaslighting: '🔄',
  love_bombing: '💕',
  ghosting: '👻',
  guilt_tripping: '😔'
};

function Home() {
  const [scenarios, setScenarios] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchScenarios();
  }, []);

  const fetchScenarios = async () => {
    try {
      const response = await axios.get('/api/scenarios');
      setScenarios(response.data.scenarios);
    } catch (error) {
      console.error('Senaryolar yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleScenarioSelect = (scenarioKey) => {
    navigate('/chat', { state: { selectedScenario: scenarioKey } });
  };

  if (loading) {
    return (
      <HomeContainer>
        <div className="text-center">
          <p style={{ color: 'white', fontSize: '18px' }}>Yükleniyor...</p>
        </div>
      </HomeContainer>
    );
  }

  return (
    <HomeContainer>
      <Hero>
        <HeroTitle>Manipülasyon Tekniklerini Öğrenin</HeroTitle>
        <HeroSubtitle>
          Güvenli bir ortamda manipülasyon tekniklerini deneyimleyin ve 
          bunlara karşı savunma geliştirin. Gemini Pro ile güçlendirilmiş 
          eğitici chatbot ile farkındalığınızı artırın.
        </HeroSubtitle>
      </Hero>

      <ScenariosGrid>
        {Object.entries(scenarios).map(([key, scenario]) => (
          <ScenarioCard key={key} onClick={() => handleScenarioSelect(key)}>
            <ScenarioIcon>{scenarioIcons[key] || '🎭'}</ScenarioIcon>
            <ScenarioTitle>{scenario.name}</ScenarioTitle>
            <ScenarioDescription>{scenario.description}</ScenarioDescription>
            <StartButton>Bu Senaryoyu Dene</StartButton>
          </ScenarioCard>
        ))}
      </ScenariosGrid>

      <FeaturesSection>
        <FeaturesTitle>Neden Manipülasyon Bot?</FeaturesTitle>
        <FeaturesGrid>
          <FeatureCard>
            <FeatureIcon>🛡️</FeatureIcon>
            <FeatureTitle>Güvenli Öğrenme</FeatureTitle>
            <FeatureDescription>
              Kontrollü bir ortamda manipülasyon tekniklerini deneyimleyin
            </FeatureDescription>
          </FeatureCard>
          <FeatureCard>
            <FeatureIcon>🧠</FeatureIcon>
            <FeatureTitle>Farkındalık</FeatureTitle>
            <FeatureDescription>
              Manipülasyon işaretlerini tanımayı öğrenin
            </FeatureDescription>
          </FeatureCard>
          <FeatureCard>
            <FeatureIcon>💪</FeatureIcon>
            <FeatureTitle>Savunma Geliştirme</FeatureTitle>
            <FeatureDescription>
              Sağlıklı sınırlar koyma becerilerinizi geliştirin
            </FeatureDescription>
          </FeatureCard>
          <FeatureCard>
            <FeatureIcon>📊</FeatureIcon>
            <FeatureTitle>Detaylı Analiz</FeatureTitle>
            <FeatureDescription>
              Her sohbet sonrası kapsamlı analiz ve öneriler alın
            </FeatureDescription>
          </FeatureCard>
        </FeaturesGrid>
      </FeaturesSection>
    </HomeContainer>
  );
}

export default Home; 