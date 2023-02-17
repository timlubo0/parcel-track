import React from "react";
import { View, StyleSheet } from 'react-native';
import { IconButton, Title, Paragraph, useTheme } from "react-native-paper";
import { useTranslation } from "react-i18next";

interface ScreenNavBarProps{
    screenName: string;
    navigation: { goBack: () => void };
    icon?: string;
}

const ScreenNavBar = ({ screenName, navigation, icon = 'arrow-left' }: ScreenNavBarProps) => {

    const theme = useTheme();
    const { t } = useTranslation();

    return(
        <View style={styles(theme).header}>
            <View>
                <IconButton
                    icon={icon}
                    color="#fff"
                    size={25}
                    style={{backgroundColor: theme.colors.accent, padding: 5}}
                    onPress={() => navigation.goBack()}
                />
            </View>
            <View>
                <Title style={{ color: "#fff" }}>{ t(`messages.screens.${screenName}.title`) }</Title>
                <Paragraph style={{ color: "#fff" }}>{ t(`messages.screens.${screenName}.description`) }</Paragraph>
            </View>
        </View>
    )
}

const styles = (theme: any) => StyleSheet.create({
    header: {
        width: "100%",
        height: 80,
        backgroundColor: theme.colors.primary,
        flexDirection: "row"
    }
});

export default ScreenNavBar;