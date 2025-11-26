import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { colors } from '../theme/colors';

const CustomInput = ({
    iconName,
    placeholder,
    value,
    onChangeText,
    secureTextEntry,
    isValid,
    ...props
}) => {
    const [isPasswordVisible, setIsPasswordVisible] = React.useState(false);

    return (
        <View style={styles.container}>
            {iconName && (
                <Icon name={iconName} size={20} color={colors.text} style={styles.iconLeft} />
            )}
            <TextInput
                style={styles.input}
                placeholder={placeholder}
                placeholderTextColor={colors.placeholder}
                value={value}
                onChangeText={onChangeText}
                secureTextEntry={secureTextEntry && !isPasswordVisible}
                autoCapitalize="none"
                {...props}
            />
            {isValid && (
                <Icon name="check" size={20} color={colors.text} style={styles.iconRight} />
            )}
            {secureTextEntry && (
                <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
                    <Icon name={isPasswordVisible ? "eye" : "eye-off"} size={20} color={colors.placeholder} style={styles.iconRight} />
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: colors.inputUnderline,
        marginBottom: 20,
        paddingVertical: 10,
    },
    input: {
        flex: 1,
        color: colors.text,
        fontSize: 16,
        marginLeft: 10,
        paddingVertical: 0, // Remove default padding
    },
    iconLeft: {
        marginRight: 5,
    },
    iconRight: {
        marginLeft: 10,
    },
});

export default CustomInput;
