import { IUser } from '../models/user.model';
export interface ProcessPaymentRequest {
    userId: string;
    paymentMethod: string;
    amount: number;
}
export interface ProcessPaymentResponse {
    success: boolean;
    message: string;
    user: IUser;
}
declare class PaymentService {
    processPayment(paymentData: ProcessPaymentRequest): Promise<ProcessPaymentResponse>;
    cancelSubscription(userId: string): Promise<ProcessPaymentResponse>;
    private simulatePaymentProcessing;
}
declare const _default: PaymentService;
export default _default;
