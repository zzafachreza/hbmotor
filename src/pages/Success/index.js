import React, { useEffect, useRef, useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    Image,
    Linking,
    Alert,
    ActivityIndicator,
    ScrollView,
    Modal,
    TextInput,
} from 'react-native';
import { windowWidth, fonts, windowHeight } from '../../utils/fonts';
import { apiURL, getData, MYAPP, storeData, urlAPI, urlApp, urlAvatar } from '../../utils/localStorage';
import { colors } from '../../utils/colors';
import { MyButton, MyGap, MyInput, MyPicker } from '../../components';
import { Icon } from 'react-native-elements';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useIsFocused } from '@react-navigation/native';
import axios from 'axios';
import 'intl';
import 'intl/locale-data/jsonp/en';
import moment from 'moment';
import { BluetoothEscposPrinter, BluetoothManager } from 'react-native-bluetooth-escpos-printer';
import {
    USBPrinter,
    NetPrinter,
    BLEPrinter,
} from "react-native-thermal-receipt-printer";


export default function Success({ navigation, route }) {

    const trx = route.params;
    console.log(route.params);


    const [paired, setPaired] = useState({});
    const [data, setData] = useState({
        detail: [],
        header: {
            tanggal: '',
            jam: '',
            kode: route.params.kode,
            total: 0,
            kembalian: 0,
            bayar: 0
        },
        total: 0
    });

    useEffect(() => {
        getData('paired').then(res => {
            console.log(res);
            if (!res) {
                Alert.alert(MYAPP, 'Printer bluetooth belum dipilih !')
            } else {
                setPaired(res)
            }

        })
        __getDetail();
    }, []);


    const __getDetail = () => {


        axios.post(apiURL + 'transaksi_detail_print', {
            fid_user: route.params.fid_user
        }).then(res => {

            console.log(res.data)
            setData(res.data);



        })




    }



    return (
        <SafeAreaView style={{
            flex: 1,
            backgroundColor: colors.zavalabs
        }}>
            <View style={{
                flex: 1,
                marginTop: 20,
                backgroundColor: colors.white,
                margin: 10,
                borderRadius: 10,
            }}>
                <View style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <Image source={require('../../assets/ok.png')} style={{
                        width: 150,
                        height: 150,
                        marginBottom: 10,
                    }} />
                    <Text style={{
                        fontFamily: fonts.secondary[600],
                        fontSize: 20,
                    }}>Transaksi Berhasil !</Text>
                </View>
                <View style={{
                    flex: 0.5,
                    paddingHorizontal: 20,
                }}>


                    <View style={{
                        flexDirection: 'row',
                        marginBottom: 10,
                    }}>
                        <Text style={{
                            flex: 1,
                            fontFamily: fonts.secondary[400],
                            fontSize: 20,
                        }}>Pembayaran</Text>
                        <Text style={{
                            fontFamily: fonts.secondary[600],
                            fontSize: 20,
                        }}>Tunai</Text>
                    </View>
                    <View style={{
                        flexDirection: 'row',
                        marginBottom: 10,
                    }}>
                        <Text style={{
                            flex: 1,
                            fontFamily: fonts.secondary[400],
                            fontSize: 20,
                        }}>Total Tagihan</Text>
                        <Text style={{
                            fontFamily: fonts.secondary[600],
                            fontSize: 20,
                        }}>Rp {new Intl.NumberFormat().format(trx.total)}</Text>
                    </View>
                    <View style={{
                        flexDirection: 'row',
                        marginBottom: 10,
                    }}>
                        <Text style={{
                            flex: 1,
                            fontFamily: fonts.secondary[400],
                            fontSize: 20,
                        }}>Diterima</Text>
                        <Text style={{
                            fontFamily: fonts.secondary[600],
                            fontSize: 20,
                        }}>Rp {new Intl.NumberFormat().format(trx.bayar)}</Text>
                    </View>
                    <View style={{
                        flexDirection: 'row',
                        marginBottom: 10,
                    }}>
                        <Text style={{
                            flex: 1,
                            fontFamily: fonts.secondary[400],
                            fontSize: 20,
                        }}>Kembalian</Text>
                        <Text style={{
                            fontFamily: fonts.secondary[600],
                            fontSize: 20,
                        }}>Rp {new Intl.NumberFormat().format(trx.kembalian)}</Text>
                    </View>

                </View>
            </View>
            <View style={{
                // flex: 0.4,
                margin: 10,
            }}>
                <MyButton warna='transparent' borderSize={1}

                    onPress={async () => {
                        BluetoothManager.connect(paired.inner_mac_address)
                            .then(async (s) => {
                                console.log(s);
                                let columnWidths = [8, 20, 20];
                                try {

                                    // await BluetoothEscposPrinter.printPic(logoCetak, { width: 250, left: 150 });
                                    await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.CENTER);
                                    await BluetoothEscposPrinter.printColumn(
                                        [15],
                                        [BluetoothEscposPrinter.ALIGN.CENTER],
                                        ['HM Motor'],
                                        {
                                            encoding: 'GBK',
                                            codepage: 0,
                                            widthtimes: 2,
                                            heigthtimes: 1,
                                            fonttype: 1
                                        },
                                    );

                                    await BluetoothEscposPrinter.printColumn(
                                        [32],
                                        [BluetoothEscposPrinter.ALIGN.CENTER],
                                        ['Banjarbaru, Kalimantan Selatan'],
                                        {},
                                    );
                                    await BluetoothEscposPrinter.printColumn(
                                        [32],
                                        [BluetoothEscposPrinter.ALIGN.CENTER],
                                        ['Tlp +6285715514097'],
                                        {},
                                    );
                                    await BluetoothEscposPrinter.printText(
                                        '-------------------------------\r\n',
                                        {},
                                    );
                                    await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.LEFT);
                                    await BluetoothEscposPrinter.printText(
                                        `${moment(data.header.tanggal + ' ' + data.header.jam).format('DD/MM/YYYY HH:mm:ss')} WIB\r\n`,
                                        {},
                                    );
                                    await BluetoothEscposPrinter.printColumn(
                                        [15, 17],
                                        [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
                                        ['No. Transaksi', `${moment(data.header.tanggal + ' ' + data.header.jam).format('YYMMDDHHmmss')}`],
                                        {},
                                    );
                                    await BluetoothEscposPrinter.printColumn(
                                        [15, 17],
                                        [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
                                        ['Pembayaran', `${data.header.pembayaran}`],
                                        {},
                                    );

                                    await BluetoothEscposPrinter.printText(
                                        '-------------------------------\r\n',
                                        {},
                                    );

                                    // loopiong

                                    data.detail.map(i => {
                                        BluetoothEscposPrinter.printColumn(
                                            [15, 17],
                                            [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
                                            [`${i.nama_produk}`, `Rp. ${new Intl.NumberFormat().format(i.total)}`],
                                            {},
                                        );
                                        BluetoothEscposPrinter.printColumn(
                                            [23, 12],
                                            [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
                                            [`${new Intl.NumberFormat().format(i.harga)} x ${i.qty}`,
                                                ``
                                            ],
                                            {
                                                fonttype: 3,
                                            },
                                        );
                                    })

                                    await BluetoothEscposPrinter.printText(
                                        '-------------------------------\r\n',
                                        {},
                                    );
                                    await BluetoothEscposPrinter.printColumn(
                                        [15, 17],
                                        [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
                                        ['Bayar', `Rp. ${new Intl.NumberFormat().format(data.header.bayar)}`],
                                        {},
                                    );
                                    await BluetoothEscposPrinter.printColumn(
                                        [15, 17],
                                        [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
                                        ['Kembalian', `Rp. ${new Intl.NumberFormat().format(data.header.kembalian)}`],
                                        {},
                                    );
                                    await BluetoothEscposPrinter.printColumn(
                                        [15, 17],
                                        [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
                                        ['Transaksi', `Rp. ${new Intl.NumberFormat().format(data.header.total)}`],
                                        {},
                                    );
                                    await BluetoothEscposPrinter.printText(
                                        '\r\n',
                                        {},
                                    );

                                    await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.CENTER);


                                    await BluetoothEscposPrinter.printText(
                                        '\r\n\r\n',
                                        {},
                                    );



                                } catch (e) {
                                    alert(e.message || 'ERROR');
                                }



                            }, (e) => {

                                alert(e);
                            })

                    }}



                    title="Cetak Struk" colorText={colors.primary} iconColor={colors.primary} Icons='print' />
                <MyGap jarak={10} />
                <MyButton title="Mulai Transaksi Baru" Icons='cart' onPress={() => navigation.replace('Transaksi')} />
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({})