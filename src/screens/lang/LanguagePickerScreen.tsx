import React from "react";
import { useTranslation } from "react-i18next";
import { View, StatusBar, ImageBackground, StyleSheet } from "react-native";
import { Card, useTheme } from "react-native-paper";
import LanguagePicker, { ILanguagePicker } from "react-native-language-select";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/types/RootStackParamList";
import ScreenNavBar from "../../components/ScreenNavBar";
import Constants from 'expo-constants';
import { UserPreferencesActionProps, UserPreferencesActionType } from "../../store/reducers/userPreferencesReducer";
import { RootState } from "../../store/store";
import { connect } from "react-redux";

type LanguagePickerScreenProps = NativeStackScreenProps<RootStackParamList, 'LanguagePickerScreen'> & {dispatch: (action: UserPreferencesActionProps) => void};

const LanguagePickerScreen = (props: LanguagePickerScreenProps) => {

  const { i18n, t } = useTranslation();


  const data: ILanguagePicker[] = [
    // {
    //   title: t('messages.languages.en'),
    //   imageSource: require("../../../assets/images/languages/usa.png"),
    //   language: "en",
    // },
    {
      title: t('messages.languages.fr'),
      imageSource: require("../../../assets/images/languages/fr.png"),
      language: "fr",
    },
  ];

  const handleLanguageSelect = (language: ILanguagePicker) => {

    i18n.changeLanguage(language.language);

    props.dispatch({ type: UserPreferencesActionType.ADD, value: {language: language.language} });

    props.navigation.navigate('AccountScreen');
    
  }

  const theme = useTheme();

  return (
    <View style={styles(theme).container}>
      <StatusBar backgroundColor={theme.colors.primary} /> 
      
      <Card style={styles(theme).card}>
        <ImageBackground 
          source={!theme.dark ? require('../../../assets/images/bg/onboarding.jpg') : require('../../../assets/images/bg/bg-dark.jpg')}
          style={{ width: "100%", height: "106%" }}>

            <ScreenNavBar screenName="lang" navigation={props.navigation} icon="translate" />

            <View style={{ padding: 13 }}>
              <View style={{ alignItems: "center" }}>
                <LanguagePicker
                  initialIndex={i18n.language == 'en' ? 0 : 1}
                  data={data}
                  onSelect={(selectedItem: ILanguagePicker) => {
                    handleLanguageSelect(selectedItem);
                  }}
                />
              </View>
            </View>
        </ImageBackground>
      </Card>
  </View>

  );
};


const styles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1, 
    backgroundColor: theme.colors.primary,
   
  },
  card: {
      borderBottomLeftRadius: 22, 
      borderBottomRightRadius: 22,
      height: "93%",
      overflow: 'hidden',
      marginTop: Constants.statusBarHeight
  },
  header: {
      width: "100%",
      height: 80,
      backgroundColor: theme.colors.primary,
      flexDirection: "row"
  },
});

const mapStateToProps = (state: RootState) => {
  return {
      user: state.user.user,
      preferences: state.preferences.preferences
  }
};


export default connect(mapStateToProps)(LanguagePickerScreen);