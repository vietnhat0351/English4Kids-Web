
import React, { useEffect, useState } from "react";
import "./styles.css";
import ContainerComponent from "./ContainerComponent";
import  customFetch  from "../../../../src/utils/customFetch";

const LessonManagement = () => {

  const [lesson, setLesson] = useState([]);

  useEffect(() => {
    const fetchLesson = async () => {
      const data = await customFetch.get("/api/v1/lessons/all-lessons").then((res)=>{
        console.log(res.data);
      });
      setLesson(data);
    };
    fetchLesson();
  }, []);

  return (
    <ContainerComponent>
      
      <div>

      </div>
    </ContainerComponent>
  );
};

export default LessonManagement;
