#!/usr/bin/env python3
"""
Manipülasyon Bot Backend Başlatıcı
"""

import os
import sys
from dotenv import load_dotenv

def check_environment():
    """Environment dosyasını kontrol et"""
    load_dotenv()
    
    if not os.getenv('DEEPSEEK_API_KEY'):
        print("❌ HATA: DEEPSEEK_API_KEY bulunamadı!")
        print("📝 Lütfen .env dosyasını oluşturun ve DeepSeek API key'inizi ekleyin.")
        print("🔗 API Key almak için: https://platform.deepseek.com/")
        return False
    
    if not os.getenv('SECRET_KEY'):
        print("⚠️  UYARI: SECRET_KEY bulunamadı, varsayılan değer kullanılacak.")
    
    return True

def main():
    """Ana fonksiyon"""
    print("🛡️  Manipülasyon Bot Backend Başlatılıyor...")
    print("=" * 50)
    
    # Environment kontrolü
    if not check_environment():
        sys.exit(1)
    
    try:
        # Flask uygulamasını import et ve çalıştır
        from app import app
        
        print("✅ Backend başarıyla başlatıldı!")
        print("🌐 Sunucu: http://localhost:5000")
        print("📊 Health Check: http://localhost:5000/api/health")
        print("=" * 50)
        print("🛑 Durdurmak için Ctrl+C tuşlayın")
        
        app.run(debug=True, host='0.0.0.0', port=5000)
        
    except ImportError as e:
        print(f"❌ Import hatası: {e}")
        print("📦 Lütfen gerekli paketleri yükleyin: pip install -r requirements.txt")
        sys.exit(1)
    except Exception as e:
        print(f"❌ Beklenmeyen hata: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main() 