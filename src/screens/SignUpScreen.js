import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import CurvedBackground from '../components/CurvedBackground';
import CustomInput from '../components/CustomInput';
import PrimaryButton from '../components/PrimaryButton';
import { colors } from '../theme/colors';
import api from '../services/api';

const SignUpScreen = ({ navigation }) => {
    const [name, setName] = useState('');
    const [cpf, setCpf] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSignUp = async () => {
        if (!name || !cpf || !email || !password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        setLoading(true);
        try {
            await api.register(name, cpf, email, password);
            Alert.alert('Success', 'Account created successfully', [
                { text: 'OK', onPress: () => navigation.navigate('Login') }
            ]);
        } catch (error) {
            Alert.alert('Error', error.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <CurvedBackground>
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
                        onChangeText={setCpf}
                        keyboardType="numeric"
                    />
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
