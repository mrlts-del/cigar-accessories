export type PaymentMethod = 'LINE_PAY' | 'ECPAY' | 'CONVENIENCE_STORE';
export type ConvenienceStore = 'SEVEN_ELEVEN' | 'FAMILY_MART';
export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'EXPIRED';

interface BaseConfig {
  isSandbox: boolean;
  apiUrl: string;
}

interface LinePayConfig extends BaseConfig {
  channelId: string;
  channelSecret: string;
}

interface ECPayConfig extends BaseConfig {
  merchantId: string;
  hashKey: string;
  hashIv: string;
}

interface JKOPayConfig extends BaseConfig {
  merchantId: string;
  apiKey: string;
  apiSecret: string;
}

export interface PaymentConfig {
  LINE_PAY: LinePayConfig;
  ECPAY: ECPayConfig;
  JKOPAY: JKOPayConfig;
}