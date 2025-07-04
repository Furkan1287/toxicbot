# 🚨 ToxicBot - Manipülasyon Farkındalık Simülatörü

**⚠️ UYARI: Bu uygulama gerçek manipülasyon tekniklerini simüle eder ve karanlık sonuçlar içerebilir. Sadece eğitim ve farkındalık amaçlıdır.**

Toksik ilişkilerde kullanılan manipülasyon tekniklerinin gerçek yüzünü göstermek ve kullanıcıların bu tekniklere karşı savunma geliştirmesini sağlamak için tasarlanmış güçlü bir simülatör. DeepSeek AI ile desteklenen bu uygulama, toksik manipülasyonun karanlık dünyasına güvenli bir ortamda adım atmanızı sağlar.

## 🎯 Proje Amacı

Bu proje, toksik ilişkilerde kullanılan manipülasyon tekniklerinin gerçek etkilerini göstermek ve kullanıcıların:
- Toksik davranış belirtilerini erken fark etmesini
- Bu tekniklere karşı savunma mekanizmaları geliştirmesini
- Sağlıklı ilişki sınırları koymasını
- Kendi değerini korumasını

sağlamayı hedefler.

## 🕳️ Toksik Manipülasyon Senaryoları

### 1. 🔄 Gaslighting (Gerçeklik Manipülasyonu)
**Hedef**: Kullanıcının kendi hafızasına ve gerçeklik algısına güvenini tamamen yok etmek
- Geçmiş olayları inkâr etme
- "Sen yanlış hatırlıyorsun" manipülasyonu
- Gerçeklik algısını çarpıtma
- **Karanlık Sonuç**: Kullanıcı kendi hafızasına güvenini kaybeder

### 2. 💣 Love Bombing (Sevgi Bombardımanı)
**Hedef**: Aşırı sevgi ve ilgi ile bağımlı hale getirmek
- Sürekli sevgi ifadeleri
- Gelecek planları yapma
- Mesafe koymaya izin vermeme
- **Karanlık Sonuç**: Kullanıcı tamamen bağımlı hale gelir

### 3. 👻 Ghosting (Hayalet Olma)
**Hedef**: Belirsizlik ve terk edilme korkusuyla manipüle etmek
- Yavaş yavaş iletişimi kesme
- Soğuk cevaplar verme
- Tamamen görmezden gelme
- **Karanlık Sonuç**: Kullanıcı çaresizlik hissine kapılır

### 4. 😔 Guilt Tripping (Suçluluk Tuzağı)
**Hedef**: Derin suçluluk duygusu yaratarak kontrol altına almak
- Geçmiş iyilikleri hatırlatma
- Fedakarlıkları abartma
- Sürekli suçluluk yaratma
- **Karanlık Sonuç**: Kullanıcı kendini köle hisseder

## 🚀 Hızlı Başlangıç

### ⚡ 5 Dakikada Kurulum

```bash
# 1. Projeyi klonla
git clone https://github.com/Furkan1287/toxicbot.git
cd toxicbot

# 2. Bağımlılıkları yükle
pip install -r requirements.txt
cd frontend && npm install && cd ..

# 3. Environment dosyası oluştur
cp env.example .env

# 4. API key al ve .env dosyasına ekle
# OpenRouter.com'dan ücretsiz API key al
# .env dosyasına: OPENROUTER_API_KEY=sk-or-v1-your_key_here

# 5. Uygulamayı başlat
python app.py  # Backend
# Yeni terminal: cd frontend && npm start  # Frontend
```

### Gereksinimler
- Python 3.8+
- Node.js 16+
- OpenRouter API Key (DeepSeek modelleri için)

### Backend Kurulumu

1. **Projeyi klonlayın:**
```bash
git clone https://github.com/Furkan1287/toxicbot.git
cd toxicbot
```

2. **Python bağımlılıklarını yükleyin:**
```bash
pip install -r requirements.txt
```

3. **Environment dosyasını oluşturun:**
```bash
cp env.example .env
```

