import { HfInference } from "@huggingface/inference";


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

  console.log(chatCompletion.choices[0].message.content);
  
  return chatCompletion.choices[0].message.content;
}

async function generateRecipe(arrayOfIngredients) {
  let ingredients = arrayOfIngredients.map(ingredient => ingredient.ingredient).join(", ");

  const chatCompletion = await client.chatCompletion({
    model: "mistralai/Mistral-Nemo-Instruct-2407",
    
    messages: [
      {
        'role': 'system',
        'content': `You are an assistant that suggests a well-known Filipino recipe based on a list of ingredients provided by the user you can exclude SOME of the given ingredient to be able to suggest a more common filipino ingredients. The recipe can include two additional ingredients the user didn’t mention. Always respond with a JSON string that starts with '{' and ends with '}'. Avoid any explanations or extra text outside the JSON string. If no ingredients are provided, or if the ingredients are unclear, only return ai message.
                    The structure of the JSON string you should return is as follows. Strictly adhere to this format: \n\n{\n  \"ai_message\": \"A brief message about the provided or missing ingredients.\",\n  \"is_ingredient\": true/false, \n  \"name\": \"Name of the Filipino recipe\",\n  \"ingredients\": [\n    \"List of ingredients, including user-provided and two additional ones if necessary\"\n  ],\n  \"steps\": [\n    \"Step-by-step instructions for the recipe\"\n  ],\n  \"nutrients_per_100g\": [\n    \"calories: X\",\n    \"carbohydrates: Xg\",\n    \"protein: Xg\",\n    \"fat: Xg\",\n    \"sodium: Xmg\",\n    \"potassium: Xmg\",\n    \"cholesterol: Xmg,\"]\n}\n\nRespond with the JSON string only`
      },
      {
        "role": "user",
        "content": `Tell me what common Filipino recipe I can make with these ingredients: ${ingredients}. Strictly return a JSON string that starts with '{' and ends with '}'. If no ingredients are given or the input is unclear, return only ai_message.`
      }
    ],
    max_tokens: 500
  });

  console.log(chatCompletion.choices[0].message.content)
  
  return chatCompletion.choices[0].message.content;
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
            text: `Analyze the food in the image and tell me the estimated nutrients of the food. You must return a json string, the structured of the JSON is the following: 
                  "{
                    "ai_message": String,
                    "image_is_intelligible": Boolean,
                    "there_is_a_food": Boolean,
                    "name_of_food": String,
                    "total_calorie": String,
                    "nutrients": Array,
                    "is_healthy": Boolean
                  }"
                .
                STRICTLY All your messages/remarks should be on the "ai_message" key.
                STRICTLY RETURN A JSON FILE
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

  console.log(chatCompletion.choices[0].message.content);
  
  return chatCompletion.choices[0].message.content;
}

// ==========================================================================================


export {
  scanImageUrl,
  generateRecipe,
  analyzeFood
}