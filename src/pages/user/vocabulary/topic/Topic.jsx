
import React from 'react'
import './topic-styles.css'
import { useParams } from 'react-router-dom'

const Topic = () => {

    const topics = useParams();

    console.log(topics);

  return (
    <div>
      Topic
    </div>
  )
}

export default Topic
