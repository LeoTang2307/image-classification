import React from 'react'
import { useState } from 'react'
import axios from 'axios'
import './assets/global.css'

function App() {
  let file
  const [base64_str, setStr] = useState()
  const [scores, setScores] = useState(undefined)
  const [loading, setLoading] = useState(false)

  function onSubmit(event) {
    event.preventDefault()
    if (base64_str) {
      setLoading(true)
      axios.post('http://localhost:8000/', null, {params: {base64_str: base64_str}})
      .then(res => (setScores(res.data), setLoading(false), console.log(res.data)))
      .catch(err => console.log(err))
    }
    else {
      alert('You need to provide an image in order to classify!')
    }
  }

  function onRemove() {
    const dropArea = document.querySelector('.drag-area')
    dropArea.classList.remove('border-solid')
    dropArea.classList.add('border-dashed')
    dropArea.classList.add('p-[15%]')
    let originalTags = ''
    originalTags += "<img src='./src/assets/circle-arrow-up-solid.svg' class='h-[2.2em] mx-auto mb-1'></img>"
    originalTags += "<span class='text-lg'>Drag & Drop to Upload File</span>"
    dropArea.innerHTML = originalTags
    setStr()
    setScores(undefined)
  }

  function onDragEnter() {
    const dropArea = document.querySelector('.drag-area')
    dropArea.addEventListener('dragover', (event)=>{
      event.preventDefault()
      dropArea.classList.remove('border-dashed')
      dropArea.classList.add('border-solid')
    })
    dropArea.addEventListener('dragleave', ()=>{
      dropArea.classList.remove('border-solid')
      dropArea.classList.add('border-dashed')
    })
    dropArea.addEventListener('drop', (event)=>{
      event.preventDefault()
      file = event.dataTransfer.files[0]
      let fileReader = new FileReader()
      fileReader.onload = () => {
        let fileURL = fileReader.result
        setStr(fileURL)
        let imgTag = `<img value='${fileURL}' class='w-full h-full' src='${fileURL}'></img>`
        dropArea.classList.remove('p-[15%]')
        dropArea.innerHTML = imgTag
      }
      fileReader.readAsDataURL(file)
    })
  }

  return (
    <>
      <div className='bg-gradient-to-r from-lime-400 to-emerald-600 text-center p-5 font-bold text-xl'>
        <span>Image Classifier</span>
      </div>
      
      <div className='mx-[10%] my-[5%] text-white'>
        <ul className='flex items-center justify-between'>
          <li className='text-center'>
            <img className="w-40 h-40 rounded-full" src="./src/assets/cristiano_ronaldo.jpg" alt="Rounded avatar"></img>
            Cristiano Ronaldo
          </li>
          <li className='text-center'>
            <img className="w-40 h-40 rounded-full" src="./src/assets/dwayne_johnson.jpg" alt="Rounded avatar"></img>
            Dwayne Johnson
          </li>
          <li className='text-center'>
            <img className="w-40 h-40 rounded-full" src="./src/assets/elon_musk.jpg" alt="Rounded avatar"></img>
            Elon Musk
          </li>
          <li className='text-center'>
            <img className="w-40 h-40 rounded-full" src="./src/assets/jimmy_donaldson.jpg" alt="Rounded avatar"></img>
            Jimmy Donaldson
          </li>
          <li className='text-center'>
            <img className="w-40 h-40 rounded-full" src="./src/assets/sundar_pichai.jpg" alt="Rounded avatar"></img>
            Sundar Pichai
          </li>
        </ul>
      </div>

      <div className='flex'>
        <form onSubmit={onSubmit} className='h-[12em] mx-[10%] w-[20%]'>
          <div className='bg-white h-full p-3 rounded-md text-center'>
            <div onDragEnter={onDragEnter} className='drag-area h-full p-[15%] text-center border-2 border-dashed border-stone-400'>
              <img src='./src/assets/circle-arrow-up-solid.svg' className='h-[2.2em] mx-auto mb-1'></img>
              <span className='text-lg'>Drag & Drop to Upload File</span>
            </div>
          </div>
          <div className='flex items-center gap-2 mt-2'>
            <button type='submit' onClick={event => setScores(undefined)} className='p-2 text-center bg-emerald-500 hover:bg-emerald-600 rounded-lg text-white outline-none duration-300'>Classify</button>
            <button type='button' onClick={onRemove} className='p-2 text-center bg-amber-500 hover:bg-amber-600 rounded-lg text-white outline-none duration-300'>Remove</button>
          </div>
        </form>
        {typeof scores === 'object'
          ? <table className='bg-white h-[80%] w-[40%]'>
              <thead className='text-white bg-lime-500 text-left'>
                <tr className='border-b-2 border-black'>
                  <th className='p-1 border-r-2 border-black'>Person</th>
                  <th className='p-1 border-l-2 border-black'>Probability Score (0.00 - 1.00)</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(scores).map((key, idx) => (
                  <tr key={idx}>
                    <td className='p-1 border-r-2 border-b-2 border-black'>{key.replace('_',' ')}</td>
                    <td className='p-1 border-l-2 border-b-2 border-black'>{scores[key]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          : loading === true
          ? <div className="h-[80%] w-[40%] text-center p-14" role="status">
              <svg aria-hidden="true" className="inline w-10 h-10 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-green-500" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                  <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
              </svg>
              <span className="sr-only">Loading...</span>
            </div>
          : scores === 'Cannot detect' 
          ? <span className='text-red-500 text-2xl'>Cannot classify image. Classifier was not able to detect face and two eyes properly</span>
          : null
        }
      </div>
    </>
  )
}

export default App