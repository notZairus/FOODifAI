import { HfInference } from "@huggingface/inference";

async function scanUrl(imageUrl) {

  const client = new HfInference(import.meta.env.VITE_HF);

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


export {
  scanUrl
}