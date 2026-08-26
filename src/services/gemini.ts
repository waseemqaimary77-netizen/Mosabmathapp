/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI } from "@google/genai";

const getApiKey = () => {
  return process.env.GEMINI_API_KEY || (import.meta as any).env?.VITE_GEMINI_API_KEY || '';
};

const getGenAI = () => {
  const apiKey = getApiKey();
  return new GoogleGenAI({
    apiKey: apiKey || 'dummy-key',
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
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
  "gemini-flash-latest",
  "gemini-3.1-flash-lite",
  "gemini-3.7-flash",
  "gemini-3.1-pro-preview"
];

const sleep = (ms: number) => new Promise(res => setTimeout(res, ms));

async function generateWithCascade(ai: any, contents: any, config: any = {}) {
  let lastError: any = null;

  for (const model of MODELS_CASCADE) {
    // Attempt up to 2 times per model if 503 / 429
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
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
        const isTransient = errMsg.includes('503') || errMsg.includes('UNAVAILABLE') || errMsg.includes('high demand') || errMsg.includes('429') || errMsg.includes('RESOURCE_EXHAUSTED');
        
        console.warn(`Model ${model} attempt ${attempt + 1} failed (${errMsg}).`);
        
        if (isTransient) {
          await sleep(attempt === 0 ? 500 : 1000);
        } else {
          // If non-transient, switch to next model immediately
          break;
        }
      }
    }
  }

  throw lastError || new Error("All models are currently busy.");
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
    if (msg.includes('503') || msg.includes('UNAVAILABLE') || msg.includes('high demand')) {
      return "🛑 **الأستاذ مصعب بحكيلك**: ولك السيرفر عليه ضغط عالي وطوابير طلاب زي يوم نتائج التوجيهي! 😅 انتظر 5 ثواني واضغط (أوجد الحل) مرة تانية يا بطل!";
    }
    if (msg.includes('429') || error?.status === 'RESOURCE_EXHAUSTED' || msg.includes('quota')) {
      return "🛑 **الأستاذ مصعب بحكيلك**: ولك من كتر الأسئلة والضغط مخي صار يغلي! استنى 15 ثانية وارجع اسألني يا بطل، لا تصير مستعجل زي أكرم!";
    }
    return "عذراً يا زلمة! صار خلل فني بسيط أثناء تحليل المسألة بسبب ضغط الشبكة. اضغط على الزر وجرب كمان مرة يا وحش!";
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
