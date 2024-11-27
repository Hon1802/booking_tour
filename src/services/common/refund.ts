import { OrderStatus } from "../../databases/models/entities/common";

interface RefundParams {
    depositAmount: number;
    totalAmount: number;
    departureDate: Date;
    status: OrderStatus;
    cancelDate: Date;
}

const calculateRefundAmount = ({
    depositAmount,
    totalAmount,
    departureDate,
    status,
    cancelDate,
}: RefundParams): number => {
    if (status === "CANCELLED_BY_ADMIN") {
        // Hoàn trả toàn bộ tiền đặt cọc
        return depositAmount;
    } else if (status === "CANCELLED") {
        if (!(departureDate instanceof Date) || isNaN(departureDate.getTime())) {
            throw new Error("Invalid departureDate provided.");
        }
        if (!(cancelDate instanceof Date) || isNaN(cancelDate.getTime())) {
            throw new Error("Invalid cancelDate provided.");
        }
        // Tính số ngày còn lại trước ngày khởi hành
        const daysUntilDeparture = Math.ceil(
            (departureDate.getTime() - cancelDate.getTime()) / (1000 * 60 * 60 * 24)
        );

        // Tính phần trăm số tiền bị trừ
        let refundPercentage = 0;

        if (daysUntilDeparture >= 30 && daysUntilDeparture <= 45) {
            refundPercentage = 90; 
        } else if (daysUntilDeparture >= 16 && daysUntilDeparture <= 29) {
            refundPercentage = 70; 
        } else if (daysUntilDeparture >= 8 && daysUntilDeparture <= 15) {
            refundPercentage = 40; 
        } else if (daysUntilDeparture >= 4 && daysUntilDeparture <= 7) {
            refundPercentage = 10; 
        } else if (daysUntilDeparture >= 1 && daysUntilDeparture <= 3) {
            refundPercentage = 0; 
        }

        return (totalAmount * refundPercentage) / 100;
    }

    return 0;
};

export default calculateRefundAmount;
