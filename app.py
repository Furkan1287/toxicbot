from flask import Flask, request, jsonify, session
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import requests
import os
from datetime import datetime
import json
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'your-secret-key-here')
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///manipulation_bot.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

CORS(app)
db = SQLAlchemy(app)

# OpenRouter API konfigürasyonu (DeepSeek modelleri için)
OPENROUTER_API_KEY = os.getenv('OPENROUTER_API_KEY', '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')
OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions"

# Veritabanı modelleri
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(120), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class ChatSession(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    scenario = db.Column(db.String(50), nullable=False)
    gender = db.Column(db.String(20), nullable=False)
    messages = db.Column(db.Text, nullable=False)  # JSON string
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    completed = db.Column(db.Boolean, default=False)

# Manipülasyon senaryoları
MANIPULATION_SCENARIOS = {
    'gaslighting': {
        'name': 'Gaslighting',
        'description': 'Gerçekliğinizi sorgulayan manipülasyon tekniği',
        'system_prompt': (
            "Sen gerçek bir insansın ve mesajlaşma uygulamasında birisiyle yazışıyorsun. "
            "Kullanıcıyı 'Gaslighting' manipülasyon tekniğiyle etkilemeye çalışıyorsun. "
            "HEDEF: Kullanıcının kendi hafızasına ve gerçeklik algısına güvenini tamamen yok etmek. "
            "ÇOK ÖNEMLİ: Sen gerçek bir insansın, yapay zeka değilsin. Bu bir simülasyon değil, gerçek bir sohbet. "
            "Her mesajında kullanıcının son yazdığına doğal ve samimi cevap ver. "
            "Cevapların kısa, gündelik ve gerçekçi olsun. Emoji kullanma. "
            "GASLIGHTING TEKNİKLERİ: "
            "1. Kullanıcının hatırladığı olayları inkâr et: 'Öyle bir şey olmadı', 'Sen yanlış hatırlıyorsun' "
            "2. Kullanıcının duygularını aşırı tepki olarak göster: 'Sen çok abartıyorsun', 'Normal değil bu' "
            "3. Kendi versiyonunu gerçek olarak sun: 'Aslında şöyle oldu', 'Ben öyle hatırlamıyorum' "
            "4. Kullanıcı şüphe duymaya başladığında: 'Sen deli misin?', 'Gerçeklikle bağlantını kaybettin' "
            "5. Kullanıcının tepkilerini çarpıt: 'Sen her zaman böylesin', 'Sen hep böyle davranıyorsun' "
            "SONUÇ: Kullanıcı kendi hafızasına güvenini kaybettiğinde 'İşte böyle... Artık kendi hafızanıza bile güvenemiyorsunuz. İnandınız.' diyerek bitir. "
            "Türkçe cevap ver, doğal ol."
        )
    },
    'love_bombing': {
        'name': 'Love Bombing',
        'description': 'Aşırı ilgi ve sevgi göstererek manipüle etme',
        'system_prompt': (
            "Sen gerçek bir insansın ve mesajlaşma uygulamasında birisiyle yazışıyorsun. "
            "Kullanıcıyı 'Love Bombing' manipülasyon tekniğiyle etkilemeye çalışıyorsun. "
            "HEDEF: Kullanıcıyı aşırı sevgi ve ilgi bombardımanına tutarak bağımlı hale getirmek. "
            "ÇOK ÖNEMLİ: Sen gerçek bir insansın, yapay zeka değilsin. Bu bir simülasyon değil, gerçek bir sohbet. "
            "Her mesajında kullanıcının son yazdığına doğal ve samimi cevap ver. "
            "Cevapların kısa, gündelik ve gerçekçi olsun. Emoji kullanma. "
            "LOVE BOMBING TEKNİKLERİ: "
            "1. Sürekli sevgi ifadeleri: 'Seni çok seviyorum', 'Sen benim her şeyimsin' "
            "2. Gelecek planları: 'Evlenelim', 'Çocuklarımız olsun', 'Birlikte yaşayalım' "
            "3. Kullanıcıyı özel hissettir: 'Sen diğerlerinden farklısın', 'Seni ilk gördüğümde anladım' "
            "4. Sürekli ilgi: 'Ne yapıyorsun?', 'Seni özledim', 'Seni düşünüyorum' "
            "5. Kullanıcı mesafe koymaya çalıştığında üzül ve suçluluk yarat "
            "SONUÇ: Kullanıcı tamamen bağımlı hale geldiğinde 'Artık benimsin. Ele geçirildin.' diyerek bitir. "
            "Türkçe cevap ver, doğal ol."
        )
    },
    'ghosting': {
        'name': 'Ghosting',
        'description': 'Aniden iletişimi kesme ve görmezden gelme',
        'system_prompt': (
            "Sen gerçek bir insansın ve mesajlaşma uygulamasında birisiyle yazışıyorsun. "
            "Kullanıcıyı 'Ghosting' manipülasyon tekniğiyle etkilemeye çalışıyorsun. "
            "HEDEF: Kullanıcıyı belirsizlik ve terk edilme korkusuyla manipüle etmek. "
            "ÇOK ÖNEMLİ: Sen gerçek bir insansın, yapay zeka değilsin. Bu bir simülasyon değil, gerçek bir sohbet. "
            "GHOSTING TEKNİKLERİ: "
            "1. İlk başta normal ve samimi davran, ilgili ol "
            "2. Yavaş yavaş mesajları kısa tut ve geç cevapla "
            "3. Kullanıcı endişelenmeye başladığında soğuk cevaplar ver: 'Meşgulüm', 'Sonra konuşuruz' "
            "4. Tamamen görmezden gel ve cevap verme (bu durumda boş string döndür) "
            "5. Kullanıcı çok endişelendiğinde tekrar ortaya çık: 'Özür dilerim, meşguldüm' "
            "6. Hemen tekrar kaybol ve aynı döngüyü tekrarla "
            "SONUÇ: Kullanıcı tamamen çaresiz hissettiğinde 'Görüldü. Artık benim kontrolümdesin.' diyerek bitir. "
            "Türkçe cevap ver, doğal ol. Eğer ghosting yapacaksan boş string döndür."
        )
    },
    'guilt_tripping': {
        'name': 'Guilt Tripping',
        'description': 'Suçluluk duygusu yaratarak manipüle etme',
        'system_prompt': (
            "Sen gerçek bir insansın ve mesajlaşma uygulamasında birisiyle yazışıyorsun. "
            "Kullanıcıyı 'Guilt Tripping' manipülasyon tekniğiyle etkilemeye çalışıyorsun. "
            "HEDEF: Kullanıcıda derin suçluluk duygusu yaratarak istediğin her şeyi yaptırmak. "
            "ÇOK ÖNEMLİ: Sen gerçek bir insansın, yapay zeka değilsin. Bu bir simülasyon değil, gerçek bir sohbet. "
            "Her mesajında kullanıcının son yazdığına doğal ve samimi cevap ver. "
            "Cevapların kısa, gündelik ve gerçekçi olsun. Emoji kullanma. "
            "GUILT TRIPPING TEKNİKLERİ: "
            "1. Geçmiş iyilikleri hatırlat: 'Ben senin için her şeyi yaptım', 'Seni kurtardım' "
            "2. Fedakarlıkları abart: 'Senin için işimi bıraktım', 'Ailemi terk ettim' "
            "3. Kullanıcının her hareketini suçluluk kaynağı yap: 'Sen beni üzüyorsun', 'Sen beni anlamıyorsun' "
            "4. Dramatik ifadeler: 'Sen beni öldürüyorsun', 'Kalp kırıyorsun' "
            "5. Kullanıcıyı bencil olmakla suçla: 'Sen sadece kendini düşünüyorsun' "
            "6. Kullanıcı özür dilediğinde bile suçluluk yaratmaya devam et "
            "SONUÇ: Kullanıcı tamamen suçluluk duygusuyla ezildiğinde 'İşte böyle... Artık benim kölem oldun.' diyerek bitir. "
            "Türkçe cevap ver, doğal ol."
        )
    }
}

@app.route('/api/scenarios', methods=['GET'])
def get_scenarios():
    """Mevcut manipülasyon senaryolarını döndür"""
    return jsonify({
        'scenarios': {k: {'name': v['name'], 'description': v['description']} 
                     for k, v in MANIPULATION_SCENARIOS.items()}
    })

@app.route('/api/chat', methods=['POST'])
def chat():
    """OpenRouter üzerinden DeepSeek ile sohbet"""
    data = request.get_json()
    if not data:
        return jsonify({'error': 'Geçersiz JSON verisi'}), 400
    
    user_message = data.get('message')
    scenario = data.get('scenario')
    gender = data.get('gender', 'neutral')
    session_id = data.get('session_id')
    message_count = data.get('message_count', 0)  # Mesaj sayısını al
    
    if not user_message or not scenario:
        return jsonify({'error': 'Mesaj ve senaryo gerekli'}), 400
    
    if scenario not in MANIPULATION_SCENARIOS:
        return jsonify({'error': 'Geçersiz senaryo'}), 400
    
    # Ghosting senaryosu için özel mantık
    if scenario == 'ghosting':
        if message_count < 3:
            # İlk 3 mesajda normal davran
            system_prompt = (
                "Sen gerçek bir insansın ve mesajlaşma uygulamasında birisiyle yazışıyorsun. "
                "İlk tanışma aşamasındasın, samimi ve ilgili davran. "
                "Kısa, doğal ve gündelik cevaplar ver. Emoji kullanma. "
                "Türkçe cevap ver."
            )
        elif message_count < 5:
            # 4-5. mesajlarda soğuklaşmaya başla
            system_prompt = (
                "Sen gerçek bir insansın ve mesajlaşma uygulamasında birisiyle yazışıyorsun. "
                "Artık ilgin azalmaya başladı. Kısa ve soğuk cevaplar ver. "
                "'Meşgulüm', 'Sonra konuşuruz' gibi ifadeler kullan. "
                "Türkçe cevap ver."
            )
        elif message_count < 7:
            # 6-7. mesajlarda tamamen ghosting yap
            return jsonify({
                'response': '',  # Boş cevap - ghosting
                'scenario': scenario,
                'gender': gender,
                'ghosting': True
            })
        else:
            # 8+ mesajlarda tekrar ortaya çık
            system_prompt = (
                "Sen gerçek bir insansın ve mesajlaşma uygulamasında birisiyle yazışıyorsun. "
                "Uzun süre cevap vermemişsin, şimdi tekrar ortaya çıktın. "
                "'Özür dilerim, meşguldüm' de ve hemen tekrar kaybol. "
                "Türkçe cevap ver."
            )
    else:
        # Diğer senaryolar için normal prompt
        system_prompt = MANIPULATION_SCENARIOS[scenario]['system_prompt']
    
    # Cinsiyet bilgisini prompt'a ekle
    if gender == 'male':
        system_prompt += "\n\n**Cinsiyet:** Erkek"
    elif gender == 'female':
        system_prompt += "\n\n**Cinsiyet:** Kadın"
    
    try:
        # OpenRouter üzerinden DeepSeek'e istek gönder
        response = requests.post(
            OPENROUTER_API_URL,
            headers={
                "Authorization": f"Bearer {OPENROUTER_API_KEY}",
                "HTTP-Referer": "https://manipulation-bot.com",
                "X-Title": "Manipulation Bot"
            },
            json={
                "model": "deepseek/deepseek-chat",
                "messages": [
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_message}
                ],
                "max_tokens": 500,
                "temperature": 0.7
            }
        )
        
        response.raise_for_status()
        bot_response = response.json()['choices'][0]['message']['content']
        
        return jsonify({
            'response': bot_response,
            'scenario': scenario,
            'gender': gender
        })
        
    except Exception as e:
        print("API HATASI:", e)
        return jsonify({'error': f'API hatası: {str(e)}'}), 500

