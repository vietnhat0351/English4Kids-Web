import React, { useEffect } from "react";
import "./styles.css";
import { useNavigate } from "react-router-dom";

const Home = () => {

  const navigate = useNavigate();

  useEffect(() => {
    navigate("/learn");
  }, [navigate]);

  return (
    
    <div className="container">
      <h1>Home</h1>
    </div>
  );
};

export default Home;
