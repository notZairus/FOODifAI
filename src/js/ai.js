import { HfInference } from "@huggingface/inference";
import { extractJson } from "./functions";


const client = new HfInference(import.meta.env.VITE_HF);


//RecipeGenerator ======================================================================

async function scanImageUrl(imageUrl) {
  const chatCompletion = await client.chatCompletion({
    model: "meta-llama/Llama-3.2-11B-Vision-Instruct",
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `Analyze and tell me what ingredient is in the image. You STRICTLY need to respond with a JSON string starting with '{' and ends with '}' the json structure is: 
                  "{
                    "ai_message": string,
                    "image_is_intelligible": boolean,
                    "there_is_an_ingredient": boolean,
                    "ingredient": string
                  }"
                .
                All your messages,remarks, and notes MUST be in the "ai_message" key. So that you will surely return a JSON string.
                `
          },
          {
            type: "image_url",
            image_url: {
              url: imageUrl
            }
          }
        ]
      }
    ],
    max_tokens: 500
  });
  return extractJson(chatCompletion.choices[0].message.content);
}

async function generateRecipe(arrayOfIngredients) {
  let ingredients = arrayOfIngredients.map(ingredient => ingredient.ingredient).join(", ");

  const chatCompletion = await client.chatCompletion({
    model: "mistralai/Mistral-Nemo-Instruct-2407",
    messages: [
      {
        "role": "system",
        "content": "You are an assistant that suggests a well-known Filipino recipe based on the ingredients provided by the user. You can exclude some of the user's ingredients if they don't fit the recipe and replace them with more common Filipino ingredients. You may also add up to two additional ingredients not mentioned by the user to complete the recipe. Always respond with a valid JSON string that strictly adheres to the following structure: \
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
                    } \
                    \
                    If no ingredients are provided, or the ingredients are unclear, only return an \"ai_message\" key with a message and set \"is_ingredient\" to false. Strictly follow the JSON format above in every response."
      },
      {
        "role": "user",
        "content": `Tell me what common Filipino recipe I can make with these ingredients: ${ingredients}. Strictly return a JSON string that starts with '{' and ends with '}'. If no ingredients are given or the input is unclear, return only ai_message.`
      }
    ],
    max_tokens: 500
  });
  return extractJson(chatCompletion.choices[0].message.content);
}

// =======================================================================================


//FoodAnalysis ===========================================================================

async function analyzeFood(imageUrl) {
  const chatCompletion = await client.chatCompletion({
    model: "meta-llama/Llama-3.2-11B-Vision-Instruct",
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `Analyze and tell me the estimate nutrient of the FOOD in the image. Return a VALID JSON STRING with the following structure: \
                  { \
                    \"ai_message\": String, \
                    \"image_is_intelligible\": Boolean, \
                    \"there_is_a_food\": Boolean, \
                    \"name_of_food\": String, \
                    \"total_calorie\": String, \
                    \"nutrients\": Array, \
                    \"is_healthy\": Boolean \
                  }. \
                  ENSURE: \
                  1. ALL responses, explanations, or remarks are included ONLY in the \"ai_message\" key. \
                  2. The \"nutrients\" key must contain an array of objects, where each object has \"name\" (e.g., 'protein') and \"amount\" (e.g., '35g'). \
                  3. The response is ALWAYS a valid JSON string. \
                  4. STRICTLY No additional text outside the JSON structure is returned.
                  5.ALWAYS RETURN A JSON STRING`
          },
          {
            type: "image_url",
            image_url: {
              url: imageUrl
            }
          }
        ]
      }
    ],
    max_tokens: 500
  });
  console.log(chatCompletion.choices[0].message.content);
  return extractJson(chatCompletion.choices[0].message.content);
}

// ==========================================================================================


export {
  scanImageUrl,
  generateRecipe,
  analyzeFood
}