import React from "react";
import { View, TouchableOpacity } from 'react-native';
import { Text, Card, Badge, IconButton, useTheme } from "react-native-paper";
import { IOrder } from "../types/types";

interface OrderProps{
    navigation: any;
    order: IOrder;
}

const Order = ({ navigation, order }: OrderProps) => {

    const theme = useTheme();

    return(
        <TouchableOpacity onPress={() => navigation.navigate('OrderDetailsScreen', { order: order })}>
            <Card style={{ padding: 5, borderRadius: 5, backgroundColor: '#EEEEEE', marginBottom: 5 }}>
                <Card.Title 
                    title={`#${order.number}`}
                    subtitle={order.createdAt}
                    right={() => <Badge style={{ backgroundColor: order.status?.id !== 3 ? theme.colors.error : '#43A047' }}>{order.status?.name}</Badge>} 
                />
                <View>
                    <View style={{ padding: 2 }}>
                        <Text style={{ marginLeft: 12 }}>Localisation: </Text>
                        <Badge style={{ backgroundColor: theme.colors.primary, marginTop: -20 }}>{order.parcel?.position.name}</Badge>
                    </View>

                    <Card.Title 
                        title="Total"
                        subtitle={`$${(order.amount + order.deliveryFees).toFixed(2)}`}
                        right={() => {
                                return(
                                    <View style={{ flexDirection: "row" }}>
                                        <IconButton
                                            icon="information-outline"
                                            size={20}
                                            style={{ backgroundColor: "#fff" }}
                                            onPress={() => navigation.navigate('OrderDetailsScreen', { order: order })}
                                        />
                                        <IconButton
                                            icon="map-marker-question"
                                            size={20}
                                            style={{ backgroundColor: "#fff" }}
                                            onPress={() => navigation.navigate('TimelineScreen', { order: order })}
                                        />
                                    </View>
                                )
                            }
                        } 
                    />
                    
                </View>
            </Card>
        </TouchableOpacity>
    );
}

export default Order;