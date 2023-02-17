import * as React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { IconButton, Text } from 'react-native-paper';

interface ListHeaderProps{
  title: string;
  iconTitle: string;
  icon?: string;
  onIconPress: () => void;
}

const ListHeader = ({ title, iconTitle, icon = 'arrow-right-bold-circle-outline', onIconPress }: ListHeaderProps) => {
 
  return(
    <View style={styles.titleContainer}>
      <Text style={styles.title}>{title}</Text>
      <TouchableOpacity
        onPress={onIconPress} 
        style={{ flexDirection: 'row' }}>
        <Text style={{color: "gray", textDecorationLine: "underline"}}>{ iconTitle }</Text>
        <IconButton
            style={{marginTop: -5}}
            icon={ icon }
            size={20}
            onPress={onIconPress}
        />
      </TouchableOpacity>
    </View>
  )

};

const styles = StyleSheet.create({
  title: {
    fontSize: 17,
    fontWeight: "bold",
    flex: 2
  },

  titleContainer: {
    flexDirection: "row",
    padding: 15
  }
});

export default ListHeader;