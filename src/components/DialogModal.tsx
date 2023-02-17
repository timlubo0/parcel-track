import * as React from 'react';
import { View } from 'react-native';
import { Button, Paragraph, Dialog as PaperDialog, Portal, Provider } from 'react-native-paper';
import { useTranslation } from 'react-i18next';

interface DialogModalProps{
    title: string;
    content: any; 
    isVisible: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

const DialogModal = ({ title, content, isVisible, onConfirm, onCancel }: DialogModalProps) => {
  const [visible, setVisible] = React.useState(isVisible);

  const hideDialog = () => setVisible(false);

  const { t } = useTranslation();

  return (
    <Provider>
      <View>
        <Portal>
          <PaperDialog visible={isVisible} onDismiss={hideDialog}>
            <PaperDialog.Title>{title}</PaperDialog.Title>
            <PaperDialog.Content>
              {content}
            </PaperDialog.Content>
            <PaperDialog.Actions>
              <Button onPress={onCancel} color="red">{ t('messages.cancel') }</Button>
              <Button onPress={onConfirm}>{ t('messages.confirm') }</Button>
            </PaperDialog.Actions>
          </PaperDialog>
        </Portal>
      </View>
    </Provider>
  );
};

export default DialogModal;