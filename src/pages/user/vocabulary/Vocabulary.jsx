import React, { useEffect, useState } from "react";
import customFetch from "../../../utils/customFetch";
import bg from "../../../assets/bgbutton.png";

import "./Vocabulary.css";
import { useNavigate } from "react-router-dom";

function Vocabulary() {
  const [topics, setTopic] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    // API call to get topics
    // setTopics(response.data);
    const response = customFetch
      .get(`/api/v1/vocabulary/all-topics`)
      .then((response) => {
        if (response.status === 200) {
          setTopic(response.data);
          console.log(response.data);
        }
      });
  }, []);

  return (
    <div className="v-container">
      <div className="v-header">
        <h1>Từ vựng căn bản theo chủ đề</h1>
      </div>
      <div className="v-content">
        {topics.map((topic, index) => (
          <button
            className="v-topic"
            key={topic.id}
            style={{background: `white url(${bg}) no-repeat center center`, backgroundImage: `url(${bg})`, backgroundSize: "cover" }}
            onClick={() => {
              navigate(`/vocabulary/${topic.topicId}`);
            }}
          >
            <div className="v-title">
              {index + 1} - {topic.name}
            </div>
            <div className="v-face">
              <div className="v-progress">
                0/30
              </div>
              <div className="v-img">
                <img
                  src={topic.image}
                  alt={topic.name}
                  style={{ width: "20%", height: "20%" }}
                  onDragStart={(e) => e.preventDefault()}
                />
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
export default Vocabulary;
