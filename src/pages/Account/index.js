import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    Image,
    Linking,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { windowWidth, fonts } from '../../utils/fonts';
import { getData, MYAPP, storeData, urlAPI, urlApp, urlAvatar } from '../../utils/localStorage';
import { colors } from '../../utils/colors';
import { MyButton, MyGap } from '../../components';
import { Icon } from 'react-native-elements';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useIsFocused } from '@react-navigation/native';
import axios from 'axios';
import LinearGradient from 'react-native-linear-gradient';
import moment from 'moment';

export default function ({ navigation, route }) {
    const [user, setUser] = useState({});
    const [com, setCom] = useState({});
    const isFocused = useIsFocused();
    const [wa, setWA] = useState('');
    const [open, setOpen] = useState(false);



    useEffect(() => {


        if (isFocused) {
            getData('user').then(res => {

                setOpen(true);
                setUser(res);

            });
        }




    }, [isFocused]);

    const btnKeluar = () => {
        Alert.alert(MYAPP, 'Apakah kamu yakin akan keluar ?', [
            {
                text: 'Batal',
                style: "cancel"
            },
            {
                text: 'Keluar',
                onPress: () => {
                    storeData('user', null);

                    navigation.replace('Login');
                }
            }
        ])
    };

    const MyList = ({ label, value }) => {
        return (
            <View
                style={{
                    marginVertical: 3,
                    padding: 5,
                    backgroundColor: colors.white,
                    borderRadius: 5,
                }}>
                <Text
                    style={{
                        fontFamily: fonts.primary[400],
                        color: '#8E99A2',
                    }}>
                    {label}
                </Text>
                <Text
                    style={{
                        fontFamily: fonts.primary[400],
                        color: colors.black,
                    }}>
                    {value}
                </Text>
            </View>
        )
    }
    return (
        <SafeAreaView style={{
            flex: 1,
            backgroundColor: '#F4F6FF'
        }}>

            {!open && <View style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>}


            {open &&
                <>
                    <View style={{
                        flexDirection: 'row',
                        backgroundColor: colors.white,
                        padding: 5,
                        height: 80,
                        borderBottomLeftRadius: 10,
                        borderBottomRightRadius: 10,
                        alignItems: 'center'
                    }}>
                        <TouchableOpacity onPress={() => navigation.goBack()} style={{
                            padding: 5,
                        }}>
                            <Icon type='ionicon' name='arrow-back-outline' size={windowWidth / 13} color={colors.black} />
                        </TouchableOpacity>
                        <Text style={{
                            flex: 1,
                            textAlign: 'center',
                            fontFamily: fonts.primary[400],
                            fontSize: windowWidth / 18,
                            color: colors.black
                        }}>Profile Saya</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('AccountEdit', user)} style={{
                            padding: 5,
                            borderRadius: 5,
                        }}>
                            <Text style={{
                                textAlign: 'center',
                                fontFamily: fonts.primary[400],
                                fontSize: windowWidth / 18,
                                color: colors.foourty
                            }}>Ubah</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={{
                        backgroundColor: colors.white,
                        margin: 10,
                    }}>
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}>
                            <View>
                                <Image source={{
                                    uri: user.foto_user
                                }} style={{
                                    width: 80,
                                    height: 80,
                                    borderRadius: 40,
                                }} />
                            </View>
                            <View style={{
                                paddingLeft: 10,
                            }}>
                                <Text style={{
                                    fontFamily: fonts.primary[600],
                                    fontSize: windowWidth / 22,
                                    color: colors.black
                                }}>Halo,</Text>
                                <Text style={{
                                    fontFamily: fonts.primary[400],
                                    fontSize: windowWidth / 22,
                                    color: colors.black
                                }}>{user.nama_lengkap}</Text>
                                <Text style={{
                                    fontFamily: fonts.primary[600],
                                    fontSize: windowWidth / 28,
                                    color: colors.primary
                                }}>{user.level}</Text>
                            </View>
                        </View>
                        <View style={{ padding: 10, }}>
                            <MyList label="Username" value={user.username} />
                            <MyList label="Nomor Handphone" value={user.telepon} />

                            <MyList label="Alamt Email" value={user.email} />


                        </View>
                        {/* data detail */}
                    </View>
                </>
            }
        </SafeAreaView >
    );
}

const styles = StyleSheet.create({});
