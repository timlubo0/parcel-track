import React from "react";
import { View, FlatList, RefreshControl, ActivityIndicator } from 'react-native';
import { ScreenProps } from "../../../interfaces/ScreenPropsInterface";
import { IOrder, IParcel } from "../types/types";
import Order from "./Order";
import { withTheme } from "react-native-paper";
import { connect } from "react-redux";
import { RootState } from "../../../store/store";
import { User } from "../../../store/interfaces/ReducersInterfaces";
import API from "../../../api/API";
import { IPagination } from "../../types/Types";
import moment from "moment";

type OrdersProps = ScreenProps & { navigation: { navigate: (screen: string) => void }; user: User; isInfiniteLoading?: boolean; };
type OrdersState = {orders: Array<IOrder>; isLoading: boolean; isInfiniteLoading: boolean;}  & IPagination;

class Orders extends React.Component<OrdersProps, OrdersState> {

    public state: Readonly<OrdersState>;
    private api: API;

    constructor(props: OrdersProps) {
        super(props);
        this.state = {
            orders: [],
            isLoading: false,
            isInfiniteLoading: false,
            page: 0,
            perPage: 10,
            totalPages: 1
        };
        this.api = new API();
    }

    loadOrders = async (isInfiniteLoading = false) => {

        !isInfiniteLoading && this.setState({ isLoading: true });

        let { page, perPage } = this.state;
        const { user } = this.props;

        page += 1;

        this.setState({ page: page });

        if(page <= this.state.totalPages){

            const response = await this.api.get(`orders/users/${user.customerId}?page=${page}&per_page=${perPage}`, user.accessToken);

            if(response.data !== undefined){

                isInfiniteLoading && this.setState({ isLoading: true });

                this.setPagination(response);

                const orders = response.data.map((order: any) => {
                    return this.setOrder(order);
                });

                await this.setOrdersLocation(orders);
    
                this.setState({ orders: [...this.state.orders, ...orders ] });
            }
    
        }

        this.setState({ isLoading: false });
    
    }

    setOrder = (order: any) => {
        return {
            id: order.id,
            createdAt: order.created_at,
            status: {
                id: order.status,
                name: order.status_name
            },
            number: order.number,
            amount: order.usd_amount,
            deliveryFees: order.usd_delivery_fees,
            payMode: order.pay_mode_name,
            isPaid: order.payment.is_paid,
            deliveryAddress: {
                reference: order.delivery_address.reference
            },
            notes: order.notes,
            items: order.items.map((item: any) => {
                return {
                    amount: item.amount,
                    usdAmount: item.usd_amount,
                    cdfAmount: item.cdf_amount,
                    name: item.item_name,
                    salePointName: item.sale_point_name,
                    quantity: item.quantity
                }
            })
        }
    }

    setOrdersLocation = async (orders: IOrder[]) => {

        let iterator: number = 0;

        for (const order of orders) {

            const response = await this.api.get(`get_package_by_order_id/${order.id}`);

            if(response.pack !== undefined){

                const { originCity, destinationCity, city, packageStory } = response.pack;

                const parcel: IParcel = {
                    origin: originCity,
                    destination: destinationCity,
                    position: city,
                    packageStory: packageStory.map((history: any) => {
                        return {
                            time: moment(history.createdAt).format('DD/MM/YYYY H:h:s'),
                            title: history.status.name,
                            description: history.cities.name
                        }
                    })
                };

                orders[iterator].parcel = parcel;
            }

            iterator++;
        }

        return orders;

    }

    setPagination = (response: any) => {
        const { per_page, total } = response;
        const pages = Math.ceil(parseInt(total) / parseInt(per_page));

        this.setState({totalPages: pages});
    }

    componentDidMount(): void {
        this.loadOrders();
    }
    

    render(){

        const { navigation, isInfiniteLoading } = this.props;

        return(
            <>
                <FlatList
                    data={this.state.orders}
                    renderItem={({ item }) => (
                        <Order 
                            key={item?.id} 
                            order={item} 
                            navigation={navigation}
                        />
                    )}
                    onEndReachedThreshold={0.5}
                    onEndReached={() => isInfiniteLoading !== undefined && this.loadOrders(true)}
                    style={{ marginBottom: 20 }}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.isLoading}
                            onRefresh={() => this.loadOrders()}
                        />
                    }
                    showsVerticalScrollIndicator={false}
                />
            </>
        )
    }
}

const mapStateToProps = (state: RootState) => {
    return {
        user: state.user.user,
    }
};

export default connect(mapStateToProps)(withTheme(Orders));