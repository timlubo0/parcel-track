export interface IOrder{
    id?: number;
    createdAt?: string;
    status?: {
        id: number;
        name: string;
    };
    number?: string;
    payMode?: string;
    isPaid?: number;
    amount: number;
    deliveryFees: number;
    deliveryAddress?: {
        reference: string;
    };
    notes?: string;
    items?: Array<{
        amount: number;
        usdAmount: number;
        cdfAmount: number;
        name: string;
        salePointName: string;
        quantity: number;
    }>;
    parcel?: IParcel
}

export interface ITimeline{
    time: string; 
    title: string;
    description: string;
}

export interface ICity{
    name: string;
    longitude: number;
    latitude: number;
}

export interface IParcel{
    origin: ICity; 
    destination: ICity;
    position: ICity;
    packageStory: Array<{
        time: string;
        title: string;
        description: string;
    }>
}