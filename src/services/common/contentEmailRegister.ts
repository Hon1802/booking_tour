// content Mail
export const contentEmailRegisterUser = ( customerName?: string, requestID?: string, confirmationDate?:Date,  ) =>{
    const testHTML = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>Mail Cancel Form</title>
                <style>
                body {
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                }
                .container {
                    width: 60%;
                    margin: auto;
                    border: 1px solid #ddd;
                    padding: 20px;
                    border-radius: 10px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                }
                .header {
                    text-align: center;
                    background-color: #f4f4f4;
                    padding: 10px;
                    border-bottom: 2px solid #ddd;
                }
                .content {
                    margin-top: 20px;
                }
                .footer {
                    margin-top: 30px;
                    text-align: center;
                    font-size: 0.9em;
                    color: #555;
                }
                .button {
                    display: inline-block;
                    background-color: #28a745;
                    color: white;
                    padding: 10px 20px;
                    text-decoration: none;
                    border-radius: 5px;
                    margin-top: 20px;
                }
                </style>
            </head>
            <body>
                <div class="container">
                <div class="header">
                    <h2>Đăng Ký Thành Công</h2>
                </div>
                <div class="content">
                    <p>Kính gửi <strong>${customerName}</strong>,</p>
                    <p>Chúng tôi chúc mừng yêu cầu của bạn đã được đăng ký. Dưới đây là thông tin chi tiết:</p>
                    <ul>
                    <li><strong>Mã yêu cầu:</strong> ${requestID}</li>
                    <li><strong>Ngày xác nhận:</strong> ${confirmationDate}</li>
                    </ul>
                    <p>Cảm ơn bạn đã tin tưởng và sử dụng dịch vụ của chúng tôi. Nếu bạn có bất kỳ thắc mắc nào, xin vui lòng liên hệ với chúng tôi qua email hoặc số điện thoại được cung cấp.</p>
                    // <a href="{{supportLink}}" class="button">Liên hệ hỗ trợ</a>
                </div>
                <div class="footer">
                    <p>Trân trọng,<br>Đội ngũ dịch vụ khách hàng</p>
                </div>
                </div>
            </body>
            </html>
            `;
    return testHTML;
}

export const contentAcceptEmail = ( customerName?: string, requestID?: string, confirmationDate?:Date,  ) =>{
    const testHTML = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>Mail Acceptance Form</title>
                <style>
                body {
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                }
                .container {
                    width: 60%;
                    margin: auto;
                    border: 1px solid #ddd;
                    padding: 20px;
                    border-radius: 10px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                }
                .header {
                    text-align: center;
                    background-color: #f4f4f4;
                    padding: 10px;
                    border-bottom: 2px solid #ddd;
                }
                .content {
                    margin-top: 20px;
                }
                .footer {
                    margin-top: 30px;
                    text-align: center;
                    font-size: 0.9em;
                    color: #555;
                }
                .button {
                    display: inline-block;
                    background-color: #28a745;
                    color: white;
                    padding: 10px 20px;
                    text-decoration: none;
                    border-radius: 5px;
                    margin-top: 20px;
                }
                </style>
            </head>
            <body>
                <div class="container">
                <div class="header">
                    <h2>Chấp Nhận Đăng Ký</h2>
                </div>
                <div class="content">
                    <p>Kính gửi <strong>${customerName}</strong>,</p>
                    <p>Chúng tôi vui mừng thông báo rằng yêu cầu của bạn đã được chấp nhận. Dưới đây là thông tin chi tiết:</p>
                    <ul>
                    <li><strong>Mã yêu cầu:</strong> ${requestID}</li>
                    <li><strong>Ngày xác nhận:</strong> ${confirmationDate}</li>
                    </ul>
                    <p>Cảm ơn bạn đã tin tưởng và sử dụng dịch vụ của chúng tôi. Nếu bạn có bất kỳ thắc mắc nào, xin vui lòng liên hệ với chúng tôi qua email hoặc số điện thoại được cung cấp.</p>
                    // <a href="{{supportLink}}" class="button">Liên hệ hỗ trợ</a>
                </div>
                <div class="footer">
                    <p>Trân trọng,<br>Đội ngũ dịch vụ khách hàng</p>
                </div>
                </div>
            </body>
            </html>
            `;
    return testHTML;
}

export const contentUpdateInfoEmail = ( customerName?: string, requestID?: string, confirmationDate?:Date, status?:string ) =>{
    const testHTML = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>Update Tour Form</title>
                <style>
                body {
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                }
                .container {
                    width: 60%;
                    margin: auto;
                    border: 1px solid #ddd;
                    padding: 20px;
                    border-radius: 10px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                }
                .header {
                    text-align: center;
                    background-color: #f4f4f4;
                    padding: 10px;
                    border-bottom: 2px solid #ddd;
                }
                .content {
                    margin-top: 20px;
                }
                .footer {
                    margin-top: 30px;
                    text-align: center;
                    font-size: 0.9em;
                    color: #555;
                }
                .button {
                    display: inline-block;
                    background-color: #28a745;
                    color: white;
                    padding: 10px 20px;
                    text-decoration: none;
                    border-radius: 5px;
                    margin-top: 20px;
                }
                </style>
            </head>
            <body>
                <div class="container">
                <div class="header">
                    <h2>Cập nhập thông tin</h2>
                </div>
                <div class="content">
                    <p>Kính gửi <strong>${customerName}</strong>,</p>
                    <p>Chúng tôi vui mừng thông báo rằng yêu cầu của bạn đã được chấp nhận. Dưới đây là thông tin chi tiết:</p>
                    <ul>
                    <li><strong>Mã yêu cầu:</strong> ${requestID}</li>
                    <li><strong>Ngày xác nhận:</strong> ${confirmationDate}</li>
                    <li><strong>Trạng thái:</strong> ${status}</li>
                    </ul>
                    <p>Cảm ơn bạn đã tin tưởng và sử dụng dịch vụ của chúng tôi. Nếu bạn có bất kỳ thắc mắc nào, xin vui lòng liên hệ với chúng tôi qua email hoặc số điện thoại được cung cấp.</p>
                    // <a href="{{supportLink}}" class="button">Liên hệ hỗ trợ</a>
                </div>
                <div class="footer">
                    <p>Trân trọng,<br>Đội ngũ dịch vụ khách hàng</p>
                </div>
                </div>
            </body>
            </html>
            `;
    return testHTML;
}