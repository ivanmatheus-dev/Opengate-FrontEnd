import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { colors } from '../theme/colors';

const { width, height } = Dimensions.get('window');

const CurvedBackground = ({ children }) => {
    return (
        <View style={styles.container}>
            <View style={styles.backgroundContainer}>
                {/* Top Curve */}
                <Svg
                    height={height * 0.4}
                    width={width}
                    viewBox={`0 0 ${width} ${height * 0.4}`}
                    style={styles.topCurve}
                >
                    <Path
                        d={`M0 0 L${width} 0 L${width} ${height * 0.25} Q${width * 0.5} ${height * 0.4} 0 ${height * 0.25} Z`}
                        fill={colors.secondary}
                    />
                </Svg>

                {/* Bottom Curve - Inverted logic or just a simple shape */}
                <Svg
                    height={height * 0.3}
                    width={width}
                    viewBox={`0 0 ${width} ${height * 0.3}`}
                    style={styles.bottomCurve}
                >
                    <Path
                        d={`M0 ${height * 0.15} Q${width * 0.5} 0 ${width} ${height * 0.15} L${width} ${height * 0.3} L0 ${height * 0.3} Z`}
                        fill={colors.secondary}
                    />
                </Svg>
            </View>
            <View style={styles.content}>
                {children}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    backgroundContainer: {
        ...StyleSheet.absoluteFillObject,
        zIndex: -1,
    },
    topCurve: {
        position: 'absolute',
        top: 0,
    },
    bottomCurve: {
        position: 'absolute',
        bottom: 0,
    },
    content: {
        flex: 1,
        zIndex: 1,
    },
});

export default CurvedBackground;
