import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import {
  Splash,
  Home,
  Login,
  Register,
  GetStarted,
  Account,
  AccountEdit,
  Pengguna,
  PenggunaAdd,
  PenggunaEdit,
  AAAtur,
  LupaPassword,
  PenggunaDetail,
  Produk,
  ProdukAdd,
  ProdukDetail,
  ProdukEdit,
  Transaksi,
  Laporan,
  Minimal,
  Success,
  PrinterBluetooth,
  LaporanDetail,
  Laris,
  Laba,
  Sales,
  SalesAdd,
  SalesEdit,
} from '../pages';
import { colors } from '../utils';
import { Icon } from 'react-native-elements';

const Stack = createStackNavigator();

export default function Router() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Splash"
        component={Splash}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="AAAtur"
        component={AAAtur}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="Sales"
        component={Sales}
        options={{
          headerShown: true,
          headerTitle: 'Supplier / Sales',
          headerStyle: {
            backgroundColor: colors.white,
          },
          headerTintColor: colors.black,
        }}
      />

      <Stack.Screen
        name="SalesAdd"
        component={SalesAdd}
        options={{
          headerShown: true,
          headerTitle: 'Tambah Supplier / Sales',
          headerStyle: {
            backgroundColor: colors.white,
          },
          headerTintColor: colors.black,
        }}
      />

      <Stack.Screen
        name="SalesEdit"
        component={SalesEdit}
        options={{
          headerShown: true,
          headerTitle: 'Edit Supplier / Sales',
          headerStyle: {
            backgroundColor: colors.white,
          },
          headerTintColor: colors.black,
        }}
      />




      <Stack.Screen
        name="Laris"
        component={Laris}
        options={{
          headerShown: true,
          headerTitle: 'Produk Terlaris',
          headerStyle: {
            backgroundColor: colors.white,
          },
          headerTintColor: colors.black,
        }}
      />

      <Stack.Screen
        name="Laba"
        component={Laba}
        options={{
          headerShown: true,
          headerTitle: 'Laba dan Omzet',
          headerStyle: {
            backgroundColor: colors.white,
          },
          headerTintColor: colors.black,
        }}
      />

      <Stack.Screen
        name="Login"
        component={Login}
        options={{
          headerShown: false,
          // headerTitle: 'Detail',
          headerStyle: {
            backgroundColor: colors.primary,
          },
          headerTintColor: '#fff',
        }}
      />

      <Stack.Screen
        name="LupaPassword"
        component={LupaPassword}
        options={{
          // headerShown: false,
          headerTitle: 'LUPA PIN',
          headerStyle: {
            backgroundColor: colors.white,
          },
          headerTintColor: colors.black,
        }}
      />


      <Stack.Screen
        name="Register"
        component={Register}
        options={{
          headerShown: false,
          headerTitle: 'Daftar Pengguna',
          headerStyle: {
            backgroundColor: colors.primary,
          },
          headerTintColor: '#fff',
        }}
      />





      <Stack.Screen
        name="Account"
        component={Account}
        options={{
          headerShown: false,

        }}
      />
      <Stack.Screen
        name="AccountEdit"
        component={AccountEdit}
        options={{
          headerShown: true,
          headerTitle: 'Edit Profile',
          headerStyle: {
            backgroundColor: colors.white,
          },
          headerTintColor: '#000',
        }}
      />

      <Stack.Screen
        name="Pengguna"
        component={Pengguna}
        options={{
          headerShown: true,
          headerTitle: 'Kelola Pegawai',
          headerStyle: {
            backgroundColor: colors.white,
          },
          headerTintColor: colors.black,
        }}
      />



      <Stack.Screen
        name="PenggunaAdd"
        component={PenggunaAdd}
        options={{
          headerShown: true,
          headerTitle: 'Tambah Pegawai',
          headerStyle: {
            backgroundColor: colors.white,
          },
          headerTintColor: colors.black,
        }}
      />

      <Stack.Screen
        name="PenggunaDetail"
        component={PenggunaDetail}
        options={{
          headerShown: true,
          headerTitle: 'Detail Pegawai',
          headerStyle: {
            backgroundColor: colors.white,
          },
          headerTintColor: colors.black,
        }}
      />





      <Stack.Screen
        name="PenggunaEdit"
        component={PenggunaEdit}
        options={{
          headerShown: true,
          headerTitle: 'Edit Pegawai',
          headerStyle: {
            backgroundColor: colors.white,
          },
          headerTintColor: colors.black,
        }}
      />




      <Stack.Screen
        name="GetStarted"
        component={GetStarted}
        options={{
          headerShown: false,
        }}
      />








      <Stack.Screen
        name="Home"
        component={Home}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="Transaksi"
        component={Transaksi}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="Laporan"
        component={Laporan}
        options={{
          headerShown: true,
          title: 'Laporan Transaksi'
        }}
      />

      <Stack.Screen
        name="Success"
        component={Success}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="Minimal"
        component={Minimal}
        options={{
          headerShown: true,
          headerTitle: 'Minimal Stok Produk',
          headerStyle: {
            backgroundColor: colors.white,
          },
          headerTintColor: colors.black,
        }}
      />

      {/* PRODUK */}

      <Stack.Screen
        name="Produk"
        component={Produk}
        options={{
          headerShown: true,
          headerTitle: 'Kelola Produk',
          headerStyle: {
            backgroundColor: colors.white,
          },
          headerTintColor: colors.black,
        }}
      />

      <Stack.Screen
        name="ProdukAdd"
        component={ProdukAdd}
        options={{
          headerShown: true,
          headerTitle: 'Tambah Produk',
          headerStyle: {
            backgroundColor: colors.white,
          },
          headerTintColor: colors.black,
        }}
      />

      <Stack.Screen
        name="ProdukDetail"
        component={ProdukDetail}
        options={{
          headerShown: true,
          headerTitle: 'Detail Produk',
          headerStyle: {
            backgroundColor: colors.white,
          },
          headerTintColor: colors.black,
        }}
      />


      <Stack.Screen
        name="ProdukEdit"
        component={ProdukEdit}
        options={{
          headerShown: true,
          headerTitle: 'Edit Produk',
          headerStyle: {
            backgroundColor: colors.white,
          },
          headerTintColor: colors.black,
        }}
      />



      <Stack.Screen
        name="PrinterBluetooth"
        component={PrinterBluetooth}
        options={{
          headerShown: true,
          headerTitle: 'Pengaturan Printer',
          headerStyle: {
            backgroundColor: colors.white,
          },
          headerTintColor: colors.black,
        }}
      />


      <Stack.Screen
        name="LaporanDetail"
        component={LaporanDetail}
        options={{
          headerShown: true,
          headerTitle: 'Transaksi Detail',
          headerStyle: {
            backgroundColor: colors.white,
          },
          headerTintColor: colors.black,
        }}
      />






    </Stack.Navigator>
  );
}
