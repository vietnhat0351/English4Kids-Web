import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/learn");
  }, [navigate]);
  return (
    <div>
      Home
    </div>
  )
}

export default HomePage
