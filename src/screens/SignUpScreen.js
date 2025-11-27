import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import CurvedBackground from '../components/CurvedBackground';
import CustomInput from '../components/CustomInput';
import PrimaryButton from '../components/PrimaryButton';
import { colors } from '../theme/colors';
import api from '../services/api';
import DateTimePicker from '@react-native-community/datetimepicker';

const SignUpScreen = ({ navigation }) => {
    const [name, setName] = useState('');
    const [cpf, setCpf] = useState('');
    const [birthDate, setBirthDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [birthDateFormatted, setBirthDateFormatted] = useState(''); // DD-MM-YYYY for display
    const [birthDateApi, setBirthDateApi] = useState(''); // YYYY-MM-DD for API
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSignUp = async () => {
        if (!name || !cpf || !email || !password || !birthDateApi) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        const emailRegex = /\S+@\S+\.\S+/;
        if (!emailRegex.test(email)) {
            Alert.alert('Error', 'Please enter a valid email address');
            return;
        }

        // Regex checks for:
        // (?=.*[a-z]) : At least one lowercase letter
        // (?=.*[A-Z]) : At least one uppercase letter
        // (?=.*\d)    : At least one number
        // (?=.*[\W_]) : At least one special character (non-word character or underscore)
        // .{8,}       : At least 8 characters long
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
        if (!passwordRegex.test(password)) {
            Alert.alert('Error', 'Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character');
            return;
        }

        setLoading(true);
        try {
            const cpfRaw = cpf.replace(/\D/g, '');
            await api.createUser({ name, cpf: cpfRaw, email, password, birth_date: birthDateApi });
            Alert.alert('Success', 'Account created successfully', [
                { text: 'OK', onPress: () => navigation.navigate('Login') }
            ]);
        } catch (error) {
            Alert.alert('Error', error.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    const onChangeDate = (event, selectedDate) => {
        const currentDate = selectedDate || birthDate;
        setShowDatePicker(Platform.OS === 'ios');
        setBirthDate(currentDate);

        // Format for Display: DD-MM-YYYY
        const day = String(currentDate.getDate()).padStart(2, '0');
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const year = currentDate.getFullYear();
        setBirthDateFormatted(`${day}-${month}-${year}`);

        // Format for API: YYYY-MM-DD
        setBirthDateApi(`${year}-${month}-${day}`);
    };

    const handleCpfChange = (text) => {
        let raw = text.replace(/\D/g, '');
        if (raw.length > 11) raw = raw.slice(0, 11);

        let formatted = raw;
        if (raw.length > 3) formatted = raw.slice(0, 3) + '.' + raw.slice(3);
        if (raw.length > 6) formatted = formatted.slice(0, 7) + '.' + raw.slice(6);
        if (raw.length > 9) formatted = formatted.slice(0, 11) + '-' + raw.slice(9);

        setCpf(formatted);
    };

    return (
        <CurvedBackground>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardAvoidingView}
            >
                <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                    <View style={styles.container}>
                        <View style={styles.header}>
                            <Text style={styles.title}>Create Account</Text>
                        </View>

                        <View style={styles.form}>
                            <CustomInput
                                iconName="user"
                                placeholder="Name"
                                value={name}
                                onChangeText={setName}
                            />
                            <CustomInput
                                iconName="credit-card" // Using credit-card as proxy for ID card if id-card not available in Feather
                                placeholder="CPF"
                                value={cpf}
                                onChangeText={handleCpfChange}
                                keyboardType="numeric"
                                maxLength={14}
                            />
                            <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                                <View pointerEvents="none">
                                    <CustomInput
                                        iconName="calendar"
                                        placeholder="DD-MM-YYYY"
                                        value={birthDateFormatted}
                                        editable={false}
                                    />
                                </View>
                            </TouchableOpacity>
                            {showDatePicker && (
                                <DateTimePicker
                                    testID="dateTimePicker"
                                    value={birthDate}
                                    mode="date"
                                    display="default"
                                    onChange={onChangeDate}
                                    maximumDate={new Date()}
                                />
                            )}
                            <CustomInput
                                iconName="at-sign"
                                placeholder="Email"
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                            />
                            <CustomInput
                                iconName="lock"
                                placeholder="Password"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                            />

                            <PrimaryButton
                                title="Sign up"
                                onPress={handleSignUp}
                                loading={loading}
                                style={styles.button}
                            />

                            <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.loginLink}>
                                <Text style={styles.linkText}>Already have an account? Login</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </CurvedBackground>
    );
};

const styles = StyleSheet.create({
    keyboardAvoidingView: {
        flex: 1,
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
    },
    container: {
        flex: 1,
        paddingHorizontal: 30,
        justifyContent: 'center',
    },
    header: {
        alignItems: 'center',
        marginBottom: 30,
        marginTop: 50,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: colors.text,
    },
    form: {
        width: '100%',
    },
    button: {
        marginTop: 20,
        marginBottom: 20,
    },
    loginLink: {
        alignItems: 'center',
    },
    linkText: {
        color: colors.primary,
        fontSize: 16,
    },
});

export default SignUpScreen;
