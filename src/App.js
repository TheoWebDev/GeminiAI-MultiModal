import { useState } from 'react'

export default function App() {
  const [image, setImage] = useState(null)
  const [value, setValue] = useState('')
  const [response, setResponse] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(null)

  const surpriseOptions = [
    'Does the image have a whale ?',
    'Is the image fabulously pink ?',
    'Does the image have puppies ?',
    'Does the image have vehicles ?'
  ]

  const surprise = () => {
    const randomValue = surpriseOptions[Math.floor(Math.random() * surpriseOptions.length)]
    setValue(randomValue)
  }

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
    } catch (error) {
      setError(error)
    }
  }

  const analyzeImage = async () => {
    if (!image) {
      setError('Error! Must have an existing image.')
      return
    }
    try {
      setLoading(true)
      const options = {
        method: 'POST',
        body: JSON.stringify({
          message: value
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      }
      const response = await fetch('http://localhost:8000/gemini', options)
      const data = await response.text()
      setResponse(data)
      setLoading(false)
    } catch (error) {
      setError('Something did not work! Please try again.')
      
    }
  }

  const clear = () => {
    setImage(null)
    setValue('')
    setResponse('')
    setError('')
    setLoading(null)
  }
  

  return (
    <div className="app">
      <section className='search-section'>
        <div className='image-container'>
          {image && <img className='image' src={URL.createObjectURL(image)} alt={image.name} />}
        </div>
        {!response && <p className='extra-info'>
          <span>
            <label htmlFor="files">Upload an image </label>
            <input onChange={uploadImage} id="files" type="file" accept="image/*" hidden />
          </span>
          to ask question about.
        </p>}
        <p>What do you want to know about this image ?
          <button className='surprise' onClick={surprise} disabled={response}>Surprise me</button>
        </p>
        <div className='input-container'>
          <input
            value={value}
            placeholder='What is in the image...'
            onChange={e => setValue(e.target.value)}
          />
          {(!response && !error) && <button onClick={analyzeImage}>Ask me</button>}
          {(response || error) && <button onClick={clear}>Clear</button>}
        </div>
        {error && <p>{error}</p>}
        {loading && <p>Loading...</p>}
        {response && <p className='answer'>{response}</p>}
      </section>
    </div>
  );
}
