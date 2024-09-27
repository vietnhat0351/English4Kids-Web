
export const formatDateTime = (dateTimeString) => {
    // Tạo đối tượng Date từ chuỗi thời gian
    let date = new Date(dateTimeString);

    // Lấy các thành phần ngày và giờ
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();
    let day = date.getDate();
    let month = date.getMonth() + 1; // Tháng bắt đầu từ 0 nên cần +1
    let year = date.getFullYear();

    // Lấy thứ trong tuần (0-6, Chủ Nhật là 0)
    let daysOfWeek = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
    let dayOfWeek = daysOfWeek[date.getDay()];

    // Định dạng các thành phần thành chuỗi có 2 chữ số (nếu cần)
    hours = hours.toString().padStart(2, '0');
    minutes = minutes.toString().padStart(2, '0');
    seconds = seconds.toString().padStart(2, '0');
    day = day.toString().padStart(2, '0');
    month = month.toString().padStart(2, '0');

    // Tạo chuỗi định dạng
    let formattedDateTime = `${hours}:${minutes}:${seconds}, ${dayOfWeek} ${day}/${month}/${year}`;
    
    return formattedDateTime;
}

export const formatOrderId = (str) => {
    // Kiểm tra độ dài của chuỗi để đảm bảo có ít nhất 10 ký tự
    if (str.length <= 10) {
        return str;
    }
    
    // Lấy 5 ký tự đầu và 5 ký tự cuối của chuỗi
    let start = str.slice(0, 5);
    let end = str.slice(-5);
    
    // Kết hợp lại với dấu "..."
    let shortenedStr = `${start}...${end}`;
    
    return shortenedStr;
}