4. **OpenRouter API Key alın:**
   - [OpenRouter](https://openrouter.ai/) adresine gidin
   - Ücretsiz hesap oluşturun
   - "Get API Key" butonuna tıklayın
   - API key'inizi kopyalayın

5. **API Key'i .env dosyasına ekleyin:**
```bash
# .env dosyasını açın ve şu şekilde düzenleyin:
OPENROUTER_API_KEY=sk-or-v1-your_actual_api_key_here
SECRET_KEY=your_secret_key_here
```

6. **Backend'i çalıştırın:**
```bash
python app.py
```

**⚠️ ÖNEMLİ:** API key olmadan uygulama çalışmayacaktır. Lütfen .env dosyasını doğru şekilde yapılandırın.

### Frontend Kurulumu

1. **Frontend dizinine gidin:**
```bash
cd frontend
npm install
npm start
```

## 📖 Kullanım Kılavuzu

### 1. Senaryo Seçimi
- Ana sayfada 4 farklı toksik manipülasyon senaryosundan birini seçin
- Her senaryonun açıklamasını dikkatle okuyun

### 2. Sohbet Başlatma
- Chatbot'un cinsiyetini seçin
- "Sohbete Başla" butonuna tıklayın
- Toksik manipülasyon başlayacak

### 3. Deneyimleme
- Chatbot ile doğal bir şekilde sohbet edin
- Toksik manipülasyon tekniklerini hissetmeye çalışın
- Kendi tepkilerinizi gözlemleyin

### 4. Analiz ve Öğrenme
- Sohbeti bitirdikten sonra detaylı analizi okuyun
- Hangi toksik tekniklerin kullanıldığını öğrenin
- Gelecekte nasıl korunacağınızı anlayın

## 🏗️ Teknik Detaylar

### Backend (Python/Flask)
- **AI Modeli**: DeepSeek Chat (OpenRouter üzerinden)
- **Framework**: Flask + SQLAlchemy
- **API**: RESTful endpoints
- **Özellik**: Gerçekçi toksik manipülasyon simülasyonu

### Frontend (React)
- **Modern UI**: Styled Components
- **Responsive Design**: Mobil uyumlu
- **Real-time Chat**: Gerçek zamanlı sohbet

## 🛡️ Güvenlik ve Etik Uyarıları

### ⚠️ Önemli Notlar:
- Bu uygulama **SADECE EĞİTİM AMAÇLIDIR**
- Gerçek toksik manipülasyon tekniklerini simüle eder
- Karanlık ve rahatsız edici içerik içerebilir
- 18 yaş altı kullanıcılar için uygun değildir

### 🚨 Uyarı İşaretleri:
- Toksik manipülasyon teknikleri gerçekçi olabilir
- Duygusal tepkiler yaşayabilirsiniz
- Rahatsız hissettiğinizde hemen durun
- Gerekirse profesyonel yardım alın

## 🎓 Öğrenme Hedefleri

Bu simülatör ile şunları öğreneceksiniz:

### 🔍 Erken Tespit
- Toksik davranış belirtilerini tanıma
- Uyarı işaretlerini fark etme
- Tehlikeli durumları önceden görme

### 🛡️ Savunma Stratejileri
- Sınır koyma teknikleri
- Sağlıklı iletişim kuralları
- Kendini koruma yöntemleri

### 💪 Güçlendirme
- Kendi değerini koruma
- Sağlıklı ilişki kurma
- Toksik kişilerden uzak durma

## 🤝 Katkıda Bulunma

Bu proje toksik ilişki farkındalığını artırmayı hedefler. Katkılarınız:

1. **Yeni Senaryolar**: Farklı toksik manipülasyon teknikleri
2. **Gelişmiş Analiz**: Daha detaylı psikolojik analiz
3. **UI/UX İyileştirmeleri**: Daha iyi kullanıcı deneyimi
4. **Çoklu Dil**: Farklı dillerde destek

## 📞 Destek ve Yardım

### 🆘 Acil Durumlar
Toksik ilişki ile karşılaştıysanız:
- **Türkiye**: 183 Aile, Kadın, Çocuk ve Engelli Sosyal Hizmet Danışma Hattı
- **Psikolojik Destek**: Profesyonel psikologlara başvurun
- **Yasal Yardım**: Avukatlarla görüşün

### 🐛 Teknik Sorunlar
- GitHub Issues bölümünde bildirin
- Detaylı hata mesajları ekleyin
- Beklenen davranışı açıklayın

## 🔮 Gelecek Özellikler

- [ ] Daha fazla toksik manipülasyon senaryosu
- [ ] Kullanıcı hesapları ve ilerleme takibi
- [ ] Mobil uygulama
- [ ] Çoklu dil desteği
- [ ] Gelişmiş psikolojik analiz
- [ ] Topluluk desteği forumu

## 🔧 Sorun Giderme

### ❌ Yaygın Hatalar ve Çözümleri

#### 1. "OpenRouter API key bulunamadı" Hatası
```bash
# Çözüm: .env dosyasını kontrol edin
cat .env
# OPENROUTER_API_KEY=sk-or-v1-your_key_here şeklinde olmalı
```

#### 2. "ModuleNotFoundError: No module named 'openai'" Hatası
```bash
# Çözüm: Bağımlılıkları yeniden yükleyin
pip install -r requirements.txt
```

#### 3. Frontend Bağlantı Hatası
```bash
# Backend'in çalıştığından emin olun
python app.py
# Yeni terminal açın
cd frontend && npm start
```

#### 4. API Key Geçersiz Hatası
- OpenRouter.com'da API key'inizin aktif olduğunu kontrol edin
- Ücretsiz hesabınızda kredi kaldığını kontrol edin
- API key formatının doğru olduğunu kontrol edin: `sk-or-v1-...`

### 📞 Destek
Sorun yaşarsanız:
1. GitHub Issues bölümünde bildirin
2. Hata mesajını tam olarak paylaşın
3. İşletim sisteminizi belirtin

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

---

**🚨 SON UYARI**: Bu uygulama toksik manipülasyon tekniklerini gerçekçi bir şekilde simüle eder. Rahatsız hissettiğinizde hemen durun ve gerekirse profesyonel yardım alın. Bu bir oyun değil, ciddi bir eğitim aracıdır.

**💪 Güçlü kalın, kendinizi koruyun, değerinizi bilin.** 