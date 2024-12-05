const generateTourData = (count: number) => {
    const phoneContacts = [
      '093213123', '093324567', '093435678', '093546789', '093657890',
      '093768901', '093879012', '093980123', '093091234', '093102345'
    ];
  
    const tours = [];
  
    for (let i = 0; i < count; i++) {
      // Random số từ 50 đến 100
      const limit = Math.floor(Math.random() * 51) + 50; // 50-100
      // Random giá từ 500000 trở lên
      const priceAdult = Math.floor(Math.random() * 1000000) + 500000; // > 500000
      // Random giá trẻ em nhỏ hơn giá người lớn
      const priceChild = Math.floor(Math.random() * (priceAdult - 200000)) + 200000; // < priceAdult
      // Thời gian đóng đơn hàng (4-7 ngày trước thời gian dự kiến)
      const closeOrderOffset = Math.floor(Math.random() * 4) + 4; // 4-7 ngày
      const closeOrderTime = new Date(2025, 0, 1); // 1/1/2025
      closeOrderTime.setDate(closeOrderTime.getDate() + Math.floor(Math.random() * 120)); // Ngẫu nhiên 1/1/2025 -> 30/4/2025
      const estimatedTime = new Date(closeOrderTime.getTime());
      estimatedTime.setDate(closeOrderTime.getDate() + closeOrderOffset); // +4-7 ngày
  
      tours.push({
        name: "giu-nguyen",
        description: "giu-nguyen",
        location: "giu-nguyen",
        address: "giu-nguyen",
        phoneContact: phoneContacts[Math.floor(Math.random() * phoneContacts.length)],
        duration: Math.floor(Math.random() * 8) + 3, // Random từ 3-10 ngày
        regulation: `<p style="text-align:start;">
          <span style="color: rgb(26,26,26);background-color: rgb(255,255,255);font-size: var(--bui_font_body_1_font-size);font-family: BlinkMacSystemFont, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;">
            Bring your ticket with you to the attraction.
          </span></p>
          <p style="text-align:start;">
          <span style="color: rgb(26,26,26);background-color: rgb(255,255,255);font-size: var(--bui_font_body_1_font-size);font-family: BlinkMacSystemFont, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;">
            Be aware that operators may cancel for unforeseen reasons.
          </span></p>
          <p style="text-align:start;">
          <span style="color: rgb(26,26,26);background-color: rgb(255,255,255);font-size: var(--bui_font_body_1_font-size);font-family: BlinkMacSystemFont, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;">
            You must be 18 years or older, or be accompanied by an adult, to book.
          </span>&nbsp;</p>`,
        plan: "giu-nguyen",
        priceChild,
        priceAdult,
        images: [`https://example.com/image${i + 1}.jpg`],
        transportationId: Math.floor(Math.random() * 10) + 1, // Random từ 1-10
        hotelId: Math.floor(Math.random() * 10) + 1, // Random từ 1-10
        estimatedTime: estimatedTime.toISOString(),
        closeOrderTime: closeOrderTime.toISOString(),
        limit,
      });
    }
  
    return tours;
  };
  
  // Ví dụ sử dụng hàm để tạo 10 dữ liệu
  console.log(JSON.stringify(generateTourData(10), null, 2));
  