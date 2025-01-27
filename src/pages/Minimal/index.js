import { Alert, StyleSheet, Text, View, Image, FlatList, Modal, ActivityIndicator, Dimensions, Animated, Linking } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { apiURL, getData, MYAPP, storeData } from '../../utils/localStorage';
import { colors, fonts, windowHeight, windowWidth } from '../../utils';
import { ScrollView, TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import { showMessage } from 'react-native-flash-message';
import Sound from 'react-native-sound';
import { Icon } from 'react-native-elements/dist/icons/Icon';
import { MyButton, MyGap, MyInput, MyPicker } from '../../components';
import { useIsFocused } from '@react-navigation/native';
import axios from 'axios';
import { FloatingAction } from "react-native-floating-action";
import 'intl';
import 'intl/locale-data/jsonp/en';

export default function Minimal({ navigation }) {
    const [modalVisible, setModalVisible] = useState(false);
    const isFocused = useIsFocused();



    const [data, setData] = useState([]);
    useEffect(() => {

        if (isFocused) {
            getTransaction();
        }


    }, [isFocused]);

    const [search, setSearch] = useState('');
    const filteredData = data.filter((item) => {
        const lowerSearchText = search.toLowerCase();
        const searchWords = lowerSearchText.split(" ").filter(Boolean);
        return searchWords.every((word) => {
            return Object.values(item).some((value) =>
                value && value.toString().toLowerCase().includes(word)
            );
        });
    });


    const getTransaction = () => {
        axios.post(apiURL + 'produk_minimal').then(res => {
            setData(res.data);
        })
    }






    const __renderItem = ({ item }) => {

        return (
            <View style={{
                borderBottomWidth: 1,
                borderBottomColor: colors.zavalabs,
                backgroundColor: colors.white,
                borderRadius: 10,
                marginVertical: 5,
                flexDirection: 'row',
                overflow: 'hidden'
            }}>

                <View style={{
                    flex: 1,
                    justifyContent: 'center',
                    padding: 10,
                }}>
                    <View style={{
                        flexDirection: 'row',

                    }}>
                        <Text style={{
                            flex: 1,
                            fontFamily: fonts.secondary[600],
                            fontSize: 14,
                            color: colors.black
                        }}>{item.nama_produk}</Text>



                    </View>

                    <View style={{
                        flexDirection: 'row'
                    }}>
                        <View style={{
                            backgroundColor: colors.success,
                            paddingHorizontal: 5,
                            borderRadius: 5,
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            <Text style={{
                                fontFamily: fonts.secondary[600],
                                color: colors.white,
                                fontSize: 12
                            }}>Stock Toko Saat ini : {item.stok}</Text>
                        </View>
                        <View style={{
                            left: 10,
                            backgroundColor: colors.warning,
                            paddingHorizontal: 5,
                            borderRadius: 5,
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            <Text style={{
                                fontFamily: fonts.secondary[600],
                                color: colors.white,
                                fontSize: 12
                            }}>Minimal : {item.minimal}</Text>
                        </View>
                    </View>

                    <View style={{
                        flexDirection: 'row'
                    }}>
                        <View style={{
                            flex: 1
                        }}>
                            <View style={{
                                marginTop: 5,
                                flexDirection: 'row'
                            }}>
                                <Text style={{
                                    fontFamily: fonts.secondary[400],
                                    fontSize: 12,
                                    color: colors.foourty,
                                    flex: 0.4,
                                }}>Merek</Text>
                                <Text style={{
                                    fontFamily: fonts.secondary[400],
                                    fontSize: 12,
                                    color: colors.foourty,
                                    flex: 0.2,
                                }}>:</Text>
                                <Text style={{
                                    flex: 1,
                                    fontFamily: fonts.secondary[600],
                                    fontSize: 12,
                                    color: colors.foourty
                                }}>{item.merek}</Text>
                            </View>
                            <View style={{
                                flexDirection: 'row'
                            }}>
                                <Text style={{
                                    fontFamily: fonts.secondary[400],
                                    fontSize: 12,
                                    color: colors.foourty,
                                    flex: 0.4,
                                }}>Harga</Text>
                                <Text style={{
                                    fontFamily: fonts.secondary[400],
                                    fontSize: 12,
                                    color: colors.foourty,
                                    flex: 0.2,
                                }}>:</Text>
                                <Text style={{
                                    flex: 1,
                                    fontFamily: fonts.secondary[600],
                                    fontSize: 12,
                                    color: colors.foourty
                                }}>{new Intl.NumberFormat().format(item.harga_jual)}</Text>
                            </View>
                            <View style={{
                                flexDirection: 'row'
                            }}>
                                <Text style={{
                                    fontFamily: fonts.secondary[400],
                                    fontSize: 12,
                                    color: colors.foourty,
                                    flex: 0.4,
                                }}>Lokasi</Text>
                                <Text style={{
                                    fontFamily: fonts.secondary[400],
                                    fontSize: 12,
                                    color: colors.foourty,
                                    flex: 0.2,
                                }}>:</Text>
                                <Text style={{
                                    flex: 1,
                                    fontFamily: fonts.secondary[600],
                                    fontSize: 12,
                                    color: colors.foourty
                                }}>{item.lokasi}</Text>
                            </View>
                        </View>

                        <View style={{
                            flex: 1,
                            padding: 5,
                        }}>

                            <Text style={{
                                fontFamily: fonts.secondary[400],
                                fontSize: 12,
                                color: colors.foourty,
                                flex: 0.4,
                            }}>Motor Lainnya</Text>

                            <Text style={{
                                flex: 1,
                                fontFamily: fonts.secondary[600],
                                fontSize: 12,
                                color: colors.primary
                            }}>{item.motor_lainnya}</Text>

                        </View>
                    </View>
                </View>
                <TouchableOpacity onPress={() => navigation.navigate('ProdukDetail', item)} style={{
                    flex: 1,
                    backgroundColor: colors.primary,
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: 40,
                }}>
                    <Icon color={colors.white} type='ionicon' name='search' />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                    if (item.nama_supplier !== 'Tidak ada') {
                        Linking.openURL('https://wa.me/' + item.telepon)
                    } else {
                        showMessage({
                            type: 'danger',
                            message: 'Maaf supplier / sales belum di atur'
                        })
                    }
                }} style={{
                    flex: 1,
                    backgroundColor: item.nama_supplier !== 'Tidak ada' ? colors.success : colors.secondary,
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: 40,
                }}>
                    {item.nama_supplier == 'Tidak ada' && <Icon color={colors.white} type='ionicon' name='close' />}
                    {item.nama_supplier !== 'Tidak ada' && <Icon color={colors.white} type='ionicon' name='logo-whatsapp' />}
                </TouchableOpacity>

            </View >
        )

    }

    return (
        <SafeAreaView style={{
            flex: 1,
            backgroundColor: colors.zavalabs,
            padding: 10,
            position: 'relative'
        }}>



            <View style={{
                flex: 1,
            }}>
                <View style={{
                    flexDirection: 'row',

                    borderRadius: 10,
                    marginBottom: 10,
                }}>
                    <View style={{
                        borderBottomLeftRadius: 10,
                        borderTopLeftRadius: 10,
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: 10,
                        backgroundColor: colors.white,
                    }}>
                        <Icon type='ionicon' color={colors.border} size={20} name='search' />
                    </View>
                    <View style={{
                        flex: 1,
                        backgroundColor: colors.white,
                        borderBottomRightRadius: 10,
                        borderTopRightRadius: 10,
                    }}>
                        <TextInput placeholder='Cari Produk . . .' style={{
                            fontFamily: fonts.secondary[400],
                            fontSize: 18,
                        }} onChangeText={x => setSearch(x)} />


                    </View>

                </View>
                <FlatList keyExtractor={(item, index) => index.toString()}
                    initialNumToRender={10}
                    maxToRenderPerBatch={5} data={filteredData} renderItem={__renderItem} />
            </View>






        </SafeAreaView >
    )
}

const styles = StyleSheet.create({})