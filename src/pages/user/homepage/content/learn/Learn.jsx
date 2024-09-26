import React, { useState } from "react";
import "./styles.css";
import Modal from "./Modal";


function Learn() {
  const [isModalOpen, setModalOpen] = useState(false);

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };
  return (
    <div className="container">
      <div>
        <h2 className="title-lesson">English4Kids</h2>
      </div>
     
      <div className="app-container">
        <button className="open-modal-button" onClick={handleOpenModal}>
          Mở Modal
        </button>

        <Modal isOpen={isModalOpen} onClose={handleCloseModal} />
      </div>
    </div>
  );
}

export default Learn;
