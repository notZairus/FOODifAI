import { HfInference } from "@huggingface/inference";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { extractJson } from "./functions";


export async function generateRecipe(arrayOfIngredients) {
  console.log('generating recipe...');
  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  let ingredients = arrayOfIngredients.map(ingredient => ingredient.ingredient).join(", ");

  let prompt = `Tell me what common Filipino recipe I can make with these ingredients: ${ingredients}.
                Strictly return a json structure with this structure:
                  { \
                      \"ai_message\": \"A brief message about the provided or missing ingredients.\", \
                      \"is_ingredient\": true/false, \
                      \"name\": \"Name of the Filipino recipe\", \
                      \"ingredients\": [ \
                        \"List of ingredients, including user-provided and adjusted ones if necessary\" \
                      ], \
                      \"steps\": [ \
                        \"Step-by-step instructions for the recipe\" \
                      ], \
                      \"nutrients_per_100g\": [ \
                        \"calories: X\", \
                        \"carbohydrates: Xg\", \
                        \"protein: Xg\", \
                        \"fat: Xg\", \
                        \"sodium: Xmg\", \
                        \"potassium: Xmg\", \
                        \"cholesterol: Xmg\" \
                      ] \
                    }
                `

  const result = await model.generateContent(prompt);
  return extractJson(result.response.text());
}

export async function processImage(file, prompt) {
  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_KEY);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

  const base64Data = await convertFileToBase64(file);

  const result = await model.generateContent([
      {
          inlineData: {
              data: base64Data.split(",")[1],
              mimeType: "image/jpeg",
          },
      },
      prompt
  ]);

  return result.response.text();
}

function convertFileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}