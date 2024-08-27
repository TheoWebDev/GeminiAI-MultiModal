import { useState } from 'react'

export default function App() {
  const [image, setImage] = useState(null)

  const uploadImage = async (e) => {
    const formData = new FormData()
    formData.append('file', e.target.files[0])
    setImage(e.target.files[0])
    try {
      const options = {
        method: 'POST',
        body: formData
      }
      const response = await fetch('http://localhost:8000/upload', options)
      const data = await response.json()
      console.log(data);
    } catch (error) {
      console.log(error);
      
    }
  }
  

  return (
    <div className="app">
      {image && <img src={URL.createObjectURL(image)} />}
      <label htmlFor="files">Upload an image</label>
      <input onChange={uploadImage} id="files" type="file" accept="image/*" hidden />
    </div>
  );
}
