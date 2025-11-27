import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import CurvedBackground from '../components/CurvedBackground';
import CustomInput from '../components/CustomInput';
import PrimaryButton from '../components/PrimaryButton';
import { colors } from '../theme/colors';
import Icon from 'react-native-vector-icons/Feather';
import api from '../services/api';

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        const emailRegex = /\S+@\S+\.\S+/;
        if (!emailRegex.test(email)) {
            Alert.alert('Error', 'Please enter a valid email address');
            return;
        }

        setLoading(true);
        try {
            const response = await api.login(email, password);
            // Navigate to Home on success
            navigation.replace('Home');
        } catch (error) {
            Alert.alert('Login Failed', error.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <CurvedBackground>
            <View style={styles.container}>
                <View style={styles.header}>
                    <View style={styles.logoContainer}>
                        <Icon name="bluetooth" size={40} color={colors.text} />
                        <Icon name="key" size={40} color={colors.text} style={styles.keyIcon} />
                    </View>
                    <Text style={styles.title}>Open gate</Text>
                </View>

                <View style={styles.form}>
                    <CustomInput
                        iconName="at-sign"
                        placeholder="user.name@example.com"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        isValid={email.includes('@')}
                    />
                    <CustomInput
                        iconName="lock"
                        placeholder="Password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />

                    <TouchableOpacity style={styles.forgotPassword}>
                        <Text style={styles.linkText}>Forgot Password?</Text>
                    </TouchableOpacity>

                    <PrimaryButton
                        title="Login"
                        onPress={handleLogin}
                        loading={loading}
                        style={styles.loginButton}
                    />

                    <View style={styles.footer}>
                        <View style={styles.dividerContainer}>
                            <View style={styles.divider} />
                            <Text style={styles.orText}>or</Text>
                            <View style={styles.divider} />
                        </View>

                        <PrimaryButton
                            title="Sign up"
                            onPress={() => navigation.navigate('SignUp')}
                            style={styles.signUpButton}
                        />
                    </View>
                </View>
            </View>
        </CurvedBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 30,
        justifyContent: 'center',
    },
    header: {
        alignItems: 'center',
        marginBottom: 50,
        marginTop: 50,
    },
    logoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.primary,
        padding: 15,
        borderRadius: 20,
        marginBottom: 15,
    },
    keyIcon: {
        marginLeft: -10,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: colors.text,
    },
    form: {
        width: '100%',
    },
    forgotPassword: {
        alignSelf: 'flex-end',
        marginBottom: 20,
    },
    linkText: {
        color: colors.primary, // Or a lighter blue/purple
        fontSize: 14,
    },
    loginButton: {
        marginBottom: 30,
    },
    footer: {
        alignItems: 'center',
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        marginBottom: 20,
    },
    divider: {
        flex: 1,
        height: 1,
        backgroundColor: colors.placeholder,
    },
    orText: {
        color: colors.text,
        marginHorizontal: 10,
        fontSize: 16,
    },
    signUpButton: {
        backgroundColor: colors.primary, // Same as login for now, or maybe outlined?
        // Mockup shows filled button for Sign up too
    },
});

export default LoginScreen;
