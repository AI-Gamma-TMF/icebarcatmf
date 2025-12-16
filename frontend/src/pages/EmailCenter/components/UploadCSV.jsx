import React, { useRef } from 'react'
import { Button } from "@themesberg/react-bootstrap";
const UploadCsvButton = () => {
  const fileInputRef = useRef(null)

  const handleButtonClick = () => {
   
    fileInputRef.current.click()
  }

  const handleFileChange = (event) => {
    const file = event.target.files[0] 
    if (file) {
    
  
      // Read the file content
      const reader = new FileReader()
  
      reader.onload = (e) => {
        const content = e.target.result
        // console.log('File Content:', content)
  
        // Example: Process CSV content
        const _rows = content.split('\n').map((row) => row.split(','))
      }
  
      reader.readAsText(file) // Read the file as text (ideal for CSV)
    }
  }
  

  return (
    <>
      <Button
        variant='success'
        className='f-right'
        style={{ height: '40px', width: '100px', marginRight: '6px' }}
        size='sm'
        onClick={handleButtonClick}
      >
        Upload CSV
      </Button>
      <input
        type='file'
        accept='.csv'
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
    </>
  )
}

export default UploadCsvButton
