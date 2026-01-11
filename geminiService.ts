
import { GoogleGenAI, GenerateContentResponse, Chat } from "@google/genai";
import { PosterData, STYLE_MAPPINGS, PosterStyle } from "./types";

const IMAGE_MODEL = 'gemini-3-pro-image-preview';
const CHAT_MODEL = 'gemini-3-pro-preview';

export class GeminiService {
  async generatePoster(data: PosterData): Promise<string> {
    if (!data.imageBase64) throw new Error("Chưa có ảnh đầu vào.");

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

    const style = STYLE_MAPPINGS[data.style];
    const defaultFontDesc = style.fontDescription;
    
    // Determine instructions for singer name
    let singerFontInstruction = data.fontPreference 
      ? `RIÊNG TÊN CA SĨ "${data.ca_si}": Thiết kế theo kiểu ${data.fontPreference}.`
      : defaultFontDesc;

    if (data.style === PosterStyle.NAM_VUI && !data.fontPreference) {
      singerFontInstruction = `TÊN CHÍNH "${data.ca_si}": Phải sử dụng font Sans-serif Extra Bold, kích thước CỰC LỚN, màu GRADIENT từ HỒNG sang VÀNG rực rỡ, có hiệu ứng đổ bóng sâu (deep shadow) để tách biệt khỏi phông nền.`;
    }

    // Handle dynamic footer time information
    let timeFooterInstruction = "";
    if (data.ngay || data.gio) {
      const datePart = data.ngay || "";
      const timePart = data.gio || "";
      timeFooterInstruction = `
- PHẦN THÔNG TIN THỜI GIAN (FOOTER): 
  + Vị trí: Ở sát cạnh dưới của poster, nằm trên mặt sàn đá đỏ phản chiếu.
  + Phong cách: Chữ màu VÀNG CHANH (Vibrant Yellow), font Sans-serif đậm, có độ phát sáng nhẹ.
  + Nội dung: "${datePart}  |  LIVE MUSIC  |  ${timePart}" (Ngăn cách bởi các vạch dọc trắng mỏng).`;
    }

    const redesignDirective = data.aiRedesign 
      ? `CHẾ ĐỘ NÂNG CẤP CHÂN DUNG (AI REDESIGN):
- PHONG THÁI: Đĩnh đạc, sang trọng, phong thái nghệ sĩ chuyên nghiệp, phù hợp hoàn hảo với lứa tuổi trung niên.
- TRANG PHỤC: Thay thế bằng bộ đồ biểu diễn cao cấp (ví dụ: áo dài dạ hội sequin lộng lẫy, váy dạ yến sang trọng hoặc bộ suit/tuxedo lịch lãm).
- TƯ THẾ: Đứng thẳng, phong thái tự tin, có thể cầm micro vintage có chân đứng (stand microphone).
- YÊU CẦU BẮT BUỘC: GIỮ NGUYÊN 100% CHI TIẾT KHUÔN MẶT gốc của người trong ảnh.`
      : `CHẾ ĐỘ GIỮ NGUYÊN GỐC (FAITHFUL ENHANCE):
- GIỮ NGUYÊN trang phục và tư thế của nghệ sĩ. 
- HẬU KỲ: Tách nền cực kỳ sắc nét (hair-level isolation), nâng cấp độ phân giải 4K, hiệu chỉnh ánh sáng đỏ spotlight hòa quyện vào chủ thể.`;

    const prompt = `BẠN LÀ GIÁM ĐỐC NGHỆ THUẬT CỦA "NAM VUI DESIGNER". 
NHIỆM VỤ: TẠO POSTER CA NHẠC 4K ĐẲNG CẤP SHOWBIZ, TUÂN THỦ NGHIÊM NGẶT BỐ CỤC VÀ PHỐI MÀU SAU:

1. BỐI CẢNH (STAGE SETTING):
- Sân khấu rèm nhung ĐỎ ĐÔ (Deep Red Velvet) xếp nếp cổ điển và sang trọng.
- 2 đèn Spotlight ĐỎ rực rỡ chiếu chéo từ 2 góc trên cùng xuống, tạo hiệu ứng tia sáng hình nón rõ rệt.
- Sàn đá marble đỏ đen bóng loáng (Red & Black Polished Floor) phản chiếu chân thực bóng của nghệ sĩ.

2. QUY TẮC VĂN BẢN VÀ PHỐI MÀU (TEXT & COLORS):
- DÒNG CÂU LẠC BỘ (TOP): "${data.clb}". 
  + Màu sắc: VÀNG GOLD sang trọng (Premium Golden), font Sans-serif thanh mảnh, căn giữa.
- DÒNG SỰ KIỆN: "GIỚI THIỆU ĐÊM NHẠC LIVE MUSIC". 
  + Màu sắc: TRẮNG ÁNH BẠC (Glowing Silver White), In hoa, Bold, căn giữa, nằm ngay dưới CLB.

- KHU VỰC TRUNG TÂM (NGHỆ SĨ):
  + CHỮ "CA SĨ": (Màu TRẮNG, font Sans-serif, kích thước NHỎ). VỊ TRÍ: Phải đặt ngay phía trên (ở vị trí đỉnh) của tên chính "${data.ca_si}". Đây là một nhãn phụ nhỏ.
  + TÊN CHÍNH: "${data.ca_si}" (Kích thước CỰC LỚN, font Sans-serif Extra Bold, màu GRADIENT HỒNG - VÀNG rực rỡ).
  + SỐ BÁO DANH: "${data.sbd}" (Chữ TRẮNG, font Sans-serif, cỡ vừa). VỊ TRÍ: Nằm bên phải của tên ca sĩ.

3. QUY TẮC NGĂN CHẶN LỖI TRÌNH BÀY:
- CẤM: Tuyệt đối không lặp lại tên ca sĩ "${data.ca_si}" và SBD ở bất kỳ nơi nào khác trên poster. Chỉ xuất hiện 1 lần duy nhất tại trung tâm.
- Đảm bảo chữ "CA SĨ" nhỏ luôn nằm phía trên tên nghệ sĩ.
${timeFooterInstruction}
- GÓC PHẢI DƯỚI: "By NAM VUI DESIGNER" (Chữ trắng nhỏ).

4. KỸ THUẬT:
${redesignDirective}
- Chất lượng: 4K Ultra HD, Tỉ lệ 3:4.
- Ánh sáng: Sắc nét, rực rỡ, mang không khí đêm nhạc biểu diễn trực tiếp.
- Văn bản Tiếng Việt phải có dấu đầy đủ và chính xác 100%.`;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: IMAGE_MODEL,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: data.imageFile?.type || 'image/png',
              data: data.imageBase64,
            },
          },
          { text: prompt }
        ]
      },
      config: {
        imageConfig: {
          aspectRatio: "3:4",
          imageSize: "4K"
        }
      }
    });

    let resultUrl = '';
    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          resultUrl = `data:image/png;base64,${part.inlineData.data}`;
          break;
        }
      }
    }

    if (!resultUrl) throw new Error("Không thể tạo được ảnh poster.");
    return resultUrl;
  }

  createChat(): Chat {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
    return ai.chats.create({
      model: CHAT_MODEL,
      config: {
        systemInstruction: 'Bạn là trợ lý "Nam Vui Designer", chuyên thiết kế poster ca nhạc rèm đỏ chuyên nghiệp.',
      },
    });
  }
}

export const gemini = new GeminiService();
