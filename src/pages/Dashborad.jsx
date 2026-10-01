import React, { useEffect, useState } from 'react'
import axiosInstance from '../utilits/api/axiosInstance';

const Dashborad = () => {

  const [status, setStatus] = useState('Testing connection...');
  const [error, setError] = useState(null);

  useEffect(() => {
    // Replace with your actual backend URL

    axiosInstance.get('https://ibh-amin-serveerr.vercel.app/')
      .then(response => {
        setStatus(`Success! Server says: ${JSON.stringify(response.data)}`);
      })
      .catch(err => {
        setError(`Failed! ${err.message}`);
      });
  }, []);
  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h2>Backend Connection Test</h2>
      <p><strong>Status:</strong> {status}</p>
      {error && <p style={{ color: 'red' }}><strong>Error:</strong> {error}</p>}
    </div>
  )
}

export default Dashborad