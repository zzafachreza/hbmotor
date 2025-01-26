import { Alert, StyleSheet, Text, View, Image, FlatList, Modal, ActivityIndicator, Dimensions, Animated } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { apiURL, getData, MYAPP, storeData } from '../../utils/localStorage';
import { colors, fonts, windowHeight, windowWidth } from '../../utils';
import { ScrollView, TextInput, TouchableOpacity, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { showMessage } from 'react-native-flash-message';
import Sound from 'react-native-sound';
import { Icon } from 'react-native-elements/dist/icons/Icon';
import { MyButton, MyGap, MyInput, MyPicker } from '../../components';
import { useIsFocused } from '@react-navigation/native';
import axios from 'axios';
import { FloatingAction } from "react-native-floating-action";
import 'intl';
import 'intl/locale-data/jsonp/en';

export default function Sales({ navigation }) {
    const [modalVisible, setModalVisible] = useState(false);
    const isFocused = useIsFocused();



    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    const [key, setKey] = useState('');


    useEffect(() => {
        if (isFocused) {
            getTransaction()
        }
    }, [isFocused]);



    const [search, setSearch] = useState('');

    const filteredData = data.filter(item => {
        const values = Object.values(item);
        return values.some(value => value.toLowerCase().includes(search.toLowerCase()));
    });


    const getTransaction = () => {
        // setLoading(true);
        axios.post(apiURL + 'supplier').then(res => {
            setLoading(false);
            console.log(res.data);
            setData(res.data)

        })
    }

    const __HapusData = (x) => {
        console.log(x);
        axios.post(apiURL + 'supplier_delete', {
            id_supplier: x
        }).then(res => {
            if (res.data.status == 200) {
                getTransaction();
                showMessage({
                    type: 'success',
                    message: res.data.message
                });

            }
        })
    }



    const ITEM_HEIGHT = 50;

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
                    backgroundColor: colors.white,
                    borderRadius: 10,
                    overflow: 'hidden',
                    alignItems: 'center',
                    marginBottom: 10,
                }}>
                    <View style={{
                        borderBottomLeftRadius: 10,
                        borderTopLeftRadius: 10,
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: 10,

                    }}>
                        <Icon type='ionicon' color={colors.border} size={20} name='search' />
                    </View>
                    <View style={{
                        flex: 1,
                        position: 'relative',
                        borderBottomRightRadius: 10,
                        borderTopRightRadius: 10,
                    }}>


                        <TextInput
                            onChangeText={text => setSearch(text)}
                            value={search}

                            placeholder='Cari Supplier / Sales . . .' style={{
                                fontFamily: fonts.secondary[400],
                                fontSize: 18,
                            }}


                        />


                    </View>
                    <View style={{

                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: 10,
                        width: 50,

                    }}>
                        {search.length > 0 &&
                            <TouchableOpacity onPress={() => setSearch('')}>
                                <Icon type='ionicon' color={colors.border} size={20} name='close' />
                            </TouchableOpacity>
                        }
                    </View>

                </View>

                {data.length > 0 && !loading &&

                    <FlatList
                        getItemLayout={(data, index) => (
                            { length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index }
                        )}
                        keyExtractor={(item, index) => index.toString()}
                        initialNumToRender={10}
                        maxToRenderPerBatch={5}
                        windowSize={5} data={filteredData} renderItem={({ item, index }) => {
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
                                        <Text style={{

                                            fontFamily: fonts.secondary[600],
                                            fontSize: 14,
                                            color: colors.black
                                        }}>{item.nama_supplier}</Text>
                                        <Text style={{

                                            fontFamily: fonts.secondary[400],
                                            fontSize: 14,
                                            color: colors.black
                                        }}>{item.telepon}</Text>
                                    </View>
                                    <TouchableOpacity onPress={() => navigation.navigate('SalesEdit', item)} style={{
                                        flex: 1,
                                        backgroundColor: colors.primary,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        width: 50,
                                    }}>
                                        <Icon color={colors.white} type='ionicon' name='create-outline' />
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => Alert.alert(MYAPP, 'Apakah kamu yakin akan hapus ini ?', [
                                        { text: 'TIDAK' },
                                        {
                                            text: 'HAPUS',
                                            onPress: () => {
                                                __HapusData(item.id_supplier);
                                            }
                                        }
                                    ])} style={{
                                        flex: 1,
                                        backgroundColor: colors.secondary,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        width: 50,
                                    }}>
                                        <Icon color={colors.white} type='ionicon' name='trash' />
                                    </TouchableOpacity>

                                </View >
                            )
                        }}
                    />
                }

                {loading && <View style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center'
                }}><ActivityIndicator size="large" color={colors.primary} /></View>}
            </View>



            <View style={{
                // position: 'absolute',
                // bottom: 20,
                // right: 20,
                alignSelf: 'flex-end',
                padding: 10,

            }}>
                <TouchableOpacity onPress={() => navigation.navigate('SalesAdd')} style={{
                    width: 60,
                    height: 60,
                    elevation: 4,
                    backgroundColor: colors.primary,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 30,
                }}>
                    <Icon color={colors.white} type='ionicon' name='add' size={30} />
                </TouchableOpacity>
            </View>

        </SafeAreaView >
    )
}

const styles = StyleSheet.create({})