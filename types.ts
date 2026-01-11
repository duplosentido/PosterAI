
export enum PosterStyle {
  NAM_VUI = 'NAM_VUI',
  BOLERO = 'BOLERO',
  MODERN = 'MODERN',
}

export interface PosterData {
  clb: string;
  su_kien: string;
  ca_si: string;
  sbd: string;
  ngay?: string; // Ngày diễn (Ví dụ: T7 10-01)
  gio?: string;  // Giờ diễn (Ví dụ: 9:30 PM)
  style: PosterStyle;
  imageFile: File | null;
  imageBase64: string | null;
  aiRedesign: boolean;
  fontPreference?: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export const FONT_SUGGESTIONS = {
  [PosterStyle.NAM_VUI]: [
    'Chữ không chân (Sans-serif) Bold trắng',
    'Chữ nghệ thuật Gradient Hồng-Vàng rực rỡ',
    'Font chữ hiện đại, sắc nét kiểu Showbiz',
    'Chữ vàng gold sang trọng'
  ],
  [PosterStyle.BOLERO]: [
    'Chữ Serif cổ điển mạ vàng 3D',
    'Thư pháp hiện đại (Calligraphy)',
    'Font lồng đèn hoài cổ'
  ],
  [PosterStyle.MODERN]: [
    'Chữ Neon phát sáng',
    'Font Sans-serif khối đậm',
    'Hiệu ứng Glitch'
  ]
};

export const STYLE_MAPPINGS = {
  [PosterStyle.NAM_VUI]: {
    label: '🎭 Style Chuyên Nghiệp',
    description: 'Classic theatre stage with heavy red velvet curtains, two strong red spotlights from top corners, highly reflective red marble floor reflecting the singer.',
    fontDescription: 'Tên ca sĩ sử dụng font Sans-serif Extra Bold với màu Gradient rực rỡ từ Hồng sang Vàng (Pink to Yellow). Các thông tin khác dùng font Sans-serif trắng hoặc vàng nghệ thuật.'
  },
  [PosterStyle.BOLERO]: {
    label: '🌟 Bolero Trữ Tình',
    description: 'Luxury concert stage, warm golden lights, bokeh background, elegant curtains.',
    fontDescription: 'Font Serif cổ điển hoặc Calligraphy mạ vàng 3D.'
  },
  [PosterStyle.MODERN]: {
    label: '🔥 Nhạc Trẻ Hiện Đại',
    description: 'Modern stage with neon geometric lights and futuristic vibes.',
    fontDescription: 'Font Sans-serif đậm kiểu Neon phát sáng.'
  }
};
