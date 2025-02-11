import React, { useState } from 'react';
import axios from 'axios';

const ReceiptForm = () => {
  const [image, setImage] = useState(null);
  const [receiptData, setReceiptData] = useState(null);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('image', image);

    try {
      const result = await axios.post('http://localhost:5000/extract-receipt', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setReceiptData(result.data);
    } catch (error) {
      console.error('Error extracting receipt data:', error);
    } finally {
    }
  };

  return (
    <div>
      <h2>Extract Receipt Information</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Upload Image:</label>
          <input type="file" onChange={handleImageChange} />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default ReceiptForm;
