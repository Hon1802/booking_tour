API OF PROJECT
## 1. Get Tour by ID

**Method**: GET  

**Endpoint**: `/v1/api/get-tour-by-id`  

**Param**: tourId

**Example**: 127.0.0.1:8080/v1/api/get-tour-by-id/?tourId=66dd9d7edea32a959e16f014

**Response**:
{
    "errCode": 200,
    "message": "Get tours successfully.",
    "tours": {
        "delFlg": 0,
        "id": "66dd9d7edea32a959e16f014",
        "name": "name of tour 3",
        "description": "tour 6 day",
        "duration": "6",
        "location": "Ho Chi Minh",
        "regulation": "gi do",
        "address": "dia chi la gi do",
        "priceAdult": "243435",
        "priceChild": "70000",
        "images": [
            {
                "urlImage": "https://achautravel.com/upload/images/1689131743.jpeg"
            },
            {
                "urlImage": "https://asiaholiday.com.vn/pic/Tour/Tour%20Du%20lich%20Ha%20Long%20(5)_2261_HasThumb.jpg"
            }
        ],
        "plan": [
            {
                "day": "",
                "time": "",
                "description": ""
            }
        ],
        "phone": "100000"
    }
}
**/next**

**2) Get tour by number**: 

**Method**: GET

**127.0.0.1:8080/v1/api/get-tour-by-number/**

**Param**: count

count if null, count = 30

**Response:**
{
    "errCode": 200,
    "message": "Get tours successfully.",
    "tours": {
        "66dd9d7edea32a959e16f014": {
            "delFlg": 0,
            "id": "66dd9d7edea32a959e16f014",
            "name": "name of tour 3",
            "description": "tour 6 day",
            "duration": "6",
            "location": "Ho Chi Minh",
            "regulation": "gi do",
            "address": "dia chi la gi do",
            "priceAdult": "243435",
            "priceChild": "70000",
            "images": [
                {
                    "urlImage": "https://achautravel.com/upload/images/1689131743.jpeg"
                },
                {
                    "urlImage": "https://asiaholiday.com.vn/pic/Tour/Tour%20Du%20lich%20Ha%20Long%20(5)_2261_HasThumb.jpg"
                }
            ],
            "plan": [
                {
                    "day": "",
                    "time": "",
                    "description": ""
                }
            ],
            "phone": "100000"
        },
        "66dd8e32e1ba22d8d85d4402": {
            "delFlg": 0,
            "id": "66dd8e32e1ba22d8d85d4402",
            "name": "name of tour 1",
            "description": "tour 6 day",
            "duration": "6",
            "location": "Ho Chi Minh",
            "regulation": "gi do",
            "address": "dia chi la gi do",
            "priceAdult": "243435",
            "priceChild": "70000",
            "images": [
                {
                    "urlImage": "https://asiaholiday.com.vn/pic/Tour/Tour%20Du%20lich%20Ha%20Long%20(2)_2261_HasThumb.jpg"
                }
            ],
            "plan": [
                {
                    "day": "",
                    "time": "",
                    "description": ""
                }
            ],
            "phone": "100000"
        },
        "66dd8815921170e8a40c462e": {
            "delFlg": 0,
            "id": "66dd8815921170e8a40c462e",
            "name": "name of tour 5",
            "description": "tour 6 day",
            "duration": "6",
            "location": "Ho Chi Minh",
            "regulation": "gi do",
            "address": "dia chi la gi do",
            "priceAdult": "80000",
            "priceChild": "70000",
            "images": [
                {
                    "urlImage": "https://achautravel.com/upload/images/1689131743.jpeg"
                }
            ],
            "plan": [
                {
                    "day": "",
                    "time": "",
                    "description": ""
                }
            ],
            "phone": "100000"
        }
    }
}
**next**


**3) Add new tour**: 

**Method**: POST

**127.0.0.1:8080/v1/api/admin/new-tour**

**Param**: count

**![image](https://github.com/user-attachments/assets/b4aa2f7d-1a85-42d7-8992-18375c74164d)**

**Response:**
{
    "errCode": 200,
    "message": "Tour registered successfully."
}
