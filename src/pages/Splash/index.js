import React, { useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Image,
  Animated,
  ImageBackground,
  SafeAreaView,
} from 'react-native';
import { MyButton } from '../../components';
import { colors, fonts, windowHeight, windowWidth } from '../../utils';
import { getData } from '../../utils/localStorage';

export default function Splash({ navigation }) {



  useEffect(() => {
    setTimeout(() => {
      getData('user').then(res => {
        if (!res) {
          navigation.replace('Login')
        } else {
          // navigation.replace('GetStarted')
          navigation.replace('Home')
        }
      })
    }, 1500)
  }, []);


  return (
    <ImageBackground source={require('../../assets/back.png')} style={{
      flex: 1,
      backgroundColor: colors.white,
      justifyContent: 'center',
      alignItems: 'center'
    }}>


      <Image source={require('../../assets/logo.png')} style={{
        width: 200,
        height: 200,
        resizeMode: 'contain'
      }} />

      <View style={{
        padding: 10,
      }}>
        <ActivityIndicator color={colors.white} size="large" />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({});
