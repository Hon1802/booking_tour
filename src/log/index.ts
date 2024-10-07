'use strict';
import winston, { transports, format } from 'winston';

// Logger cho customer
export const customerLogger = winston.createLogger({
  transports: [
    new transports.File({
      filename: 'customer.log',
      level: 'info',
      format: format.combine(format.timestamp(), format.json()),
    }),
    new transports.File({
      filename: 'customer-error.log',
      level: 'error',
      format: format.combine(format.timestamp(), format.json()),
    }),
  ],
});

// Định nghĩa customLevels
const customLevels = {
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    verbose: 4,
    debug: 5,
    silly: 6,
  },
  colors: {
    error: 'red',         // Đỏ
    warn: 'yellow',       // Vàng
    info: 'green',        // Xanh lá
    http: 'magenta',      // Hồng
    verbose: 'cyan',      // Xanh nước biển
    debug: 'blue',        // Xanh dương
    silly: 'grey',        // Xám
  },

};

// Thêm màu sắc vào winston
winston.addColors(customLevels.colors);

// Logger chính
export const logger = winston.createLogger({
  levels: customLevels.levels,
  format: format.combine(
    format.timestamp(),
    format.colorize(),  // Thêm màu sắc cho log
    format.printf(({ timestamp, level, message }) => {
      return `${timestamp} ${level}: ${message}`; // Định dạng log cho console
    })
  ),
  transports: [
    new transports.Console(), // Console transport
    new transports.File({
      filename: 'error.log',
      level: 'error',
      format: format.json(),
    }),
    new transports.File({
      filename: 'combined.log',
      format: format.json(),
    }),
  ],
});
