
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import PosterForm from './components/PosterForm';
import ResultView from './components/ResultView';
import ChatBot from './components/ChatBot';
import { PosterData, PosterStyle } from './types';
import { gemini } from './geminiService';

const App: React.FC = () => {
  const [posterData, setPosterData] = useState<PosterData>({
    clb: 'CLB XUÂN KHÊ KẾT NỐI BỐN PHƯƠNG',
    su_kien: 'GIỚI THIỆU ĐÊM NHẠC LIVE MUSIC',
    ca_si: 'VUI DƯƠNG',
    sbd: 'SBD 023',
    ngay: 'T7 10-01',
    gio: '9:30 PM',
    style: PosterStyle.NAM_VUI,
    imageFile: null,
    imageBase64: null,
    aiRedesign: true, // Mặc định bật
    fontPreference: undefined,
  });

  const [resultImage, setResultImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [needsApiKey, setNeedsApiKey] = useState(false);

  useEffect(() => {
    const checkApiKey = async () => {
      // @ts-ignore
      if (window.aistudio && typeof window.aistudio.hasSelectedApiKey === 'function') {
        // @ts-ignore
        const hasKey = await window.aistudio.hasSelectedApiKey();
        setNeedsApiKey(!hasKey);
      }
    };
    checkApiKey();
  }, []);

  const handleOpenApiKeyDialog = async () => {
    // @ts-ignore
    if (window.aistudio && typeof window.aistudio.openSelectKey === 'function') {
      // @ts-ignore
      await window.aistudio.openSelectKey();
      setNeedsApiKey(false);
    }
  };

  const handleCreatePoster = async (customData?: PosterData) => {
    const activeData = customData || posterData;
    if (!activeData.imageBase64) {
      alert("Vui lòng tải ảnh chân dung nghệ sĩ lên!");
      return;
    }
    if (!activeData.ca_si) {
      alert("Hãy nhập tên nghệ sĩ để bắt đầu thiết kế!");
      return;
    }

    setLoading(true);
    setResultImage(null);

    try {
      const imageUrl = await gemini.generatePoster(activeData);
      setResultImage(imageUrl);
      setTimeout(() => {
        document.getElementById('result-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 500);
    } catch (error: any) {
      console.error(error);
      if (error.message?.includes("Requested entity was not found")) {
        setNeedsApiKey(true);
      } else {
        alert("Có lỗi: " + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRefineFont = (font: string) => {
    const newData = { ...posterData, fontPreference: font };
    setPosterData(newData);
    handleCreatePoster(newData);
  };

  return (
    <div className="min-h-screen relative flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="pt-32 pb-16 md:pt-40 md:pb-20 px-4 md:px-6 hero-gradient overflow-hidden">
          <div className="max-w-4xl mx-auto text-center space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/30 bg-amber-500/10 text-[9px] md:text-[10px] font-black text-amber-400 uppercase tracking-widest mx-auto">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </span>
              Thiết kế bởi Nam Vui Designer
            </div>
            
            <h2 className="text-4xl sm:text-5xl md:text-8xl font-black tracking-tight leading-none text-white px-2">
              Sáng Tạo <br />
              <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent text-glow">Poster Ca Sĩ</span>
            </h2>
            
            <p className="text-slate-400 text-base md:text-xl font-medium max-w-2xl mx-auto leading-relaxed px-4">
              Thiết kế Poster Ca Sĩ trong 1 click <br className="hidden md:block" />
            </p>

            <PosterForm 
              data={posterData} 
              setData={setPosterData} 
              onSubmit={() => handleCreatePoster()} 
              loading={loading}
            />
          </div>
        </section>

        {/* Result Section */}
        {(loading || resultImage) && (
          <section id="result-section" className="py-12 md:py-20 px-4 md:px-6 bg-slate-950/50">
            <div className="max-w-6xl mx-auto">
              <ResultView 
                imageUrl={resultImage} 
                loading={loading}
                posterData={posterData}
                onRefineFont={handleRefineFont}
              />
            </div>
          </section>
        )}
      </main>

      <ChatBot />

      {needsApiKey && (
        <div className="fixed bottom-0 left-0 w-full p-4 bg-red-900/90 backdrop-blur-md border-t border-red-500/30 z-[60] flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6">
          <p className="text-white text-xs md:text-sm font-bold text-center">Vui lòng chọn API Key trả phí để sử dụng Nano Banana Pro</p>
          <button 
            onClick={handleOpenApiKeyDialog}
            className="bg-white text-red-900 px-6 py-1.5 rounded-full font-black text-[10px] uppercase tracking-widest shadow-xl whitespace-nowrap"
          >
            Chọn Key
          </button>
        </div>
      )}

      <footer className="py-8 md:py-12 border-t border-white/5 text-center text-slate-600 text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] md:tracking-[0.4em] px-4">
        <p>&copy; by Nam Vui Designer 2026 • Visual Stage Engine</p>
      </footer>
    </div>
  );
};

export default App;
