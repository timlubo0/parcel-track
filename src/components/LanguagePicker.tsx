import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Modal, View, Text, Pressable } from "react-native";
import SelectPicker from "./SelectPicker";
import LanguagePicker, { ILanguagePicker } from "react-native-language-select";

const LanguagePickerModal = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const { i18n } = useTranslation();

  const data: ILanguagePicker[] = [
    {
      title: "English",
      imageSource: require("../../assets/images/languages/usa.png"),
      language: "en",
    },
  ];

  const handleLanguageSelect = (language: { name: string; label: string }) => {

    i18n.changeLanguage(language.name);
    setModalVisible(!modalVisible);
    
  }

  return (
    <View>
        <LanguagePicker
  initialIndex={1}
  data={data}
  onSelect={(selectedItem: ILanguagePicker) => {
    console.log(selectedItem);
  }}
/>
    </View>
  );
};

export default LanguagePickerModal;