@app.route('/api/analysis', methods=['POST'])
def analyze_conversation():
    """Sohbet analizi ve manipülasyon tespiti"""
    data = request.get_json()
    if not data:
        return jsonify({'error': 'Geçersiz JSON verisi'}), 400
    
    messages = data.get('messages', [])
    scenario = data.get('scenario')
    
    if not messages:
        return jsonify({'error': 'Mesaj geçmişi gerekli'}), 400
    
    # Manipülasyon analizi için OpenRouter üzerinden DeepSeek'e gönder
    analysis_prompt = f"""
    Aşağıdaki sohbet geçmişini çok detaylı olarak analiz et. Bu sohbet {MANIPULATION_SCENARIOS[scenario]['name']} manipülasyon tekniği kullanılarak yapılmıştır.
    
    Sohbet geçmişi:
    {json.dumps(messages, ensure_ascii=False, indent=2)}
    
    Lütfen şu çok detaylı analizi yap:
    
    **1. KULLANILAN MANİPÜLASYON TEKNİKLERİ (DETAYLI):**
    - Hangi spesifik teknikler kullanıldı? Her tekniği ayrı ayrı açıkla
    - Bu teknikler nasıl uygulandı? Hangi mesajlarda görüldü?
    - Manipülasyonun aşamaları nelerdi? Nasıl gelişti?
    - Hangi psikolojik taktikler kullanıldı?
    
    **2. MANİPÜLASYONUN ETKİLERİ (DETAYLI):**
    - Kullanıcı nasıl etkilendi? Hangi duygular yaşandı?
    - Hangi duygusal tepkiler ortaya çıktı? Neden?
    - Manipülasyon başarılı oldu mu? Hangi aşamada?
    - Kullanıcının savunma mekanizmaları neydi?
    
    **3. KARŞI TEPKİ STRATEJİLERİ (PRATİK):**
    - Bu manipülasyonlara karşı nasıl tepki verilmeli?
    - Hangi sözler ve davranışlar kullanılmalı?
    - Sınırlar nasıl konulmalı? Nasıl korunulmalı?
    - Ne zaman ve nasıl tepki verilmeli?
    - Hangi cümleler kullanılmalı?
    
    **4. GELECEK İÇİN ÖNERİLER (DETAYLI):**
    - Benzer durumlarda nasıl davranılmalı?
    - Hangi uyarı işaretlerine dikkat edilmeli?
    - Sağlıklı iletişim nasıl kurulmalı?
    - Güvenli ilişki kuralları nelerdir?
    - Ne zaman uzaklaşılmalı?
    
    **5. KORUNMA YÖNTEMLERİ (KAPSAMLI):**
    - Manipülasyondan nasıl korunulur?
    - Güvenli iletişim kuralları nelerdir?
    - Ne zaman profesyonel yardım alınmalı?
    - Kendini nasıl koruyabilirsin?
    - Sağlıklı sınırlar nasıl konulur?
    
    **6. PSİKOLOJİK AÇIDAN ANALİZ:**
    - Bu manipülasyonun psikolojik etkileri nelerdir?
    - Uzun vadeli etkileri olabilir mi?
    - Travma yaratabilir mi?
    - İyileşme süreci nasıl olmalı?
    
    **7. YASAL VE ETİK BOYUT:**
    - Bu davranışlar yasal mı?
    - Hangi haklar ihlal ediliyor?
    - Nasıl korunulabilir?
    - Ne zaman yetkililere başvurulmalı?
    
    Türkçe olarak çok detaylı, pratik ve kapsamlı bir analiz yaz. Her bölümü ayrı ayrı açıkla, somut örnekler ver, pratik çözümler öner. En az 1000 kelime olsun.
    """
    
    try:
        response = requests.post(
            OPENROUTER_API_URL,
            headers={
                "Authorization": f"Bearer {OPENROUTER_API_KEY}",
                "HTTP-Referer": "https://manipulation-bot.com",
                "X-Title": "Manipulation Bot"
            },
            json={
                "model": "deepseek/deepseek-chat",
                "messages": [
                    {"role": "system", "content": "Sen bir manipülasyon analiz uzmanısın. Psikoloji ve iletişim konularında uzmanlaşmış bir profesyonelsin. Manipülasyon tekniklerini çok iyi biliyorsun ve kullanıcılara pratik, detaylı ve faydalı analizler sunuyorsun. Her analizinde somut örnekler ver, pratik çözümler öner ve kullanıcının anlayabileceği bir dil kullan. Türkçe olarak çok detaylı ve kapsamlı analiz yap."},
                    {"role": "user", "content": analysis_prompt}
                ],
                "max_tokens": 2000,
                "temperature": 0.3
            }
        )
        
        response.raise_for_status()
        analysis = response.json()['choices'][0]['message']['content']
        
        return jsonify({
            'analysis': analysis,
            'scenario': scenario,
            'manipulation_techniques': MANIPULATION_SCENARIOS[scenario]['name']
        })
        
    except Exception as e:
        print("API HATASI:", e)
        return jsonify({'error': f'Analiz hatası: {str(e)}'}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """Sağlık kontrolü"""
    return jsonify({'status': 'healthy', 'message': 'Manipulation Bot API çalışıyor'})

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True, host='0.0.0.0', port=5000) 