
import React from 'react';
import { PosterData, STYLE_MAPPINGS } from '../types';

interface PosterFormProps {
  data: PosterData;
  setData: (data: PosterData) => void;
  onSubmit: () => void;
  loading: boolean;
}

const PosterForm: React.FC<PosterFormProps> = ({ data, setData, onSubmit, loading }) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setData({
          ...data,
          imageFile: file,
          imageBase64: (reader.result as string).split(',')[1]
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as any;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setData({ ...data, [name]: val });
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 px-2">
      {/* Upload Box */}
      <div className={`transition-all duration-500 ${data.imageBase64 ? 'opacity-60 hover:opacity-100' : 'opacity-100'}`}>
        <label className="group relative cursor-pointer block input-glow-white border-dashed rounded-2xl md:rounded-3xl p-4 md:p-6 text-center transition-all">
          <input type="file" className="sr-only" onChange={handleFileChange} accept="image/*" />
          <div className="flex flex-col items-center">
             <div className="w-8 h-8 md:w-10 md:h-10 mb-2 md:mb-3 rounded-full bg-white/5 flex items-center justify-center text-slate-400 group-hover:text-white transition-colors">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
               </svg>
             </div>
             <p className="text-[10px] md:text-xs font-bold text-slate-300 px-2 line-clamp-1 group-hover:text-white transition-colors uppercase tracking-widest">
               {data.imageFile ? `Đã chọn: ${data.imageFile.name}` : "Tải ảnh chân dung nghệ sĩ"}
             </p>
          </div>
        </label>
      </div>

      {/* Control Dashboard */}
      <div className="glass-panel p-3 md:p-4 rounded-3xl md:rounded-[2.5rem] shadow-2xl shadow-black/50 space-y-3 md:space-y-4 text-left">
        {/* Row 1: Primary Input */}
        <div className="input-glow-white flex items-center gap-3 px-3 py-2 md:px-4 md:py-3 rounded-xl md:rounded-2xl">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5 text-cyan-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <input 
            type="text" 
            name="ca_si"
            value={data.ca_si}
            onChange={handleChange}
            placeholder="NHẬP TÊN CA SĨ..."
            className="bg-transparent border-none outline-none text-white placeholder-slate-500 w-full text-sm md:text-lg font-black uppercase tracking-wide"
          />
        </div>

        {/* Row 2: Metadata Grid */}
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <div className="input-glow-white rounded-xl md:rounded-2xl px-3 py-2 md:px-4 md:py-3 flex flex-col cursor-pointer group">
              <span className="text-[8px] md:text-[9px] uppercase font-black text-slate-400 group-hover:text-white tracking-widest transition-colors">Câu lạc bộ</span>
              <input 
                name="clb"
                value={data.clb}
                onChange={handleChange}
                placeholder="Kết Nối Đam Mê"
                className="bg-transparent border-none outline-none text-white text-[11px] md:text-xs font-bold w-full mt-0.5"
              />
            </div>

            <div className="input-glow-white rounded-xl md:rounded-2xl px-3 py-2 md:px-4 md:py-3 flex flex-col cursor-pointer group">
              <span className="text-[8px] md:text-[9px] uppercase font-black text-slate-400 group-hover:text-white tracking-widest transition-colors">Sự kiện</span>
              <input 
                name="su_kien"
                value={data.su_kien}
                onChange={handleChange}
                placeholder="Giới Thiệu Đêm Nhạc"
                className="bg-transparent border-none outline-none text-white text-[11px] md:text-xs font-bold w-full mt-0.5"
              />
            </div>

            <div className="input-glow-white rounded-xl md:rounded-2xl px-3 py-2 md:px-4 md:py-3 flex flex-col cursor-pointer group sm:col-span-2 lg:col-span-1">
              <span className="text-[8px] md:text-[9px] uppercase font-black text-slate-400 group-hover:text-white tracking-widest transition-colors">Số báo danh</span>
              <input 
                name="sbd"
                value={data.sbd}
                onChange={handleChange}
                placeholder="SBD 023"
                className="bg-transparent border-none outline-none text-white text-[11px] md:text-xs font-bold w-full mt-0.5"
              />
            </div>
          </div>

          {/* Row 3: Time and Date Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
             <div className="input-glow-white rounded-xl md:rounded-2xl px-3 py-2 md:px-4 md:py-3 flex flex-col cursor-pointer group">
                <span className="text-[8px] md:text-[9px] uppercase font-black text-slate-400 group-hover:text-white tracking-widest transition-colors">Ngày chương trình</span>
                <input 
                  name="ngay"
                  value={data.ngay || ''}
                  onChange={handleChange}
                  placeholder="Ví dụ: T7 10-01"
                  className="bg-transparent border-none outline-none text-white text-[11px] md:text-xs font-bold w-full mt-0.5"
                />
              </div>
              <div className="input-glow-white rounded-xl md:rounded-2xl px-3 py-2 md:px-4 md:py-3 flex flex-col cursor-pointer group">
                <span className="text-[8px] md:text-[9px] uppercase font-black text-slate-400 group-hover:text-white tracking-widest transition-colors">Giờ chương trình</span>
                <input 
                  name="gio"
                  value={data.gio || ''}
                  onChange={handleChange}
                  placeholder="Ví dụ: 9:30 PM"
                  className="bg-transparent border-none outline-none text-white text-[11px] md:text-xs font-bold w-full mt-0.5"
                />
              </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div 
              onClick={() => setData({ ...data, aiRedesign: !data.aiRedesign })}
              className={`flex-1 input-glow-white rounded-xl md:rounded-2xl px-4 py-2 md:py-3 flex items-center justify-between cursor-pointer transition-all ${data.aiRedesign ? 'border-cyan-400/50 bg-cyan-500/10' : ''}`}
            >
              <div className="flex flex-col">
                <span className="text-[8px] md:text-[9px] uppercase font-black text-slate-400 tracking-widest">AI Redesign</span>
                <span className={`text-[9px] md:text-[10px] font-bold uppercase ${data.aiRedesign ? 'text-cyan-400' : 'text-slate-500'}`}>
                  {data.aiRedesign ? 'Đang Bật' : 'Đang Tắt'}
                </span>
              </div>
              <div className={`w-8 h-4 rounded-full relative transition-colors ${data.aiRedesign ? 'bg-cyan-500' : 'bg-slate-700'}`}>
                <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all shadow-sm ${data.aiRedesign ? 'left-4.5' : 'left-0.5'}`}></div>
              </div>
            </div>

            <div className="flex-1 input-glow-white rounded-xl md:rounded-2xl px-4 py-2 md:py-3 flex flex-col cursor-pointer group">
              <span className="text-[8px] md:text-[9px] uppercase font-black text-slate-400 group-hover:text-white tracking-widest transition-colors">Phong cách</span>
              <select 
                name="style"
                value={data.style}
                onChange={handleChange}
                className="bg-transparent border-none outline-none text-white text-[11px] md:text-xs font-bold appearance-none cursor-pointer mt-0.5 w-full"
              >
                {Object.entries(STYLE_MAPPINGS).map(([key, { label }]) => (
                  <option key={key} value={key} className="bg-slate-900">{label}</option>
                ))}
              </select>
            </div>

            <button 
              onClick={onSubmit}
              disabled={loading}
              className="btn-initiate py-3 sm:py-0 sm:px-10 rounded-xl md:rounded-2xl text-white font-black flex items-center justify-center gap-3 transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed group shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:shadow-[0_0_30px_rgba(34,211,238,0.6)]"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5 group-hover:scale-110 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                  <span className="uppercase tracking-widest text-[10px] md:text-xs">THIẾT KẾ</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Footer Badges */}
      <div className="flex flex-wrap justify-center gap-4 md:gap-8 py-2">
        <div className="flex items-center gap-2 text-[8px] md:text-[10px] font-bold text-slate-500 uppercase tracking-widest">
           <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse"></div>
           Engine: Nano Banana Pro
        </div>
        <div className="flex items-center gap-2 text-[8px] md:text-[10px] font-bold text-slate-500 uppercase tracking-widest">
           <div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse"></div>
           Face ID Guard
        </div>
        <div className="flex items-center gap-2 text-[8px] md:text-[10px] font-bold text-slate-500 uppercase tracking-widest">
           <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></div>
           Vietnamese Typography
        </div>
      </div>
    </div>
  );
};

export default PosterForm;
