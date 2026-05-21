export interface SignupRequest {
    email: string;
    password: string;
    username: string;
    country: string;
}
export interface SignupResponse {
    user: {
        id: string;
        userID: string;
        email: string;
        username: string;
        country: string;
        role: string;
        status: string;
        subscription: boolean;
        subscriptionExpires: Date | null;
    };
    token: string;
    message: string;
}
export interface LoginRequest {
    usernameOrEmail: string;
    password: string;
}
export interface LoginResponse {
    user: {
        id: string;
        email: string;
        username: string;
        role: string;
        subscription: boolean;
        subscriptionExpires: Date | null;
    };
    token: string;
    message: string;
}
export declare function isTokenBlacklisted(token: string): Promise<boolean>;
declare class AuthService {
    logout(token: string): Promise<void>;
    signup(signupData: SignupRequest): Promise<SignupResponse>;
    login(loginData: LoginRequest): Promise<LoginResponse>;
}
declare const _default: AuthService;
export default _default;
