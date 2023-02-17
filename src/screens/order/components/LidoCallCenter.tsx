import React from 'react';
import { View, Linking, Platform } from 'react-native';
import { IconButton, Avatar, List, useTheme } from 'react-native-paper';

const LidoCallCenter = () => {

    const theme = useTheme();

    const  makeCall = () => {
        const phoneNumber: string = (Platform.OS !== 'android') ? "telprompt:+243974384112" : "tel:+243974384112";

        Linking.canOpenURL(phoneNumber)
        .then(() => {
            return Linking.openURL(phoneNumber);
        })
        .catch(err => console.log(err));
    }


    return(
        <List.Item
            title="LIDO Services"
            description="Livreur de votre colis"
            left={() => <Avatar.Text size={44} label="LS" style={{ marginTop: 5 }} />}
            right={() => <View style={{ flexDirection: 'row' }}>
                <IconButton
                    icon="phone"
                    size={30}
                    onPress={makeCall}
                    style={{ backgroundColor: "#fff" }}
                    color='#009688'
                />
                <IconButton
                    icon="message"
                    size={30}
                    onPress={() => Linking.openURL(`sms:${'+243974384112'}${Platform.OS === "ios" ? "&" : "?"}body=${''}`)}
                    style={{ backgroundColor: "#fff" }}
                    color={theme.colors.primary}
                />
                <IconButton
                    icon="whatsapp"
                    size={30}
                    onPress={() => Linking.openURL(`whatsapp://send?text=Bonjour Lido Services&phone=${'+243974384112'}`)}
                    style={{ backgroundColor: "#fff" }}
                    color='#00E676'
                />
            </View>}
        />
    )
}

export default LidoCallCenter;