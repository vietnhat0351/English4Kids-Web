
import React, { useState } from 'react'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker';
import { Button } from '@mui/material';
import customFetch from '../../../utils/customFetch';

function Profile() {

  const [selectedDate, handleDateChange] = useState(null);

  const handleSubmit = () => {
    // kiểm tra dữ liệu trước khi gửi lên server
    if (!selectedDate) {
      alert('Vui lòng chọn thời gian học hàng ngày');
      return;
    }
    // gửi dữ liệu lên server
    customFetch.post('/api/v1/study-schedule/create', {
      startTime: selectedDate,
    }).then((data) => {
      console.log(data);
    }).catch((error) => {
      console.error(error);
    })
  }

  return (
    <div>
      <h1>Profile</h1>
      <div >
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <MobileTimePicker label={'Lịch Học Hàng Ngày'} openTo="minutes"
            // value={selectedDate}
            onAccept={(date) => {
              handleDateChange(date);
            }}
          />
        </LocalizationProvider>
        <Button variant="contained" color="primary"
          onClick={handleSubmit}
        >Lưu</Button>
      </div>
    </div>
  )
}

export default Profile
