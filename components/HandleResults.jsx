import React, { useState } from 'react'

const HandleResults = () => {
  const [loading, setLoading] = useState(false);

  const handleGenerateResults = async () => {
    setLoading(true);
    const response = await fetch('/api/generateResults');
    const data = await response.json();
    console.log(data.message);
    setLoading(false);
  };

  

  return (
    <div className='text-black font-bold h-[300px]'>
      <button onClick={handleGenerateResults} className='bg-green-200-200 h-[50px] w-[200px] mt-[20px] ml-[20px] rounded-lg' disabled={loading}>
        {loading ? 'Generating...' : 'Generate Results'}
      </button>
    </div>
  );
}

export default HandleResults