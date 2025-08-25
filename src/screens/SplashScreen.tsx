import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
    View,
    Text,
    StatusBar,
    Animated,
    Image,
    Easing,
    Dimensions,
    LayoutChangeEvent,
} from 'react-native';
import { useAuthStore } from '../stores/authStore';
import { IMAGES, TYPOGRAPHY } from '../constants';

interface SplashScreenProps {
    navigation: any;
}

const { width: SW, height: SH } = Dimensions.get('window');

/** ===== TUNABLES ===== */
const LOGO_SIZE = 96;
const TEXT_GAP = 14;
const HOLD_AFTER = 800;
/** ==================== */

const SplashScreen: React.FC<SplashScreenProps> = ({ navigation }) => {
    const { isAuthenticated } = useAuthStore();

    const logoOpacity = useRef(new Animated.Value(0)).current;
    const logoScale = useRef(new Animated.Value(0.2)).current;
    const logoTranslateX = useRef(new Animated.Value(0)).current;

    const textOpacity = useRef(new Animated.Value(0)).current;
    const textSlideX = useRef(new Animated.Value(26)).current;

    const centerX = SW / 2;
    const centerY = SH / 2;

    const [textSize, setTextSize] = useState<{ w: number; h: number }>({ w: 0, h: 0 });
    const [ready, setReady] = useState(false);

    const finalShiftX = useMemo(() => {
        if (!textSize.w) return 0;
        const groupW = LOGO_SIZE + TEXT_GAP + textSize.w;
        return Math.round((groupW - LOGO_SIZE) / 2);
    }, [textSize.w]);

    const onTextLayout = (e: LayoutChangeEvent) => {
        const { width, height } = e.nativeEvent.layout;
        if ((width !== textSize.w || height !== textSize.h) && !ready) {
            setTextSize({ w: width, h: height });
            setReady(true);
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            navigation.replace('MainApp');
            return;
        }
        if (!ready) return;

        Animated.sequence([
            // 1) Fade in + scale up (big size)
            Animated.parallel([
                Animated.timing(logoOpacity, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                    easing: Easing.out(Easing.cubic),
                }),
                Animated.timing(logoScale, {
                    toValue: 1.4,
                    duration: 300,
                    useNativeDriver: true,
                    easing: Easing.out(Easing.cubic),
                }),
            ]),

            // 2) Scale back down to normal
            Animated.timing(logoScale, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
                easing: Easing.out(Easing.cubic),
            }),

            // 3) Move logo left, reveal text
            Animated.parallel([
                Animated.timing(logoTranslateX, {
                    toValue: -finalShiftX,
                    duration: 500,
                    useNativeDriver: true,
                    easing: Easing.out(Easing.cubic),
                }),
                Animated.sequence([
                    Animated.delay(200),
                    Animated.parallel([
                        Animated.timing(textOpacity, {
                            toValue: 1,
                            duration: 400,
                            useNativeDriver: true,
                            easing: Easing.out(Easing.cubic),
                        }),
                        Animated.timing(textSlideX, {
                            toValue: 0,
                            duration: 400,
                            useNativeDriver: true,
                            easing: Easing.out(Easing.cubic),
                        }),
                    ]),
                ]),
            ]),
        ]).start(() => setTimeout(() => navigation.replace('Login'), HOLD_AFTER));
    }, [isAuthenticated, navigation, ready]);

    return (
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

            <View style={{ flex: 1, position: 'relative' }}>
                {/* LOGO */}
                <Animated.View
                    style={{
                        position: 'absolute',
                        left: centerX - LOGO_SIZE / 2,
                        top: centerY - LOGO_SIZE / 2,
                        opacity: logoOpacity,
                        transform: [
                            { translateX: logoTranslateX },
                            { scale: logoScale },
                        ],
                    }}
                >
                    <Image
                        source={IMAGES.logoGreen}
                        style={{ width: LOGO_SIZE, height: LOGO_SIZE }}
                        resizeMode="contain"
                    />
                </Animated.View>

                {/* TEXT */}
                <Animated.View
                    onLayout={onTextLayout}
                    style={{
                        position: 'absolute',
                        left: (centerX - finalShiftX) - LOGO_SIZE / 2 + LOGO_SIZE + TEXT_GAP,
                        top: centerY - 20,
                        opacity: textOpacity,
                        transform: [{ translateX: textSlideX }],
                    }}
                >
                    <Text
                        style={[
                            TYPOGRAPHY.titleBold,
                            { fontSize: 23, lineHeight: 26, color: '#000' },
                        ]}
                    >
                        London Waste
                    </Text>
                    <Text
                        style={[
                            TYPOGRAPHY.titleBold,
                            { fontSize: 23, lineHeight: 26, color: '#000', marginTop: -2 },
                        ]}
                    >
                        Management
                    </Text>
                </Animated.View>
            </View>
        </View>
    );
};

export default SplashScreen;
