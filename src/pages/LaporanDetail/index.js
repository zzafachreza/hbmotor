import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useState } from 'react';
import { useEffect } from 'react';
import { SafeAreaView } from 'react-native';
import { colors, fonts } from '../../utils';
import { ActivityIndicator } from 'react-native';
import axios from 'axios';
import 'intl';
import 'intl/locale-data/jsonp/en';
import moment from 'moment';
import { MYAPP, apiURL, getData } from '../../utils/localStorage';
import { BluetoothEscposPrinter, BluetoothManager } from 'react-native-bluetooth-escpos-printer';
import {
    USBPrinter,
    NetPrinter,
    BLEPrinter,
} from "react-native-thermal-receipt-printer";
import { MyButton, MyGap } from '../../components';
import { Alert } from 'react-native';
export default function LaporanDetail({ navigation, route }) {

    const kode = route.params;

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
    const [loading, setLoading] = useState(true)
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
        setLoading(true);

        axios.post(apiURL + 'transaksi_detail', {
            kode: route.params.kode
        }).then(res => {

            setData(res.data);

            setLoading(false)

        })




    }

    return (
        <SafeAreaView style={{
            flex: 1,
            backgroundColor: colors.zavalabs,
            padding: 10,
        }}>

            {loading &&
                <View style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>}

            {!loading &&
                <View style={{
                    flex: 1,
                }}>


                    <View style={{
                        backgroundColor: colors.white,
                        padding: 10,
                    }}>

                        <Text style={{
                            fontFamily: fonts.secondary[600],
                            fontSize: 14,
                            color: colors.black
                        }}>{moment(data.header.tanggal + ' ' + data.header.jam).format('DD/MM/YYYY HH:mm:ss')}</Text>


                        {data.detail.map(c => {
                            return (
                                <View style={{
                                    marginBottom: 10,
                                    borderBottomWidth: 1,
                                    borderBottomColor: colors.zavalabs,
                                    backgroundColor: colors.white,
                                    borderRadius: 10,
                                    overflow: 'hidden',
                                    flexDirection: 'row'
                                }}>
                                    <View style={{
                                        flex: 1,
                                        padding: 10,
                                    }}>
                                        <Text style={{
                                            fontFamily: fonts.secondary[600],
                                            fontSize: 14,
                                        }}>{c.nama_produk}</Text>
                                        <View style={{
                                            flexDirection: 'row'
                                        }}>
                                            <View style={{
                                                flex: 1,
                                            }}>
                                                <Text style={{
                                                    fontFamily: fonts.secondary[400]
                                                }}>Merek : {c.merek}</Text>
                                                <Text style={{
                                                    fontFamily: fonts.secondary[400]
                                                }}>Motor : {c.motor_lainnya}</Text>
                                            </View>
                                            <View style={{
                                                flex: 1,
                                                alignItems: 'center'
                                            }}>
                                                <Text style={{
                                                    fontFamily: fonts.secondary[400]
                                                }}>@{new Intl.NumberFormat().format(c.harga)} x {c.qty}</Text>
                                            </View>
                                            <View style={{
                                                // flex: 1,
                                            }}>

                                                <Text style={{
                                                    fontFamily: fonts.secondary[600],
                                                    fontSize: 15,
                                                }}>Rp {new Intl.NumberFormat().format(c.total)}</Text>
                                            </View>
                                        </View>

                                    </View>

                                </View>
                            )

                        })}


                    </View>

                    <View style={{
                        marginTop: 10,
                        backgroundColor: colors.white,
                        padding: 10,
                    }}>
                        <View style={{
                            // flex: 1,
                            flexDirection: 'row',
                            marginVertical: 5,
                        }}>
                            <Text style={{
                                flex: 1,
                                fontFamily: fonts.secondary[400],
                                fontSize: 14,
                            }}>Total Bayar</Text>

                            <Text style={{
                                fontFamily: fonts.secondary[400],
                                fontSize: 15,
                            }}>Rp {new Intl.NumberFormat().format(data.header.bayar)}</Text>
                        </View>
                        <View style={{
                            // flex: 1,
                            flexDirection: 'row',
                            marginVertical: 5,
                        }}>
                            <Text style={{
                                flex: 1,
                                fontFamily: fonts.secondary[400],
                                fontSize: 14,
                            }}>Kembalian</Text>

                            <Text style={{

                                fontFamily: fonts.secondary[400],
                                fontSize: 15,
                            }}>Rp {new Intl.NumberFormat().format(data.header.kembalian)}</Text>
                        </View>
                        <View style={{
                            // flex: 1,
                            flexDirection: 'row',
                            marginVertical: 5,
                        }}>
                            <Text style={{
                                flex: 1,
                                fontFamily: fonts.secondary[400],
                                fontSize: 14,
                            }}>Total Transaksi</Text>

                            <Text style={{

                                fontFamily: fonts.secondary[600],
                                fontSize: 18,
                            }}>Rp {new Intl.NumberFormat().format(data.header.total)}</Text>
                        </View>

                    </View>
                    <MyGap jarak={20} />
                    <MyButton

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

                        }} warna={colors.primary} title="Print Struk" Icons="print" />
                    <MyGap jarak={20} />
                    <MyButton onPress={() => {
                        Alert.alert(MYAPP, 'Apakah kamu yakin akan hapus ini ? ( Stok akan kembali bertambah terhadap produk yang di transaksikan )',
                            [
                                {
                                    text: 'BATAL'
                                },
                                {
                                    text: 'HAPUS',
                                    onPress: () => {
                                        axios.post(apiURL + 'transaksi_delete', {
                                            kode: data.header.kode
                                        }).then(res => {
                                            console.log(res.data)
                                        }).finally(() => {
                                            navigation.goBack();
                                            alert('Transaksi Berhasil di hapus !')
                                        })
                                    }
                                }
                            ]
                        )
                    }} warna={colors.danger} title="Hapus Transaksi" Icons="trash" />


                </View>}


        </SafeAreaView>
    )
}

const styles = StyleSheet.create({})