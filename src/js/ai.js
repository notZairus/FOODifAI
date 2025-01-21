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
    model: "meta-llama/Llama-3.2-11B-Vision-Instruct",
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `
            
            Tell me what filipino recipe i can make with this ingredients: ${ingredients}. 
            stricly only return a json string.
            if there is no given ingredient, or when the ingredient is not clear. return a random filipino recipe with all its ingredients, steps, and nutrients per 100 grams.
            
            the structure of json string u will return should look exactly like this.

            {
              "ai_message": "You didn't give me any ingredient. But heres a classic Adobo",
              "name": "Adobo",
              "ingredients": [
                "1 kg Chicken or Beef",
                "3 cloves of Garlic, 1 onion, 1 cup ofetta Tomato",
                "1 teaspoon of Ground Black Pepper, 1 teaspoon of Salt, 2 bay leaves",
                "2 tablespoons of Vinegar, 2 tablespoons of Soy Sauce, 1 tablespoon of Fish Sauce (optional)",
                "2 tablespoons of Vegetable Oil"
              ],
              "steps": [
                "Heat oil in a pan over medium heat",
                "Sauté garlic and onions until softened",
                "Add meat and cook until browned",
                "Add tomato, pepper, salt, and bay leaves",
                "Pour in vinegar, soy sauce, and fish sauce (if using)",
                "Simmer for 30 minutes",
                "Serve hot"
              ],
              "nutrients_per_100g": [
                "calories: 250",
                "carbohydrates: 20g",
                "protein: 15g",
                "fat: 10g",
                "sodium: 500mg",
                "potassium: 400mg",
                "cholesterol: 20mg"
              ]
            }

            `
          },
        ]
      }
    ],
    max_tokens: 500
  });
  
  return chatCompletion.choices[0].message.content;
}




export {
  scanImageUrl,
  generateRecipe
}