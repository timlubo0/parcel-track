import React, {useState} from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import { Text } from 'react-native-paper';

import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import appTheme from '../theme/appTheme';

const CELL_COUNT = 5;

interface ConfirmInputProps{
    code: string;
    onCodeChange: (value?: unknown) => void;
    theme: ReturnType<typeof appTheme>
}

const ConfirmInput = ({code, onCodeChange, theme}: ConfirmInputProps) => {

  const [value, setValue] = useState('');
//   const ref = useBlurOnFulfill({code, cellCount: CELL_COUNT});
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  return (
    <SafeAreaView style={styles(theme).root}>
      <CodeField
        // ref={ref}
        {...props}
        value={code}
        onChangeText={(value) => onCodeChange(value)}
        cellCount={CELL_COUNT}
        rootStyle={styles(theme).codeFieldRoot}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        renderCell={({index, symbol, isFocused}) => (
          <Text
            key={index}
            style={[styles(theme).cell, isFocused && styles(theme).focusCell]}
            onLayout={getCellOnLayoutHandler(index)}>
            {symbol || (isFocused ? <Cursor /> : null)}
          </Text>
        )}
      />
    </SafeAreaView>
  );

};

const styles = (theme: ReturnType<typeof appTheme>) => StyleSheet.create({
    root: {padding: 0},
    title: {textAlign: 'center', fontSize: 30, color: '#000'},
    codeFieldRoot: {marginTop: 20},
    cell: {
      width: 40,
      height: 40,
      lineHeight: 38,
      fontSize: 24,
      borderWidth: 2,
      borderColor: !theme.dark ? theme.colors.accent : "#fff",
      textAlign: 'center',
      color: theme.colors.primary,
    },
    focusCell: {
      borderColor: theme.colors.primary,
    },
  });

export default ConfirmInput;