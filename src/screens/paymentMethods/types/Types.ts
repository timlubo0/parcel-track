
export interface NewPayModeScreenState{
    payModeId: number;
    number: string;
    payModes: Array<PayMode>;
    isLoading: boolean;
}

export interface UserPayMode{
    id?: number;
    number?: string;
    payMode?: PayMode;
    userId?: number
}

export interface PayMode{
    id?: number; 
    name?: string;
}