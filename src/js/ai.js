import { HfInference } from "@huggingface/inference";


const client = new HfInference(import.meta.env.VITE_HF);

async function scanImageUrl(imageUrl) {

  const chatCompletion = await client.chatCompletion({
    model: "meta-llama/Llama-3.2-11B-Vision-Instruct",
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "Tell me what ingredients are in the image. respond 1 word"
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
  
  return chatCompletion.choices[0].message.content;
}

async function generateRecipe(arrayOfIngredients) {
  let ingredients = arrayOfIngredients.map(ingredient => ingredient.ingredient).join("").split(".").join(", ")

  const chatCompletion = await client.chatCompletion({
    model: "Qwen/Qwen2.5-72B-Instruct",
    messages: [
      {
        'role': 'system',
        'content': `You are an assistant that suggests a well-known Filipino recipe based on a list of ingredients provided by the user. The recipe can include two additional ingredients the user didn’t mention. Always respond with a JSON string that starts with '{' and ends with '}'. Avoid any explanations or extra text outside the JSON string. If no ingredients are provided, or if the ingredients are unclear, only return ai message.`
      },
      {
        'role': 'user',
        'content': `"The structure of the JSON string you should return is as follows. Strictly adhere to this format: \n\n{\n  \"ai_message\": \"A brief message about the provided or missing ingredients.\",\n  \"is_ingredient\": true/false, \n  \"name\": \"Name of the Filipino recipe\",\n  \"ingredients\": [\n    \"List of ingredients, including user-provided and two additional ones if necessary\"\n  ],\n  \"steps\": [\n    \"Step-by-step instructions for the recipe\"\n  ],\n  \"nutrients_per_100g\": [\n    \"calories: X\",\n    \"carbohydrates: Xg\",\n    \"protein: Xg\",\n    \"fat: Xg\",\n    \"sodium: Xmg\",\n    \"potassium: Xmg\",\n    \"cholesterol: Xmg,\",\n   \"other nutrients: Xmg, ...]\n}\n\nRespond with the JSON string only."`
      },
      {
        "role": "user",
        "content": `Tell me what well-known Filipino recipe I can make with these ingredients: ${ingredients}. Strictly return a JSON string that starts with '{' and ends with '}'. If no ingredients are given or the input is unclear, return only ai_message.`
      }
    ],
    max_tokens: 500
  });

  console.log(chatCompletion.choices[0].message.content)
  
  return chatCompletion.choices[0].message.content;
}




export {
  scanImageUrl,
  generateRecipe
}