import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { colors } from '../theme/colors';

const PrimaryButton = ({ title, onPress, loading, style }) => {
    return (
        <TouchableOpacity
            style={[styles.button, style]}
            onPress={onPress}
            disabled={loading}
            activeOpacity={0.8}
        >
            {loading ? (
                <ActivityIndicator color={colors.text} />
            ) : (
                <Text style={styles.text}>{title}</Text>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        backgroundColor: colors.primary,
        borderRadius: 25, // Rounded
        paddingVertical: 15,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        elevation: 3, // Shadow for Android
    },
    text: {
        color: colors.text,
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default PrimaryButton;
