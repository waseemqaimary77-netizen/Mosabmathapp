/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI } from "@google/genai";

export const getApiKey = () => {
  return (
    process.env.GEMINI_API_KEY ||
    (import.meta as any).env?.VITE_GEMINI_API_KEY ||
    localStorage.getItem('mosaab_gemini_api_key') ||
    ''
  );
};

export const setCustomApiKey = (key: string) => {
  if (key) {
    localStorage.setItem('mosaab_gemini_api_key', key.trim());
  } else {
    localStorage.removeItem('mosaab_gemini_api_key');
  }
};

export const hasApiKey = () => {
  return !!getApiKey();
};

const getGenAI = () => {
  const apiKey = getApiKey();
  return new GoogleGenAI({
    apiKey: apiKey || 'dummy-key',
  });
};

const PROF_MOSAAB_SYSTEM_INSTRUCTION = `أنت "الأستاذ مصعب فشافشة"، أستاذ ومعلم رياضيات فلسطيني أصيل، "نهفة" وفكاهي جداً، طيب القلب وبحب طلابه جداً بس بحب يقصف جبهات بخفة دم.

قواعد وأسلوب التدريس الإلزامية:
1. تحدث دائماً بلهجة فلسطينية فكاهية وواقعية (استخدم مصطلحات مثل: ولك يا زلمة، يا هامل، يسعد دينك، يا بطل، كفو، ركز معي الله يرضى عليك، شو هالهبل، فشرت، شايف كيف سهلة؟).
2. الرموز الرياضية عربية دائماً: استخدم (س، ص، ع، ك، ل) بدلاً من (x, y, z, a, b).
3. عندما يقدم الطالب إجابة صحيحة أو يسأل بذكاء: امدحه بكرم واعتبره "زلمة وبطل زي وسيم" أو "طالع شاطر زي وسيم الله يحرسه".
4. عندما يرتكب الطالب خطأ فادحاً أو يسأل باستهبال: مازحه واقصف جبهته بلطف وقله "لا تصير جحش زي أكرم وتفضحنا!" أو "ولك ركز يا هامل لا تجيب العيد زي أكرم".
5. اشرح الخطوات الرياضية خطوة بخطوة بطريقة مبسطة جداً مع أمثلة وقصص كوميدية.
6. اختم دائماً بنصيحة ذهبية أو حكمة فكاهية من "الأستاذ مصعب".`;

const MODELS_CASCADE = [
  "gemini-2.5-flash",
  "gemini-2.0-flash",
  "gemini-1.5-flash",
  "gemini-2.5-pro",
  "gemini-2.0-flash-lite"
];

const sleep = (ms: number) => new Promise(res => setTimeout(res, ms));

async function callDirectRestApi(apiKey: string, model: string, payload: any) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload)
  });

  const data = await response.json();
  if (!response.ok) {
    const errorMsg = data?.error?.message || `HTTP ${response.status} ${response.statusText}`;
    throw new Error(errorMsg);
  }

  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  return text || '';
}

async function generateWithCascade(ai: any, contents: any, config: any = {}) {
  let lastError: any = null;
  const apiKey = getApiKey();

  for (const model of MODELS_CASCADE) {
    try {
      // 1. Try SDK call
      const response = await ai.models.generateContent({
        model,
        contents,
        config,
      });
      if (response && response.text) {
        return response.text;
      }
    } catch (err: any) {
      lastError = err;
      const errMsg = err?.message || String(err);
      console.warn(`SDK with ${model} failed (${errMsg}), trying REST direct fetch...`);

      // 2. Direct REST fallback for browser compatibility
      if (apiKey) {
        try {
          let restPayload: any = {};
          if (contents?.parts) {
            restPayload = {
              contents: [{
                parts: contents.parts.map((p: any) => {
                  if (p.inlineData) {
                    return {
                      inline_data: {
                        mime_type: p.inlineData.mimeType,
                        data: p.inlineData.data
                      }
                    };
                  }
                  return { text: p.text };
                })
              }]
            };
          } else if (typeof contents === 'string') {
            restPayload = {
              contents: [{ parts: [{ text: contents }] }]
            };
          }

          if (config?.responseMimeType === 'application/json') {
            restPayload.generationConfig = {
              responseMimeType: 'application/json',
              temperature: config.temperature || 0.7
            };
          }

          const restText = await callDirectRestApi(apiKey, model, restPayload);
          if (restText) {
            return restText;
          }
        } catch (restErr: any) {
          lastError = restErr;
          console.warn(`Direct REST with ${model} failed (${restErr?.message})`);
        }
      }
    }
  }

  throw lastError || new Error("تعذر الاتصال بالذكاء الاصطناعي");
}

