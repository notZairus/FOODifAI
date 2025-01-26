import CameraIcon from "../assets/icons/camera.svg";
import { useEffect, useRef } from "react";
import { processImage } from "../js/ai.js";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { extractJson } from "../js/functions.js";


const MySwal = withReactContent(Swal);


export default function FoodAnalysis({ setResult }) {
  const vidRef = useRef(null);

  useEffect(() => {
    const openCamera = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment' 
        }
      });
      vidRef.current.srcObject = stream;
    }
    openCamera();
  }, []);

  function startAnalysis() {
    let canvas = document.createElement('canvas');
    canvas.width = vidRef.current.videoWidth;
    canvas.height = vidRef.current.videoHeight;

    let context = canvas.getContext('2d');
    context.drawImage(vidRef.current, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(async (blob) => {
      const previewImageUrl = URL.createObjectURL(blob);

      MySwal.fire({
        title: "Confirm Image? ",
        imageUrl: previewImageUrl,
        imageWidth: 150,
        imageHeight: 150,
        showCancelButton: true,
        confirmButtonText: "Confirm",
        showLoaderOnConfirm: true,
        preConfirm: async () => {
          try {
            let newImage = new File([blob], 'food.png', { type: 'image/png' });
            let result = await processImage(newImage, `
              Analyze the image and tell me the estimate nutrient of the FOOD in the image. Return a VALID JSON STRING with the following structure: \
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
              1. The \"nutrients\" key must contain an array of objects, where each object has \"name\" (e.g., 'protein') and \"amount\" (e.g., '35g'). \
              2. The response is ALWAYS a valid JSON string.
            `);
            setResult(extractJson(result));
          } catch(error) {
            MySwal.fire({
              title: 'Food Undetected',
              text: 'Ensure that the image is clear and well lit.',
              confirmButtonText: 'Close',
              icon: 'error'
            })
          }
      
        },
      });
    })
  }


  return (
    <>
      <div>
        <h2 className="text-accent mt-6 mb-1 text-center">Food Analysis</h2>
      </div>
      <div className="p-2 aspect-square w-full border-4 border-accent/30 rounded-lg">
        <video 
          ref={vidRef}
          playsInline
          autoPlay
          className="w-full h-full bg-red-400 rounded-lg overflow-hidden object-cover"
        >
        </video>
      </div>

      <div className="flex items-center justify-center mt-8">
        <button onClick={startAnalysis} className="aspect-square w-16 bg-accent active:bg-accent/80 rounded-full flex items-center justify-center">
          <img src={CameraIcon} alt="camera"  className="w-4/6"/>
        </button>
      </div>
      
    </>
  );
}