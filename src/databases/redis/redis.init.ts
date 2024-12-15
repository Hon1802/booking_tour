// export default RedisConnection;
import { createClient } from 'redis';
import { logger } from '../../log';

export type RedisClientType = ReturnType<typeof createClient>;

class RedisConnection {
    private static instance: RedisConnection;
    private redisClient: RedisClientType;
    private isConnected: boolean = false;
    private idleTimeout: NodeJS.Timeout | null = null; // Biến để theo dõi thời gian không hoạt động

    private constructor() {
        this.redisClient = createClient({
            password: 'XvVd3Rj2F7rPAvL9cflJBujV4daURdM5',
            socket: {
                host: 'redis-13005.c292.ap-southeast-1-1.ec2.redns.redis-cloud.com',
                port: 13005,
            },
        });
        // this.redisClient = createClient({
        //     password: '',
        //     socket: {
        //         host: 'localhost',
        //         port: 6379,
        //     },
        // });

        this.redisClient.on('error', (err) => console.log('Redis Client Error', err));
        this.handleEventConnection(this.redisClient);
    }

    public static getInstance(): RedisConnection {
        if (!RedisConnection.instance) {
            RedisConnection.instance = new RedisConnection();
        }
        return RedisConnection.instance;
    }

    public async init(): Promise<void> {
        if (!this.isConnected) {
            await this.redisClient.connect();
            this.isConnected = true;
            this.resetIdleTimeout(); // Đặt lại thời gian không hoạt động
        }
    }

    public async disconnect(): Promise<void> {
        if (this.isConnected) {
            await this.redisClient.quit();
            this.isConnected = false;
            if (this.idleTimeout) {
                clearTimeout(this.idleTimeout); // Xóa timeout nếu đã ngắt kết nối
            }
        }
    }

    public async setValue(key: string, value: string, ttl: number = 3600): Promise<void> {
        await this.checkConnection(); // Kiểm tra và kết nối lại nếu cần
        try {
            await this.redisClient.set(key, value, { EX: ttl });
            this.resetIdleTimeout(); // Đặt lại thời gian không hoạt động
        } catch (error) {
            console.error(`Error setting value for key "${key}":`, error);
            throw error;
        }
    }

    public async pushValueArray(key: string, value: string): Promise<void> {
        await this.checkConnection(); // Kiểm tra và kết nối lại nếu cần
        try {
            await this.redisClient.rPush(key, value);
            this.resetIdleTimeout(); // Đặt lại thời gian không hoạt động
        } catch (error) {
            console.error(`Error push value for array "${key}":`, error);
            throw error;
        }
    }

    public async getValue(key: string): Promise<{ value: string | null; ttl: number }> {
        await this.checkConnection(); // Kiểm tra và kết nối lại nếu cần
        try {
            const value = await this.redisClient.get(key);
            this.resetIdleTimeout(); // Đặt lại thời gian không hoạt động
            const ttl = await this.redisClient.ttl(key);
            return { value, ttl };
        } catch (error) {
            console.error(`Error getting value for key "${key}":`, error);
            return { value: null, ttl: -1 };
        }
    }

    // delete
    public async deleteValue(key: string): Promise<void> {
        await this.checkConnection(); // Kiểm tra và kết nối lại nếu cần
        try {
            await this.redisClient.del(key); // Sử dụng phương thức del để xóa giá trị
            this.resetIdleTimeout(); // Đặt lại thời gian không hoạt động
        } catch (error) {
            console.error(`Error deleting value for key "${key}":`, error);
            throw error; // Ném lỗi để xử lý ở nơi gọi phương thức
        }
    }

    private handleEventConnection(connectionRedis: RedisClientType) {
        const statusConnectRedis = {
            CONNECT: 'connect',
            END: 'end',
            RECONNECT: 'reconnecting',
            ERROR: 'error',
        };

        connectionRedis.on(statusConnectRedis.CONNECT, () => {
            logger.info(`ConnectionRedis - Connection status:: Connected`);
        });
        connectionRedis.on(statusConnectRedis.END, () => {
            logger.info(`ConnectionRedis - Connection status:: Disconnected`);
        });
        connectionRedis.on(statusConnectRedis.RECONNECT, () => {
            logger.info(`ConnectionRedis - Connection status:: Reconnecting`);
        });
        connectionRedis.on(statusConnectRedis.ERROR, (err: any) => {
            logger.info(`ConnectionRedis - Connection status:: Error with ${err}`);
        });
    }

    private async checkConnection(): Promise<void> {
        if (!this.isConnected) {
            await this.init(); // Kết nối lại nếu chưa được kết nối
        }
    }

    private resetIdleTimeout(): void {
        if (this.idleTimeout) {
            clearTimeout(this.idleTimeout); // Xóa timeout cũ nếu có
        }
        this.idleTimeout = setTimeout(async () => {
            await this.disconnect(); // Ngắt kết nối sau 30 giây không hoạt động
        }, 30000); // 30 giây
    }
}

export default RedisConnection;