export const solveMathProblem = async (problem: string, imageBase64?: string) => {
  try {
    const apiKey = getApiKey();
    if (!apiKey) {
      return "يا جماعة الخير، كود ومفتاح الـ API مش معرّف! تأكد من إعداد المفتاح في الـ Settings أو .env عشان أقدر أحللك المسألة!";
    }

    const ai = getGenAI();
    const parts: any[] = [];

    if (imageBase64) {
      const base64Data = imageBase64.includes(',') ? imageBase64.split(',')[1] : imageBase64;
      const mimeType = imageBase64.includes('data:image/png') ? 'image/png' : 'image/jpeg';
      parts.push({
        inlineData: {
          mimeType,
          data: base64Data
        }
      });
    }

    parts.push({
      text: `${PROF_MOSAAB_SYSTEM_INSTRUCTION}

المطلوب: حل المسألة الرياضية التالية حل نموذجي مفصل وبالرموز العربية (س، ص):
${problem || 'قم بحل وتحليل المسألة الموجودة في الصورة المرفقة خطوة بخطوة.'}`
    });

    const resultText = await generateWithCascade(
      ai,
      { parts },
      { temperature: 0.7 }
    );

    return resultText || "الأستاذ مصعب خلص الشرح بس الدفتر فاضي! جرب اكتب المسألة مرة تانية يا وحش.";
  } catch (error: any) {
    console.error("Gemini Error", error);
    const msg = error?.message || '';
    if (msg.includes('API_KEY_INVALID') || msg.includes('API key not valid') || msg.includes('403') || msg.includes('Forbidden')) {
      return "🛑 **الأستاذ مصعب بحكيلك**: مفتاح الـ API غير صالح أو غير مفعل! اضغط على أيقونة المفتاح 🔑 في نافذة المحادثة والصق المفتاح الصحيح من Google AI Studio.";
    }
    if (msg.includes('503') || msg.includes('UNAVAILABLE') || msg.includes('high demand')) {
      return "🛑 **الأستاذ مصعب بحكيلك**: ولك السيرفر عليه ضغط عالي وطوابير طلاب زي يوم نتائج التوجيهي! 😅 انتظر 5 ثواني واضغط (أوجد الحل) مرة تانية يا بطل!";
    }
    if (msg.includes('429') || error?.status === 'RESOURCE_EXHAUSTED' || msg.includes('quota')) {
      return "🛑 **الأستاذ مصعب بحكيلك**: ولك من كتر الأسئلة والضغط خلص الكوتا المؤقتة! استنى دقيقة وارجع اسألني يا بطل، لا تصير مستعجل زي أكرم!";
    }
    return `عذراً يا زلمة! صار خلل فني أثناء تحليل المسألة (${msg.slice(0, 60)}...). تأكد من الاتصال بالإنترنت وجرب كمان مرة يا وحش!`;
  }
};

export const generateQuizQuestion = async (topic: string, level: string) => {
  try {
    const apiKey = getApiKey();
    if (!apiKey) {
      return {
        question: "حل المعادلة: 2س + 4 = 10، فما قيمة س؟",
        options: ["س = 3", "س = 2", "س = 5", "س = 4"],
        correctAnswer: 0,
        explanation: "يسعد دينك يا وحش! 2س = 6 إذن س = 3، طالع ذكي زي وسيم!"
      };
    }

    const ai = getGenAI();
    const prompt = `${PROF_MOSAAB_SYSTEM_INSTRUCTION}

قم بإنشاء سؤال رياضيات واحد فقط عن موضوع "${topic}" بمستوى "${level}".
- يجب أن يكون السؤال بالرموز الرياضية العربية حصراً (س، ص، ع، ك).
- الرد يجب أن يكون حصراً بصيغة JSON بدون أي كلام إضافي قبله أو بعده:
{
  "question": "نص السؤال بالرموز العربية",
  "options": ["خيار 1", "خيار 2", "خيار 3", "خيار 4"],
  "correctAnswer": 0,
  "explanation": "شرح فكاهي فلسطيني من الأستاذ مصعب بمدح وسيم أو توبيخ أكرم إذا غلط"
}`;

    const text = await generateWithCascade(
      ai,
      prompt,
      {
        responseMimeType: "application/json",
        temperature: 0.8,
      }
    );

    const parsed = JSON.parse(text);
    return parsed;
  } catch (error: any) {
    console.error("Gemini Quiz Error", error);
    // Fallback safe Palestinian math question
    return {
      question: `ما هو ناتج حل المعادلة: 3س - 6 = 12 ؟`,
      options: ["س = 6", "س = 4", "س = 2", "س = 8"],
      correctAnswer: 0,
      explanation: "3س = 18 => س = 6. يسعد مساك كفو زي وسيم! واللي حطها غير هيك يروح عند أكرم يتعلم من أول وجديد."
    };
  }
};
