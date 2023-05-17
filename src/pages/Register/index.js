import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    Text,
    Button,
    View,
    Image,
    ScrollView,
    ImageBackground,
    Dimensions,
    Switch,
    SafeAreaView,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { colors } from '../../utils/colors';
import { fonts } from '../../utils/fonts';
import { MyInput, MyGap, MyButton, MyPicker } from '../../components';
import axios from 'axios';
import { showMessage } from 'react-native-flash-message';
import { apiURL, api_token, MYAPP } from '../../utils/localStorage';
import DatePicker from 'react-native-datepicker'
import moment from 'moment';
import { Icon } from 'react-native-elements';

export default function Register({ navigation }) {
    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;
    const [loading, setLoading] = useState(false);
    const [valid, setValid] = useState(false);
    const [isEnabled, setIsEnabled] = useState(false);
    const [cek, setCek] = useState(false);
    const toggleSwitch = () => setIsEnabled(previousState => !previousState);

    const validate = text => {
        // console.log(text);
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (reg.test(text) === false) {
            // console.log('nama_lengkap is Not Correct');
            setData({ ...data, nama_lengkap: text });
            setValid(false);
            return false;
        } else {
            setData({ ...data, nama_lengkap: text });
            setValid(true);
            // console.log('nama_lengkap is Correct');
        }
    };

    const [sama, setSama] = useState(true)

    const [data, setData] = useState({
        api_token: api_token,
        username: '',
        lahir: '',
        password: '',
        repassword: '',
        telepon: '',
        nama_lengkap: '',
        desa: '',
        tanggal_lahir: '',
        lavel: 'Kader',
        alamat: '',
        gender: 'Laki-laki',
    });

    const simpan = () => {
        if (
            data.nama_lengkap.length === 0 &&
            data.tanggal_lahir.length === 0 &&
            data.username.length === 0 &&
            data.telepon.length === 0 &&
            data.password.length === 0

        ) {
            showMessage({
                message: 'Formulir pendaftaran tidak boleh kosong !',
            });
        } else if (data.nama_lengkap.length === 0) {
            showMessage({
                message: 'Masukan nama kamu',
            });
        }
        else if (!cek) {
            showMessage({
                message: 'Silahkan centang syarat dan ketentuan',
            });
        }
        else if (data.telepon.length === 0) {
            showMessage({
                message: 'Masukan nomor telepon',
            });
        } else if (data.username.length === 0) {
            showMessage({
                message: 'Masukan username',
            });
        } else if (data.lahir.length === 0) {
            showMessage({
                message: 'Masukan tempat lahir',
            });
        } else if (data.password.length === 0) {
            showMessage({
                message: 'Masukan kata sandi kamu',
            });
        } else {

            console.log(data);

            setLoading(true);
            axios
                .post(apiURL + 'register', data)
                .then(res => {
                    console.warn(res.data);
                    setLoading(false);
                    if (res.data.status == 404) {
                        showMessage({
                            type: 'danger',
                            message: res.data.message
                        })
                    } else {
                        Alert.alert(MYAPP, res.data.message);
                        navigation.goBack();
                    }


                });
        }
    };

    const [desa, setDesa] = useState([]);

    useEffect(() => {

        axios.post(apiURL + 'desa').then(res => {
            console.log('desa', res.data);
            setDesa(res.data);
            setData({
                ...data,
                desa: res.data[0].value
            })

        })

    }, [])

    return (
        <ImageBackground
            style={{
                flex: 1,
                backgroundColor: colors.white,
                padding: 10,
                position: 'relative'
            }}>

            {/* <Switch onValueChange={toggleSwitch} value={isEnabled} /> */}
            <ScrollView showsVerticalScrollIndicator={false} style={styles.page}>

                <View style={{
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <Text style={{
                        fontSize: windowWidth / 12,
                        fontFamily: fonts.primary[800],
                        color: colors.black,

                    }}>Daftar Pengguna</Text>
                </View>

                <MyPicker onValueChange={x => setData({
                    ...data,
                    level: x
                })} label="Jenis Pengguna" iconname="ribbon" data={[
                    { label: 'Kader', value: 'Kader' },
                    { label: 'Programmer', value: 'Programmer' },
                ]} />

                <MyGap jarak={10} />
                <MyPicker onValueChange={x => setData({
                    ...data,
                    desa: x
                })} label="Desa" iconname="navigate" data={desa} />
                <MyGap jarak={10} />
                <MyInput
                    placeholder="Masukan username"
                    label="Username"
                    iconname="at"
                    value={data.username}
                    onChangeText={value =>
                        setData({
                            ...data,
                            username: value,
                        })
                    }
                />
                <MyGap jarak={10} />
                <MyInput
                    placeholder="Masukan nama lengkap"
                    label="Nama Lengkap"
                    iconname="person"
                    value={data.nama_lengkap}
                    onChangeText={value =>
                        setData({
                            ...data,
                            nama_lengkap: value,
                        })
                    }
                />


                <MyGap jarak={10} />
                <MyInput
                    placeholder="Masukan telepon"
                    label="Telepon"
                    iconname="call"
                    keyboardType="phone-pad"
                    value={data.telepon}
                    onChangeText={value =>
                        setData({
                            ...data,
                            telepon: value,
                        })
                    }
                />

                <MyGap jarak={10} />
                <MyInput
                    placeholder="Masukan alamat"
                    label="Alamat"
                    iconname="location"
                    value={data.alamat}
                    onChangeText={value =>
                        setData({
                            ...data,
                            alamat: value,
                        })
                    }
                />






                <MyGap jarak={10} />
                <MyInput
                    placeholder="Masukan buat sandi"
                    label="Buat Sandi"
                    iconname="lock-closed"
                    secureTextEntry
                    value={data.password}
                    onChangeText={value =>
                        setData({
                            ...data,
                            password: value,
                        })
                    }
                />
                <MyGap jarak={10} />
                <MyInput
                    borderColor={sama ? colors.border : colors.danger}
                    borderWidth={sama ? 0 : 1}
                    placeholder="Masukan ulang kata sandi"
                    label="Tulis Ulang Kata Sandi"
                    iconname="lock-closed"
                    secureTextEntry
                    value={data.repassword}
                    onChangeText={value => {

                        if (value !== data.password) {
                            setSama(false)
                        } else {
                            setSama(true)
                        }

                        setData({
                            ...data,
                            repassword: value,
                        })
                    }

                    }
                />
                <MyGap jarak={10} />
                <MyPicker onValueChange={x => setData({
                    ...data,
                    gender: x
                })} label="Jenis Kelamin" iconname="male-female" data={[
                    { label: 'Laki-laki', value: 'Laki-laki' },
                    { label: 'Perempuan', value: 'Perempuan' },
                ]} />
                <MyGap jarak={10} />
                <View style={{
                    flexDirection: 'row'
                }}>
                    <View style={{
                        flex: 1,
                        paddingRight: 5,
                    }}>
                        <MyInput
                            placeholder="Tempat lahir"
                            label="Tempat lahir"
                            iconname="home"
                            value={data.lahir}
                            onChangeText={value =>
                                setData({
                                    ...data,
                                    lahir: value,
                                })
                            }
                        />
                    </View>
                    <View style={{
                        flex: 1,
                        paddingLeft: 5,
                    }}>
                        <View
                            style={{

                                flexDirection: 'row',
                                alignItems: 'center',
                                paddingVertical: 5,
                            }}>
                            <Icon type="ionicon" name='calendar' color={colors.black} size={16} />
                            <Text
                                style={{
                                    fontFamily: fonts.secondary[600],
                                    color: colors.black,
                                    left: 10,
                                    fontSize: 12,
                                }}>
                                Tanggal Lahir
                            </Text>
                        </View>
                        <DatePicker
                            style={{ width: '100%' }}
                            date={data.tanggal_lahir}
                            mode="date"
                            placeholder="Pilih tanggal lahir"
                            format="YYYY-MM-DD"
                            confirmBtnText="Confirm"
                            cancelBtnText="Cancel"
                            customStyles={{
                                dateIcon: {
                                    position: 'absolute',
                                    right: 0,
                                    top: 4,
                                    marginLeft: 0
                                },
                                dateInput: {
                                    marginLeft: 0,
                                    backgroundColor: colors.zavalabs,
                                    backgroundColor: colors.zavalabs,
                                    borderRadius: 10,
                                    marginTop: 5,
                                    fontFamily: fonts.secondary[600],
                                    borderColor: colors.primary,
                                    borderWidth: 0,
                                }
                                // ... You can check the source to find the other keys.
                            }}
                            onDateChange={(date) => {
                                setData({
                                    ...data,
                                    tanggal_lahir: date
                                })
                            }}
                        />
                    </View>
                </View>

                <TouchableOpacity onPress={() => {
                    cek ? setCek(false) : setCek(true);
                }} style={{
                    flexDirection: 'row',
                    padding: 5,
                    marginTop: 10,
                    alignItems: 'center'
                }}>
                    <View style={{
                        marginRight: 5,
                        borderWidth: 1,
                        backgroundColor: colors.white,
                        borderRadius: 5,
                    }}>
                        <Icon type='ionicon' name='checkmark' color={cek ? colors.black : colors.white} size={windowWidth / 30} />
                    </View>
                    <Text style={{
                        marginTop: 5,
                        fontFamily: fonts.primary[400],
                        fontSize: windowWidth / 30
                    }}>Saya setuju dengan syarat dan ketentuan yang berlaku</Text>
                </TouchableOpacity>

                {!loading &&
                    <MyButton

                        warna={colors.primary}
                        title="Buat Akun"
                        Icons="log-in"
                        onPress={simpan}
                    />
                }
                <TouchableOpacity onPress={() => navigation.navigate('Login')} style={{
                    padding: 10,
                    justifyContent: 'center',
                    alignItems: 'center'
                }}><Text style={{
                    fontSize: windowWidth / 28,
                    fontFamily: fonts.primary[400],
                    textAlign: 'center',
                    color: colors.tertiary
                }}>Sudah punya akun ? <Text style={{
                    fontSize: windowWidth / 28,
                    fontFamily: fonts.primary[600],
                    textAlign: 'center',
                    color: colors.tertiary
                }}>Masuk sekarang</Text></Text></TouchableOpacity>
                <MyGap jarak={10} />
                {loading && <View style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <ActivityIndicator color={colors.primary} size="large" />
                </View>}
            </ScrollView>

        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    page: {
        flex: 1,
        padding: 10,
    },
    image: {
        width: 620 / 4,
        height: 160 / 4,
    },
});
