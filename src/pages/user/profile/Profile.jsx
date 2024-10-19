
import React, { useEffect, useState } from 'react'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { StaticTimePicker } from '@mui/x-date-pickers/StaticTimePicker';
import dayjs from 'dayjs';

function Profile() {
  const [value, setValue] = useState(dayjs());
  useEffect(() => {
    // in ra giá trị giờ phút
    console.log(value.format('HH:mm'));
  }, [value]);
  return (
    <div>
      <h1>Profile</h1>
      <div >
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <StaticTimePicker orientation="landscape" 
            value={value} 
            onChange={(newValue) => setValue(newValue)}
            onAccept={(newValue) => {
              console.log(newValue.format('HH:mm'));
              console.log("onAccept");
            }}
          />
        </LocalizationProvider>
      </div>
    </div>
  )
}

export default Profile
