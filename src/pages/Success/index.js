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
import { FlatList } from 'react-native';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import Share from 'react-native-share';


export default function Success({ navigation, route }) {

    const trx = route.params.trx;
    const cart = route.params.cart;
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


    const createPDF = async () => {

        let header = `
        <center><img src="https://hbmotor.okeadmin.com/upload/230516115447logo.png" width="100" height="100" /></center>
        <table width="100%" border="0" style="margin-top:2%;border-collapse:collapse" cellpadding="4">
        <tr>
            <td>
                Tanggal
            </td>
            <td>${moment().format('dddd, DD MMMM YYYY')}</td>
        </tr>

        <tr>
        <td>
            Pembayaran
        </td>
        <td>${trx.pembayaran}</td>
    </tr>

        </table>
        <hr />
        <table width="100%" border="0" style="margin-top:5%;border-collapse:collapse" cellpadding="4">
      `;

        let body = '';
        cart.map(item => {
            body += `<tr>`;
            body += `<td>${item.nama_produk} <br/> ${item.qty} x ${new Intl.NumberFormat().format(item.harga)}</td>`;
            body += `<td>Rp ${new Intl.NumberFormat().format(item.harga * item.qty)}`;
            body += `</tr>`;
        });

        let footer = `</table>

        <hr />
        <table width="100%" border="0" style="margin-top:2%;border-collapse:collapse" cellpadding="4">
        <tr>
            <td>
                Total Tagihan
            </td>
            <td><h4>Rp ${new Intl.NumberFormat().format(trx.total)}</h4></td>
        </tr>

        <tr>
            <td>
                Diterima
            </td>
            <td><h4>Rp ${new Intl.NumberFormat().format(trx.bayar)}</h4></td>
        </tr>

        <tr>
            <td>
                Kembalian
            </td>
            <td><h4>Rp ${new Intl.NumberFormat().format(trx.kembalian)}</h4></td>
        </tr>

        </table>
        
        `;

        let options = {
            html: header + body + footer,
            fileName: 'HBMotor',
            directory: 'Documents',
            width: 200,
        };

        console.log(options.html)



        let file = await RNHTMLtoPDF.convert(options)
        // console.log(file.filePath);
        // alert(file.filePath);

        await Share.open({
            title: MYAPP,
            message: "Struk Penjualan",
            url: 'file:///' + file.filePath,
            subject: "Report",
        })
            .then((res) => {
                console.log(res);

            })
            .catch((err) => {
                err && console.log(err);
            });

    }

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


    const __renderItem = ({ item }) => {

        return (
            <View style={{
                marginHorizontal: 10,
                // borderBottomWidth: 1,
                // borderBottomWidth: colors.border,
                marginVertical: 5,
                flexDirection: 'row',
                alignItems: 'center'
            }}>
                <View style={{
                    flex: 1,
                }}>
                    <Text style={{
                        fontFamily: fonts.secondary[600],
                        fontSize: 12,
                    }}>{item.nama_produk}</Text>
                    <Text style={{
                        fontFamily: fonts.secondary[600],
                        fontSize: 12,
                    }}>{item.qty} x {new Intl.NumberFormat().format(item.harga)}</Text>
                </View>
                <Text style={{
                    fontFamily: fonts.secondary[600],
                    fontSize: 15,
                }}>Rp {new Intl.NumberFormat().format(item.harga * item.qty)}</Text>
            </View>
        )

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
                    flex: 0.4,
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <Image source={require('../../assets/ok.png')} style={{
                        width: 80,
                        height: 80,
                        marginBottom: 10,
                    }} />
                    <Text style={{
                        fontFamily: fonts.secondary[600],
                        fontSize: 20,
                    }}>Transaksi Berhasil !</Text>

                </View>

                <View style={{
                    flex: 1,
                }}>
                    <FlatList data={cart} renderItem={__renderItem} />
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
                            fontSize: 16,
                        }}>Pembayaran</Text>
                        <Text style={{
                            fontFamily: fonts.secondary[600],
                            fontSize: 16,
                        }}>{trx.pembayaran}</Text>
                    </View>
                    <View style={{
                        flexDirection: 'row',
                        marginBottom: 10,
                    }}>
                        <Text style={{
                            flex: 1,
                            fontFamily: fonts.secondary[400],
                            fontSize: 16,
                        }}>Total Tagihan</Text>
                        <Text style={{
                            fontFamily: fonts.secondary[600],
                            fontSize: 16,
                        }}>Rp {new Intl.NumberFormat().format(trx.total)}</Text>
                    </View>
                    <View style={{
                        flexDirection: 'row',
                        marginBottom: 10,
                    }}>
                        <Text style={{
                            flex: 1,
                            fontFamily: fonts.secondary[400],
                            fontSize: 16,
                        }}>Diterima</Text>
                        <Text style={{
                            fontFamily: fonts.secondary[600],
                            fontSize: 16,
                        }}>Rp {new Intl.NumberFormat().format(trx.bayar)}</Text>
                    </View>
                    <View style={{
                        flexDirection: 'row',
                        marginBottom: 10,
                    }}>
                        <Text style={{
                            flex: 1,
                            fontFamily: fonts.secondary[400],
                            fontSize: 16,
                        }}>Kembalian</Text>
                        <Text style={{
                            fontFamily: fonts.secondary[600],
                            fontSize: 16,
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
                <MyButton warna={colors.danger} title="Share Struk" Icons='download' onPress={createPDF} />
                <MyGap jarak={10} />
                <MyButton title="Mulai Transaksi Baru" Icons='cart' onPress={() => navigation.replace('Transaksi')} />
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({})