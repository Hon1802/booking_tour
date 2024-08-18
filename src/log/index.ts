import winston, { transports, format } from 'winston';
export const customerLogger = winston.createLogger({
  transports: [
    new transports.File({
      filename: 'customer.log',
      level: 'info',
      format: format.combine(format.timestamp(), format.json())
    }),
    new transports.File({
      filename: 'customer-error.log',
      level: 'error',
      format: format.combine(format.timestamp(), format.json())
    })
  ]
});
 

export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(), // adds a timestamp property
    winston.format.json()
  ),
  transports: [new winston.transports.Console()]
});
