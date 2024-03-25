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
    Picker,
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
import { showMessage } from 'react-native-flash-message';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import ZavalabsScanner from 'react-native-zavalabs-scanner'
import { CurrencyInput, formatNumber, FakeCurrencyInput } from 'react-native-currency-input';
import { TouchableWithoutFeedback } from 'react-native';
import NumberFormat from 'react-number-format';
export default function Transaksi({ navigation, route }) {

    const [BAYAR, setBAYAR] = useState(0);
    const [pembayaran, setPembayaran] = useState({})

    const currencyFormat = (num) => {
        return num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
    }

    const [pilih, setPilih] = useState({});
    const [modalVisible, setModalVisible] = useState(false);
    const [modalVisible2, setModalVisible2] = useState(false);
    const [key, setKey] = useState('');
    const [kirim, setKirim] = useState({});
    const [produk, setProduk] = useState([]);
    const [tmp, setTemp] = useState([]);
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState({});
    const sendServer = () => {

        console.log(pilih)

        if (!pilih.qty) {
            Alert.alert(MYAPP, 'Jumlah harus di isi !')
        } else if (parseInt(pilih.qty) > parseInt(pilih.stok)) {
            Alert.alert(MYAPP, `Stok tidak cukup maksimal ${pilih.stok}`)
        } else {
            setModalVisible(false);
            const send = {
                fid_user: user.id,
                fid_produk: pilih.id_produk,
                qty: pilih.qty,
                harga: pilih.harga_jual,
                total: pilih.harga_jual * pilih.qty
            };

            axios.post(apiURL + 'cart_add', send).then(r => {
                console.log(r.data);
                __getCart();
            })
        }



    };

    const [trx, setTrx] = useState({
        total: 0,
        bayar: '',
        kembalian: 0,
        pembayaran: 'CASH'
    })

    const [cart, setCart] = useState([])

    useEffect(() => {
        __getBayar();
        __getProduk();
        __getCart();
    }, []);


    const __getBayar = () => {
        axios.post(apiURL + "bayar").then(res => {

            console.log('bayar', res.data[0]);
            setPembayaran(res.data[0])
        })
    }


    const __getCart = () => {
        getData('user').then(u => {
            setUser(u);
            axios.post(apiURL + "cart", {
                fid_user: u.id
            }).then(res => {
                setCart(res.data.data);
                setTrx({
                    ...trx,
                    fid_user: u.id,
                    total: res.data.total
                })

            })
        })

    }


    const simpanTransaksi = () => {
        console.log(trx);

        Alert.alert(MYAPP, 'Apakah sudah yakin ?', [
            { text: 'BATALKAN' },
            {
                text: 'OK', onPress: () => {
                    setLoading(true);
                    setTimeout(() => {

                        axios.post(apiURL + "transaksi_add", trx).then(res => {

                            console.log('trx', res.data);
                            navigation.replace('Success', {
                                trx: trx,
                                cart: cart
                            })
                        })
                    }, 1000)
                }
            }
        ])

    }

    const __getProduk = (x = key) => {


        axios.post(apiURL + "produk_list", {
            key: x
        }).then(res => {
            setProduk(res.data);
            setTemp(res.data);

        })
    }

    const myInput = useRef();

    return (
        <SafeAreaView style={{
            flex: 1,
            backgroundColor: colors.zavalabs,
            padding: 10,
            paddingTop: 20,
        }}>
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
            }}>
                <TouchableOpacity onPress={() => navigation.navigate('AAAtur')} style={{
                    height: 30,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 5,
                    width: 50,
                }}>
                    <Image source={require('../../assets/menu.png')} style={{
                        width: 18,
                        height: 18,
                    }} />
                </TouchableOpacity>
                <View style={{ flex: 1, position: 'relative' }}>
                    <TextInput placeholder='Cari Produk' style={{
                        fontFamily: fonts.secondary[600],
                        backgroundColor: colors.white,
                        height: 40,
                        paddingLeft: 10,
                        borderRadius: 10,
                    }} value={key}

                        onSubmitEditing={x => {
                            __getProduk(x.nativeEvent.text)
                        }}

                        onChangeText={x => {
                            setKey(x);
                            // if (x.length == 0) {
                            //     setProduk(tmp)
                            // } else {
                            //     const filtered = produk.filter(i => i.nama_produk.toLowerCase().indexOf(x.toLowerCase()) > -1);
                            //     setProduk(filtered);
                            // }

                        }} />

                    {key.length > 0 &&

                        <TouchableWithoutFeedback onPress={() => {
                            setKey('')
                        }}>
                            <View style={{
                                right: 5,
                                top: 8,
                                position: 'absolute'
                            }}>
                                <Icon type='ionicon' name='close-circle' />
                            </View>
                        </TouchableWithoutFeedback>
                    }
                    {/* data barang */}

                </View>
                <TouchableOpacity onPress={() => {
                    ZavalabsScanner.showBarcodeReader(result => {

                        if (result !== null) {
                            const filtered = produk.filter(i => i.barcode.toLowerCase().indexOf(result.toLowerCase()) > -1);
                            // setProduk(filtered);
                            console.log(filtered[0]);
                            setPilih(filtered[0]);
                            setModalVisible(true);
                            // myInput.current.focus();
                            setTimeout(() => {
                                myInput.current.focus();
                            }, 800)
                        }

                    });
                }} style={{
                    height: 30,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 5,
                    width: 50,
                }}>
                    <Image source={require('../../assets/barcode.png')} style={{
                        width: 35,
                        resizeMode: 'contain',
                        height: 40,
                    }} />
                </TouchableOpacity>
            </View>
            {
                key.length > 0 && produk.length > 0 && <View style={{
                    backgroundColor: colors.white,
                    marginHorizontal: 10,
                    padding: 10,
                    zIndex: 99,
                    // position: 'absolute',
                    // height: 200,

                    top: 10,
                    borderRadius: 10,
                }}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        {produk.map(i => {
                            return (
                                <View key={i.id_produk} style={{
                                    marginVertical: 10,
                                    flexDirection: 'row',
                                    borderBottomWidth: 1,
                                    paddingVertical: 5,
                                    borderBottomColor: colors.border,
                                    alignItems: 'center'
                                }}>
                                    <View style={{
                                        flex: 1,
                                    }}>
                                        <Text >{i.nama_produk}</Text>
                                        <Text style={{
                                            fontFamily: fonts.secondary[400],
                                            fontSize: 10,
                                        }}>{i.motor_lainnya}</Text>
                                    </View>
                                    <Text>Stok : {i.stok}</Text>
                                    <TouchableOpacity style={{
                                        paddingHorizontal: 10,
                                    }} onPress={() => {
                                        setPilih(i);
                                        // setKey('');
                                        setModalVisible(true);
                                        // myInput.current.focus();
                                        setTimeout(() => {
                                            myInput.current.focus();
                                        }, 800)
                                    }}>
                                        <Icon type='ionicon' name='open-outline' color={colors.primary} />
                                    </TouchableOpacity>
                                </View>
                            )
                        })}
                        <MyGap jarak={40} />
                    </ScrollView>

                </View>

            }

            <View style={{
                flex: 1,
                padding: 10,
            }}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    {cart.map(c => {
                        return (
                            <View style={{
                                marginBottom: 10,
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
                                        fontFamily: fonts.secondary[600]
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
                                        }}>
                                            <Text style={{
                                                fontFamily: fonts.secondary[400]
                                            }}>@{new Intl.NumberFormat().format(c.harga)} x {c.qty}</Text>
                                            <Text style={{
                                                fontFamily: fonts.secondary[600],
                                                fontSize: 20,
                                            }}>{new Intl.NumberFormat().format(c.total)}</Text>
                                        </View>
                                    </View>

                                </View>
                                <TouchableOpacity onPress={() => {
                                    Alert.alert(MYAPP, 'Hapus item ini ?', [
                                        { text: 'TIDAK' },
                                        {
                                            text: 'HAPUS',
                                            onPress: () => {
                                                console.log(c.id)
                                                axios.post(apiURL + 'cart_hapus', {
                                                    id: c.id,
                                                    qty: c.qty,
                                                    fid_produk: c.fid_produk
                                                }).then(r => {
                                                    console.log(r.data)
                                                    showMessage({
                                                        message: 'Item berhasil di hapus',
                                                        type: 'success'
                                                    })
                                                    __getCart();
                                                })
                                            }
                                        }
                                    ])
                                }} style={{
                                    flex: 1,
                                    width: 50,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    backgroundColor: colors.danger,

                                }}>
                                    <Icon type='ionicon' name='trash' color={colors.white} />
                                </TouchableOpacity>
                            </View>
                        )

                    })}
                </ScrollView>
            </View>
            <View style={{
                flex: 0.2,
                backgroundColor: colors.white,
                borderRadius: 10,
                flexDirection: 'row'
            }}>
                <View style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRightWidth: 1,
                    borderRightColor: colors.border
                }}>
                    <Text style={{
                        fontFamily: fonts.secondary[600],
                        fontSize: 20,
                        color: colors.primary,
                    }}>Total Belanja:</Text>
                    <Text style={{
                        fontFamily: fonts.secondary[600],
                        fontSize: 30,
                        color: colors.black,
                    }}>{new Intl.NumberFormat().format(trx.total)}</Text>
                </View>
                <View style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <Text style={{
                        fontFamily: fonts.secondary[600],
                        fontSize: 20,
                        color: colors.secondary,
                    }}>Kembalian</Text>
                    <Text style={{
                        fontFamily: fonts.secondary[600],
                        fontSize: 30,
                        color: colors.black,
                    }}>{new Intl.NumberFormat().format(trx.kembalian)}</Text>
                </View>
            </View>
            <View style={{
                marginTop: 10,
                flex: 0.2,
                flexDirection: 'row'
            }}>
                <View style={{
                    flex: 0.8,
                    paddingRight: 5,
                }}>

                    <View style={{
                        backgroundColor: colors.white,
                        borderRadius: 10,

                        fontFamily: fonts.secondary[600],
                        borderColor: colors.primary,
                    }}>
                        <Picker style={{ height: 50, transform: [{ scale: 0.9 }] }}
                            selectedValue={trx.pembayaran} onValueChange={x => {
                                if (x == 'CASH') {
                                    setTrx({
                                        ...trx,
                                        pembayaran: x,
                                        bayar: 0,

                                    })
                                } else {
                                    setModalVisible2(true)
                                    console.log(x)
                                    setTrx({
                                        ...trx,
                                        pembayaran: x,
                                        bayar: trx.total,
                                        kembalian: 0
                                    })
                                }

                            }}>

                            <Picker.Item textStyle={{ fontSize: 12 }} value="CASH" label="CASH" />
                            <Picker.Item textStyle={{ fontSize: 12 }} value="TRANSFER" label="TRANSFER" />
                            <Picker.Item textStyle={{ fontSize: 12 }} value="QRIS" label="QRIS" />

                        </Picker>
                    </View>
                </View>
                <View style={{
                    flex: 1,
                }}>







                    {/* <TextInput


                        onChangeText={async x => {


                            let FRMT = formatNumber(x, {
                                separator: ',',
                                prefix: '',
                                precision: 0,
                                delimiter: ',',
                            });
                            console.log(FRMT)

                            let deciFormatted = Number(FRMT).toFixed(0)
                            let newValue = (isNaN(deciFormatted) ? FRMT : deciFormatted);

                            setBAYAR(newValue);
                            setTrx({
                                ...trx,
                                bayar: x,
                                kembalian: x - trx.total
                            })




                        }} keyboardType='number-pad' style={{
                            borderRadius: 10,
                            paddingLeft: 10,
                            backgroundColor: colors.white,
                            fontFamily: fonts.secondary[600],
                            fontSize: 20,
                            height: 50,
                            color: colors.primary,
                        }} /> */}
                    <View style={{
                        backgroundColor: colors.white,
                        height: 50,
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: 10,
                    }}>
                        <FakeCurrencyInput
                            style={{
                                backgroundColor: colors.white,

                                textAlign: 'center',
                                fontSize: 22,
                                color: colors.primary,
                                fontFamily: fonts.secondary[600]
                            }}
                            value={BAYAR}
                            onChangeValue={x => {
                                setBAYAR(x);

                            }}
                            prefix=""
                            delimiter=","
                            separator="."
                            precision={0}
                            onChangeText={(formattedValue) => {
                                let byr = formattedValue.replace(",", "").replace(",", "").replace(",", "");
                                setTrx({
                                    ...trx,
                                    bayar: byr,
                                    kembalian: byr - trx.total
                                })
                            }}
                        />
                    </View>
                </View>

                <TouchableOpacity style={{
                    marginLeft: 10,
                    borderRadius: 10,
                    backgroundColor: colors.white,
                    height: 50,
                    width: 60,
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <Image source={require('../../assets/calc.png')} style={{
                        width: 40,
                        height: 40,
                    }} />
                </TouchableOpacity>

            </View>

            <View>
                {!loading && <MyButton onPress={simpanTransaksi} title="SIMPAN TRANSAKSI" Icons="save" />}
                {loading && <ActivityIndicator size="large" color={colors.primary} />}
            </View>

            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible2}
                onRequestClose={() => {
                    setModalVisible2(!modalVisible2);
                }}>
                <View style={{
                    flex: 1,
                    padding: 10,
                    justifyContent: 'center',
                    backgroundColor: '#000000BF'
                }}>
                    <View style={{
                        height: windowHeight / 2,
                        backgroundColor: colors.white,
                        padding: 10
                    }}>
                        <Text style={{
                            fontFamily: fonts.secondary[600],
                            fontSize: 20
                        }}>PEMBAYARAN {trx.pembayaran}</Text>


                        {trx.pembayaran == 'QRIS' &&

                            <View>
                                <Image source={{
                                    uri: pembayaran.qris
                                }} style={{
                                    width: '100%',
                                    height: 300,
                                    resizeMode: 'contain'
                                }} />

                            </View>

                        }

                        {trx.pembayaran !== 'QRIS' &&

                            <>
                                <View style={{
                                    marginTop: 20,
                                }}>
                                    <Text style={{
                                        fontFamily: fonts.secondary[600],
                                        fontSize: 20
                                    }}>Nama Bank</Text>
                                    <Text style={{
                                        fontFamily: fonts.secondary[800],
                                        fontSize: 20
                                    }}>{pembayaran.nama_bank}</Text>
                                </View>
                                <View style={{
                                    marginTop: 0,
                                }}>
                                    <Text style={{
                                        fontFamily: fonts.secondary[600],
                                        fontSize: 20
                                    }}>Nomor Rekening</Text>
                                    <Text style={{
                                        fontFamily: fonts.secondary[800],
                                        fontSize: 20
                                    }}>{pembayaran.rekening}</Text>
                                </View>
                                <View style={{
                                    marginTop: 0,
                                }}>
                                    <Text style={{
                                        fontFamily: fonts.secondary[600],
                                        fontSize: 20
                                    }}>Atas Nama</Text>
                                    <Text style={{
                                        fontFamily: fonts.secondary[800],
                                        fontSize: 20
                                    }}>{pembayaran.atas_nama}</Text>
                                </View>

                            </>


                        }
                    </View>
                </View>
            </Modal>

            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}>
                <View style={{
                    flex: 1,
                    padding: 10,
                    justifyContent: 'center',
                    backgroundColor: '#000000BF'
                }}>
                    <View style={{
                        height: windowHeight / 2,
                        backgroundColor: colors.white,
                        // padding: 10
                    }}>
                        <Text style={{
                            fontFamily: fonts.secondary[600],
                            fontSize: 20,
                            textAlign: 'center',
                            backgroundColor: colors.primary,
                            padding: 10,
                            color: colors.white,
                            marginBottom: 10,
                        }}>{MYAPP}</Text>
                        <View style={{
                            padding: 10,
                            flex: 1,
                        }}>
                            <Text style={{
                                fontFamily: fonts.secondary[600],
                                fontSize: 20
                            }}>{pilih.nama_produk}</Text>
                            <Text style={{
                                fontFamily: fonts.secondary[400],
                                fontSize: 20
                            }}>Stok : {pilih.stok}</Text>

                            <MyPicker onValueChange={x => {

                                if (x == 'Umum') {
                                    setPilih({
                                        ...pilih,
                                        harga_jual: pilih.harga_jual_tmp
                                    })
                                } else if (x == 'Silver') {
                                    setPilih({
                                        ...pilih,
                                        harga_jual: pilih.harga_silver
                                    })
                                } else if (x == 'Gold') {
                                    setPilih({
                                        ...pilih,
                                        harga_jual: pilih.harga_gold
                                    })
                                } else if (x == 'Platinum') {
                                    setPilih({
                                        ...pilih,
                                        harga_jual: pilih.harga_platinum
                                    })
                                }

                            }} label="Jenis Harga" iconname="options" data={[
                                { label: 'Umum', value: 'Umum' },
                                { label: 'Silver', value: 'Silver' },
                                { label: 'Gold', value: 'Gold' },
                                { label: 'Platinum', value: 'Platinum' },

                            ]} />

                            <Text style={{
                                fontFamily: fonts.secondary[400],
                                fontSize: 20,
                                color: colors.success
                            }}>Harga : {new Intl.NumberFormat().format(pilih.harga_jual)}</Text>

                            <MyGap jarak={10} />
                            <TextInput onChangeText={x => {
                                setPilih({
                                    ...pilih,
                                    qty: x
                                })
                            }} ref={myInput} keyboardType='number-pad' placeholder='Masukan Jumlah' style={{
                                backgroundColor: colors.zavalabs,
                                marginVertical: 10,
                                borderRadius: 10,
                                textAlign: 'center',
                                fontFamily: fonts.secondary[600],
                                fontSize: 20,
                            }} />
                        </View>
                        <View style={{
                            padding: 10,
                        }}>
                            <MyButton onPress={sendServer} warna={colors.secondary} title="OK" Icons="filter" />
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({})