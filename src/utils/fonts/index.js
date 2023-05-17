import React, { useState, useEffect } from 'react';
import { Dimensions } from 'react-native';

export const windowWidth = Dimensions.get('window').width;
export const windowHeight = Dimensions.get('window').height;

export const fonts = {
  primary: {
    300: 'Poppins-Light',
    400: 'Poppins-Regular',
    600: 'Poppins-SemiBold',
    700: 'Poppins-Bold',
    800: 'Poppins-ExtraBold',
    900: 'Poppins-Black',
    normal: 'SpaceGrotesk-Bold',
  },
  secondary: {
    200: 'Montserrat-ExtraLight',
    300: 'Roboto-Light',
    400: 'Roboto-Regular',
    600: 'Roboto-Medium',
    700: 'Roboto-Bold',
    800: 'Montserrat-ExtraBold',
    900: 'Roboto-Black',
    normal: 'Fonetis',
  },
};
