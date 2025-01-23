

async function urlToImg(imgUrl) {
  const response = await fetch(imgUrl);
  const blob = await response.blob();

  const imgFile = new File([blob], 'images.png', { type: 'image/png' })
  return imgFile;
}

async function postToServer(imgBlob) {
  let fdata = new FormData();
  fdata.append('file', imgBlob);
  fdata.append('api_key', import.meta.env.VITE_IMGHIPPO_API_KEY);
  
  let response = await fetch(`https://api.imghippo.com/v1/upload`, {
    method: "POST",
    body: fdata
  });

  let result = await response.json();

  console.log(result);
  return result.data.url;
}



export {
  urlToImg,
  postToServer,
}