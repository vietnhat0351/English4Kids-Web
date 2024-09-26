
import React from "react";
import "./Modal.css"; // Đừng quên import file CSS

const Modal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>
          &times; {/* Biểu tượng đóng */}
        </button>
        <h2>Đây là Modal Toàn Màn Hình</h2>
        <p>Nội dung của modal sẽ được hiển thị ở đây.</p>
      </div>
    </div>
  );
};

export default Modal;
