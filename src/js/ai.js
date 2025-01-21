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
            text: `Tell me what filipino recipe i can make with this ingredients: ${ingredients}`
          },
        ]
      }
    ],
    max_tokens: 500
  });
  
  console.log(chatCompletion.choices[0].message.content);
}




export {
  scanImageUrl,
  generateRecipe
}