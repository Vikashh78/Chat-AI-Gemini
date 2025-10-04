import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

const MODEL_NAME = "gemini-2.5-pro";
const API_KEY = i"AIzaSyB729_wJo4JoJMLntdoj7Be1_FyFeG6yNU";

//helper function — convert uploaded image File → Base64 string
async function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

//main Gemini interaction function
async function runChat(prompt, imageFile = null) {
  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: MODEL_NAME });

  const generationConfig = {
    temperature: 0.9,
    topK: 1,
    topP: 1,
    maxOutputTokens: 2048,
  };

  const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
  ];

  //Build the input parts (prompt + optional image)
  const parts = [];

  if (prompt) {
    parts.push({ text: prompt });
  }

  if (imageFile) {
    // Convert File → base64 string and remove prefix
    const base64 = await fileToBase64(imageFile);
    parts.push({
      inlineData: {
        mimeType: imageFile.type,
        data: base64.split(",")[1], // remove "data:image/jpeg;base64,"
      },
    });
  }

  //Send both text and image together
  const result = await model.generateContent({
    contents: [{ role: "user", parts }],
    generationConfig,
    safetySettings,
  });

  const response = result.response.text();
  console.log("Gemini Response:", response);
  return response;
}

export default runChat;
