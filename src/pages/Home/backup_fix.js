import { Alert, StyleSheet, Text, View, Image, FlatList, ActivityIndicator, Dimensions, ImageBackground } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { apiURL, getData, MYAPP, storeData } from '../../utils/localStorage';
import { colors, fonts, windowHeight, windowWidth } from '../../utils';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { showMessage } from 'react-native-flash-message';
import Sound from 'react-native-sound';
import { Icon } from 'react-native-elements/dist/icons/Icon';
import { MyButton, MyGap, MyHeader, MyInput } from '../../components';
import { useIsFocused } from '@react-navigation/native';
import axios from 'axios';
import { FloatingAction } from "react-native-floating-action";
import 'intl';
import 'intl/locale-data/jsonp/en';
import LinearGradient from 'react-native-linear-gradient';
import moment from 'moment';
import { color } from 'react-native-elements/dist/helpers';



export default function Home({ navigation }) {


    const [data, setData] = useState([]);
    const [user, setUser] = useState({});
    const isFocused = useIsFocused();
    useEffect(() => {


        if (isFocused) {
            __getTransaction();
        }

    }, [isFocused]);

    const __getTransaction = () => {
        getData('user').then(res => {
            setUser(res);
        });


    }




    return (






        <ImageBackground
            // source={require('../../assets/home.png')} 
            style={{
                flex: 1,
                padding: 20,
                backgroundColor: colors.white
            }}>
            <MyHeader menu={`Halo, ${user.nama_lengkap} !`} />
            {/* info user */}

            {/* menu utama */}
            <View style={{
                marginTop: 5,
                flex: 1,
            }}>

                <View style={{
                    flexDirection: 'row'
                }}>
                    <View style={{
                        flex: 1,
                        margin: 5,
                    }}>
                        <TouchableOpacity style={{

                            justifyContent: 'center',
                            alignItems: 'center',
                            padding: 10,
                        }}>
                            <Image source={require('../../assets/A1.png')} style={{
                                width: windowWidth / 4,
                                height: windowWidth / 4,
                                resizeMode: 'contain'
                            }} />
                            <Text style={{
                                height: 40,
                                fontFamily: fonts.secondary[600]
                            }}>Biodata Nelayan</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{
                        flex: 1,
                        margin: 5,
                    }}>
                        <TouchableOpacity style={{

                            justifyContent: 'center',
                            alignItems: 'center',
                            padding: 10,
                        }}>
                            <Image source={require('../../assets/A2.png')} style={{
                                width: windowWidth / 4,
                                height: windowWidth / 4,
                                resizeMode: 'contain'
                            }} />
                            <Text style={{
                                textAlign: 'center',
                                height: 40,
                                fontFamily: fonts.secondary[600]
                            }}>Skirining Riwayat Kesehatan</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={{
                    flexDirection: 'row'
                }}>
                    <View style={{
                        flex: 1,
                        margin: 5,
                    }}>
                        <TouchableOpacity style={{

                            justifyContent: 'center',
                            alignItems: 'center',
                            padding: 10,
                        }}>
                            <Image source={require('../../assets/A3.png')} style={{
                                width: windowWidth / 4,
                                height: windowWidth / 4,
                                resizeMode: 'contain'
                            }} />
                            <Text style={{
                                height: 40,
                                fontFamily: fonts.secondary[600]
                            }}>Data Aktifitas Nelayan</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{
                        flex: 1,
                        margin: 5,
                    }}>
                        <TouchableOpacity style={{

                            justifyContent: 'center',
                            alignItems: 'center',
                            padding: 10,
                        }}>
                            <Image source={require('../../assets/A4.png')} style={{
                                width: windowWidth / 4,
                                height: windowWidth / 4,
                                resizeMode: 'contain'
                            }} />
                            <Text style={{
                                textAlign: 'center',
                                height: 40,
                                fontFamily: fonts.secondary[600]
                            }}>Rekap Laporan</Text>
                        </TouchableOpacity>
                    </View>
                </View>

            </View>
        </ImageBackground>




    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    item: {
        width: windowHeight,
        height: windowWidth / 2,
    },
    imageContainer: {
        flex: 1,
        marginBottom: 1, // Prevent a random Android rendering issue
        backgroundColor: 'white',
        borderRadius: 8,
    },
    image: {
        ...StyleSheet.absoluteFillObject,
        resizeMode: 'cover',
    },
});