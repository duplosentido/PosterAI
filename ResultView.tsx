
import React, { useState, useRef, useEffect } from 'react';
import { PosterData, FONT_SUGGESTIONS } from '../types';

interface ResultViewProps {
  imageUrl: string | null;
  loading: boolean;
  posterData: PosterData;
  onRefineFont: (font: string) => void;
}

type EditMode = 'NONE' | 'FILTERS' | 'CROP' | 'FONT';

const ResultView: React.FC<ResultViewProps> = ({ imageUrl, loading, posterData, onRefineFont }) => {
  const [editMode, setEditMode] = useState<EditMode>('NONE');
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [editedUrl, setEditedUrl] = useState<string | null>(null);
  const [selectedFont, setSelectedFont] = useState<string | null>(null);
  
  const [crop, setCrop] = useState({ x: 5, y: 5, width: 90, height: 90 });
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageDisplayRef = useRef<HTMLImageElement>(null);

  const fontSuggestions = FONT_SUGGESTIONS[posterData.style] || [];

  useEffect(() => {
    if (imageUrl) {
      setEditedUrl(imageUrl);
      setEditMode('NONE');
      setBrightness(100);
      setContrast(100);
      setCrop({ x: 5, y: 5, width: 90, height: 90 });
      setSelectedFont(posterData.fontPreference || null);
    }
  }, [imageUrl, posterData.fontPreference]);

  const handleDownload = () => {
    const finalUrl = editedUrl || imageUrl;
    if (!finalUrl) return;
    const link = document.createElement('a');
    link.href = finalUrl;
    link.download = `SanKhauVang_Poster_${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const applyChanges = () => {
    if (!imageUrl || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const sourceX = (crop.x / 100) * img.width;
      const sourceY = (crop.y / 100) * img.height;
      const sourceWidth = (crop.width / 100) * img.width;
      const sourceHeight = (crop.height / 100) * img.height;

      canvas.width = sourceWidth;
      canvas.height = sourceHeight;
      
      ctx.filter = `brightness(${brightness}%) contrast(${contrast}%)`;
      ctx.drawImage(img, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, sourceWidth, sourceHeight);
      
      setEditedUrl(canvas.toDataURL('image/png'));
      setEditMode('NONE');
    };
    img.src = imageUrl;
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (editMode !== 'CROP') return;
    isDragging.current = true;
    dragStart.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || editMode !== 'CROP' || !imageDisplayRef.current) return;
    const rect = imageDisplayRef.current.getBoundingClientRect();
    
    const deltaX = ((e.clientX - dragStart.current.x) / rect.width) * 100;
    const deltaY = ((e.clientY - dragStart.current.y) / rect.height) * 100;

    setCrop(prev => ({
      ...prev,
      x: Math.max(0, Math.min(100 - prev.width, prev.x + deltaX)),
      y: Math.max(0, Math.min(100 - prev.height, prev.y + deltaY))
    }));

    dragStart.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  return (
    <div className="glass-panel p-4 md:p-8 rounded-3xl md:rounded-[2.5rem] flex flex-col items-center justify-center min-h-[400px] md:min-h-[600px] border border-white/5 shadow-2xl overflow-hidden relative">
      <div className="flex flex-col sm:flex-row items-center justify-between w-full mb-6 md:mb-10 gap-4">
        <div className="text-center sm:text-left">
          <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-tighter">Kết quả thiết kế</h2>
          <p className="text-[9px] md:text-[10px] text-cyan-400 font-bold uppercase tracking-widest mt-1">NANO BANANA PRO • 4K RENDER</p>
        </div>
        
        {!loading && imageUrl && (
           <div className="flex flex-wrap gap-2 w-full sm:w-auto">
              <button 
                onClick={() => setEditMode('FONT')} 
                className={`flex-1 sm:flex-none px-4 py-2 rounded-xl border font-bold text-[10px] md:text-xs transition-all flex items-center gap-2 ${editMode === 'FONT' ? 'bg-amber-500 border-amber-400 text-white' : 'bg-white/5 border-white/10 text-slate-300'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>
                FONT CHỮ
              </button>
              <button 
                onClick={() => setEditMode('FILTERS')} 
                className={`flex-1 sm:flex-none px-4 py-2 rounded-xl border font-bold text-[10px] md:text-xs transition-all flex items-center gap-2 ${editMode === 'FILTERS' ? 'bg-cyan-500 border-cyan-400 text-white' : 'bg-white/5 border-white/10 text-slate-300'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
                CHỈNH MÀU
              </button>
              <button 
                onClick={() => setEditMode('CROP')} 
                className={`flex-1 sm:flex-none px-4 py-2 rounded-xl border font-bold text-[10px] md:text-xs transition-all flex items-center gap-2 ${editMode === 'CROP' ? 'bg-purple-500 border-purple-400 text-white' : 'bg-white/5 border-white/10 text-slate-300'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758L5 19m0-14l4.121 4.121" /></svg>
                CẮT ẢNH
              </button>
              <button 
                onClick={handleDownload}
                className="flex-1 sm:flex-none btn-initiate px-4 md:px-6 py-2 rounded-xl text-white font-bold flex items-center justify-center gap-2 text-[10px] md:text-xs"
              >
                TẢI VỀ
              </button>
           </div>
        )}
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center space-y-8 p-20 text-center">
          <div className="relative w-20 h-20">
            <div className="absolute inset-0 border-4 border-cyan-500/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-xl font-black text-white uppercase tracking-wider animate-pulse">Nano Banana Pro Đang Thiết Kế...</p>
        </div>
      ) : imageUrl ? (
        <div className="w-full flex flex-col lg:flex-row gap-8 items-center">
          <div 
            className="relative group w-full max-w-xs md:max-w-sm shrink-0 overflow-hidden rounded-2xl border border-white/10"
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <img 
              ref={imageDisplayRef}
              src={editedUrl || imageUrl} 
              alt="Poster" 
              className="relative w-full h-auto cursor-default"
              style={{ filter: `brightness(${brightness}%) contrast(${contrast}%)` }}
              onMouseDown={handleMouseDown}
            />

            {editMode === 'CROP' && (
              <div 
                className="absolute border-2 border-dashed border-cyan-400 bg-cyan-400/10 pointer-events-none shadow-[0_0_0_1000px_rgba(0,0,0,0.6)]"
                style={{
                  left: `${crop.x}%`,
                  top: `${crop.y}%`,
                  width: `${crop.width}%`,
                  height: `${crop.height}%`
                }}
              >
                <div className="absolute top-0 left-0 bg-cyan-400 text-black text-[8px] px-1 font-bold uppercase tracking-widest">Khung hình</div>
              </div>
            )}

            {(editMode === 'FILTERS') && (
              <div className="absolute bottom-0 left-0 w-full p-4 bg-black/80 backdrop-blur-md space-y-4 animate-in slide-in-from-bottom-2">
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-bold text-slate-400"><span>ĐỘ SÁNG</span><span>{brightness}%</span></div>
                  <input type="range" min="50" max="150" value={brightness} onChange={(e) => setBrightness(parseInt(e.target.value))} className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-cyan-400" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-bold text-slate-400"><span>TƯƠNG PHẢN</span><span>{contrast}%</span></div>
                  <input type="range" min="50" max="150" value={contrast} onChange={(e) => setContrast(parseInt(e.target.value))} className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-purple-400" />
                </div>
              </div>
            )}

            {editMode === 'FONT' && (
              <div className="absolute bottom-0 left-0 w-full p-4 bg-black/80 backdrop-blur-md space-y-3 animate-in slide-in-from-bottom-2 max-h-[60%] overflow-y-auto">
                 <p className="text-[10px] font-black text-amber-400 uppercase tracking-widest text-center mb-2">Gợi ý font cho ca sĩ</p>
                 {fontSuggestions.map((font, idx) => (
                    <button 
                      key={idx}
                      onClick={() => setSelectedFont(font)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-[10px] font-medium transition-all ${selectedFont === font ? 'bg-amber-500 text-white' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}
                    >
                      {font}
                    </button>
                 ))}
              </div>
            )}
          </div>

          <div className="flex-1 w-full space-y-6">
            {editMode !== 'NONE' ? (
              <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-4 animate-in fade-in duration-300 text-left">
                <h3 className="text-sm font-black text-cyan-400 uppercase tracking-widest flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                  {editMode === 'FONT' ? 'Tinh chỉnh Typography' : 'Trình Chỉnh Sửa'}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {editMode === 'CROP' ? 'Nhấn giữ và kéo ảnh để di chuyển vùng cắt. Ảnh sẽ được cắt theo khung nét đứt.' : 
                   editMode === 'FONT' ? 'Chọn kiểu font gợi ý cho Tên Ca Sĩ ở bảng điều khiển trên ảnh, sau đó nhấn "CẬP NHẬT FONT" để AI thiết kế lại.' :
                   'Kéo các thanh trượt bên dưới ảnh để thay đổi sắc thái của poster.'}
                </p>
                <div className="flex gap-2">
                  <button onClick={() => { setEditMode('NONE'); setBrightness(100); setContrast(100); }} className="flex-1 py-3 rounded-xl bg-white/5 text-[10px] font-black uppercase border border-white/10">BỎ QUA</button>
                  {editMode === 'FONT' ? (
                    <button 
                      disabled={!selectedFont}
                      onClick={() => {
                        if (selectedFont) onRefineFont(selectedFont);
                        setEditMode('NONE');
                      }} 
                      className="flex-1 py-3 rounded-xl btn-initiate text-[10px] font-black uppercase disabled:opacity-50"
                    >
                      CẬP NHẬT FONT
                    </button>
                  ) : (
                    <button onClick={applyChanges} className="flex-1 py-3 rounded-xl btn-initiate text-[10px] font-black uppercase">LƯU KẾT QUẢ</button>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-6 text-left">
                <div className="p-6 rounded-3xl bg-white/5 border border-white/5 space-y-3">
                  <h4 className="text-[10px] font-black text-cyan-400 uppercase tracking-widest flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M11.3 1.047a1 1 0 01.897.95l1.046 20.41a1 1 0 01-1.794.636l-1.046-20.41a1 1 0 01.897-.986z" clipRule="evenodd" /></svg>
                    Sân Khấu Vàng AI
                  </h4>
                  <p className="text-slate-400 text-xs italic">
                    "Tác phẩm đã được tối ưu phông chữ Tiếng Việt bởi công nghệ Nano Banana Pro. Bạn có thể chọn trực tiếp kiểu font chữ cho Tên Ca Sĩ từ các gợi ý nghệ thuật."
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-center">
                    <p className="text-[8px] text-slate-500 font-bold uppercase">Engine</p>
                    <p className="text-xs font-bold text-white">Nano Banana Pro</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-center">
                    <p className="text-[8px] text-slate-500 font-bold uppercase">Vietnamese</p>
                    <p className="text-xs font-bold text-white">100% Accurate</p>
                  </div>
                </div>
              </div>
            )}
          </div>
          <canvas ref={canvasRef} className="hidden" />
        </div>
      ) : (
        <div className="text-center space-y-4 opacity-20 py-20">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          <p className="text-sm font-bold uppercase tracking-[0.5em] text-slate-500">Đang chờ khởi tạo...</p>
        </div>
      )}
    </div>
  );
};

export default ResultView;
