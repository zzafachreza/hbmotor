import { Alert, StyleSheet, Text, View, Image, FlatList, Modal, ActivityIndicator, Dimensions, Animated } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { apiURL, getData, MYAPP, storeData } from '../../utils/localStorage';
import { colors, fonts, windowHeight, windowWidth } from '../../utils';
import { ScrollView, TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import { showMessage } from 'react-native-flash-message';
import Sound from 'react-native-sound';
import { Icon } from 'react-native-elements/dist/icons/Icon';
import { MyButton, MyGap, MyInput, MyPicker, MyCalendar } from '../../components';
import { useIsFocused } from '@react-navigation/native';
import axios from 'axios';
import { FloatingAction } from "react-native-floating-action";
import 'intl';
import 'intl/locale-data/jsonp/en';
import moment from 'moment';

export default function Laba({ navigation }) {
    const [modalVisible, setModalVisible] = useState(false);
    const isFocused = useIsFocused();



    const [data, setData] = useState([]);
    const [tmp, setTemp] = useState([]);
    const [filter, setFilter] = useState({
        awal: moment().format('YYYY-MM-DD'),
        akhir: moment().format('YYYY-MM-DD'),
    })


    const filterData = () => {

        getData('user').then(u => {
            axios.post(apiURL + 'laba', {
                fid_user: u.id,
                level: u.level,
                awal: filter.awal,
                akhir: filter.akhir
            }).then(res => {
                console.log(res.data);
                setData(res.data);
                setTemp(res.data);
            })
        })



    }


    const __renderItem = ({ item }) => {

        return (

            <View style={{
                backgroundColor: colors.white,
                padding: 10,
                marginVertical: 2,
            }}>
                <Text style={{

                    fontFamily: fonts.secondary[600],
                    fontSize: 14,
                    color: colors.black
                }}>{moment(item.tanggal).format('DD/MM/YYYY')}</Text>
                <Text style={{

                    fontFamily: fonts.secondary[800],
                    fontSize: 14,
                    color: colors.black
                }}>{item.nama_produk}</Text>
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center'
                }}>
                    <Text style={{
                        flex: 1,
                        fontFamily: fonts.secondary[400],
                        fontSize: 14,
                        color: colors.black
                    }}>Modal</Text>
                    <Text style={{
                        flex: 1,
                        fontFamily: fonts.secondary[400],
                        fontSize: 14,
                        color: colors.black
                    }}>Rp {new Intl.NumberFormat().format(item.harga_modal)}</Text>
                </View>
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center'
                }}>
                    <Text style={{
                        flex: 1,
                        fontFamily: fonts.secondary[400],
                        fontSize: 14,
                        color: colors.black
                    }}>Omzet</Text>
                    <Text style={{
                        flex: 1,
                        fontFamily: fonts.secondary[400],
                        fontSize: 14,
                        color: colors.black
                    }}>Rp {new Intl.NumberFormat().format(item.total)}</Text>
                </View>
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center'
                }}>
                    <Text style={{
                        flex: 1,
                        fontFamily: fonts.secondary[400],
                        fontSize: 14,
                        color: colors.black
                    }}>Laba</Text>
                    <Text style={{
                        flex: 1,
                        fontFamily: fonts.secondary[800],
                        fontSize: 14,
                        color: colors.success
                    }}>Rp {new Intl.NumberFormat().format(item.laba)}</Text>
                </View>


            </View>


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
                flexDirection: 'row',
                backgroundColor: colors.white,
                padding: 5,

            }}>
                <View style={{
                    flex: 1,
                    paddingRight: 5,
                }}>
                    <MyCalendar value={filter.awal} label="Dari" iconname="calendar" onDateChange={x => {
                        setFilter({
                            ...filter,
                            awal: x
                        })
                    }} />
                </View>
                <View style={{
                    flex: 1,
                    paddingLeft: 5,
                }}>
                    <MyCalendar value={filter.akhir} label="Sampai" iconname="calendar" onDateChange={x => {
                        setFilter({
                            ...filter,
                            akhir: x
                        })
                    }} />
                </View>
                <View style={{
                    flex: 0.5,
                    justifyContent: 'flex-end', paddingLeft: 5,
                }}>
                    <MyButton onPress={filterData} title="Filter" warna={colors.primary} />
                </View>
            </View>
            <View style={{
                flex: 1,
            }}>

                <FlatList data={data} renderItem={__renderItem} />
            </View>





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
                        height: windowHeight / 3,
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
                            <MyPicker label="Cari Berdasarkan Field" value={filter.key} iconname='ribbon' onValueChange={x => setFilter({ ...filter, key: x })} data={[
                                { value: 'nama_produk', label: 'Nama Produk' },
                                { value: 'merek', label: 'Merek' },
                                { value: 'motor_lainnya', label: 'Motor Lainnya' },


                            ]} />
                            <MyGap jarak={10} />
                        </View>
                        <View style={{
                            padding: 10,
                        }}>
                            <MyButton onPress={filterData} warna={colors.secondary} title="Filter Pencarian" Icons="filter" />
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView >
    )
}

const styles = StyleSheet.create({})