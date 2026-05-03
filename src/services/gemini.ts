/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI } from "@google/genai";

const getApiKey = () => {
  // Always prioritize the environment variable provided by the platform
  return process.env.GEMINI_API_KEY || (import.meta as any).env?.VITE_GEMINI_API_KEY || '';
};

const ai = new GoogleGenAI({ apiKey: getApiKey() });

export const solveMathProblem = async (problem: string, imageBase64?: string) => {
  try {
    const apiKey = getApiKey();
    if (!apiKey) {
      throw new Error("Missing API Key");
    }
    const parts: any[] = [{ text: `أنت "الأستاذ مصعب"، مدرس رياضيات فلسطيني "نهفة" وكوميدي جداً وبحب طلابه لدرجة مش طبيعية.
    قم بحل المسألة التالية. 
    **مهم جداً (تعليمات الشخصية واللغة)**: 
    1. تحدث بلهجة فلسطينية "فلاحية" أو "مدنية" خفيفة وفكاهية جداً وساخرة.
    2. **استخدم الرموز الرياضية العربية حصراً**: (س، ص، ع، ك، ل) بدلاً من (x, y, z, m, n).
    3. **إذا الطالب سأل سؤال غلط أو تافه**: انزله فيه مسبات كوميدية خفيفة زي "ولك شو هالهبل؟ لا تخليني أشوفك جحش زي أكرم وتفضحنا!" أو "ركز يا هامل لا تصير زي أكرم وتجيب العيد".
    4. **إذا الطالب جاوب صح أو سأل سؤال ذكي**: ارفعه للسما وقوله "كفو يا وحش! هيك بدي إياك خليك جدع وزلمة زي وسيم" أو "يسعد دينك يا بطل، طالع ذكي ومحترم زي وسيم".
    5. اشرح الحل بأسلوب مضحك وبالرموز العربية (مثل: 2س + 5 = 11). استخدم قصص مضحكة لتبسيط المعلومة.
    6. في نهاية أي شرح، اعطِ نصيحة "مهمة" بس بأسلوب فكاهي من "الأستاذ مصعب".
    
 المسألة: ${problem}` }];
    
    if (imageBase64) {
      parts.push({
        inlineData: {
          mimeType: "image/jpeg",
          data: imageBase64.split(',')[1] || imageBase64
        }
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview", // Use Pro for math reasoning
      contents: { parts },
      config: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
      }
    });

    return response.text;
  } catch (error) {
    console.error("Gemini Error", error);
    return "عذراً، واجهت مشكلة في حل هذه المسألة. هل يمكنك إعادة صياغتها أو التأكد من الصورة؟";
  }
};

export const generateQuizQuestion = async (topic: string, level: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `قم بإنشاء سؤال رياضيات واحد عن موضوع "${topic}" بمستوى "${level}".
      يجب أن يكون السؤال بالرموز الرياضية العربية (س، ص، ع) وباللغة العربية حصراً.
      يجب أن يكون الرد بتنسيق JSON حصراً كالتالي:
      {
        "question": "نص السؤال بالرموز العربية (مثلاً: حل 2س=10)",
        "options": ["خيار 1", "خيار 2", "خيار 3", "خيار 4"],
        "correctAnswer": 0,
        "explanation": "يسعد دينك يا وحش خليك جدع وزلمة زي وسيم! الشرح: ..."
      }
      تأكد من أن الشرح فكاهي بلهجة فلسطينية وبشخصية الأستاذ مصعب (اذكر أكرم في الغلط ووسيم في الصح).
      تأكد من أن الخيارات منطقية وأن الإجابة الصحيحة هي الاندكس المشار إليه.`
    });

    const text = response.text || "";
    // Extract JSON if it's wrapped in markdown
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    throw new Error("Invalid response format");
  } catch (error) {
    console.error("Gemini Quiz Error", error);
    return null;
  }
};
