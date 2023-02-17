import React, { Component } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

class LocalStorage extends Component {

  constructor(props: {}){
    super(props);
  }

  storeData = async (key: string, data: unknown) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(data));
      return true;
    } catch (error: unknown) {
      return error;
    }
  }

  getData = async (key: string): Promise<any> => {
    try {
      let data: string | null = await AsyncStorage.getItem(key);
      data = (data !== null) ? JSON.parse(data) : null;
      
      return data;

    } catch (error) {
      return error;
    }
  }

  deleteData = async (key: string) => {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.log(error);
    }
  }

}

export default LocalStorage;