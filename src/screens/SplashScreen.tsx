import React, { useEffect, useRef } from 'react';
import { View, Text, StatusBar, Animated, Image } from 'react-native';
import { useAuthStore } from '../stores/authStore';
import { IMAGES, TYPOGRAPHY } from '../constants';

interface SplashScreenProps {
    navigation: any;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ navigation }) => {
    const { isAuthenticated } = useAuthStore();

    // Animations
    const logoScale = useRef(new Animated.Value(0.8)).current;
    const logoOpacity = useRef(new Animated.Value(0)).current;
    const logoPositionX = useRef(new Animated.Value(0)).current;
    const textOpacity = useRef(new Animated.Value(0)).current;
    const textTranslateX = useRef(new Animated.Value(30)).current;

    useEffect(() => {
        // Animation sequence exactement comme dans l'image
        const animationSequence = async () => {
            // Étape 1: Logo apparaît petit au centre
            await new Promise(resolve => {
                Animated.parallel([
                    Animated.timing(logoOpacity, {
                        toValue: 1,
                        duration: 600,
                        useNativeDriver: true,
                    }),
                    Animated.timing(logoScale, {
                        toValue: 0.3,
                        duration: 600,
                        useNativeDriver: true,
                    }),
                ]).start(resolve);
            });

            // Étape 2: Logo s'agrandit significativement
            await new Promise(resolve => {
                Animated.timing(logoScale, {
                    toValue: 1.8,
                    duration: 800,
                    useNativeDriver: true,
                }).start(resolve);
            });

            // Étape 3: Logo revient à une taille plus petite
            await new Promise(resolve => {
                Animated.timing(logoScale, {
                    toValue: 0.6,
                    duration: 600,
                    useNativeDriver: true,
                }).start(resolve);
            });

            // Étape 4: Logo se déplace à gauche et texte apparaît
            await new Promise(resolve => {
                Animated.parallel([
                    Animated.timing(logoPositionX, {
                        toValue: -60, // Déplace le logo vers la gauche (moins d'espace)
                        duration: 700,
                        useNativeDriver: true,
                    }),
                    Animated.timing(textOpacity, {
                        toValue: 1,
                        duration: 700,
                        useNativeDriver: true,
                    }),
                    Animated.timing(textTranslateX, {
                        toValue: 0,
                        duration: 700,
                        useNativeDriver: true,
                    }),
                ]).start(resolve);
            });

            // Attendre un peu puis naviguer
            setTimeout(() => {
                if (isAuthenticated) {
                    navigation.replace('MainApp');
                } else {
                    navigation.replace('Login');
                }
            }, 1000);
        };

        animationSequence();
    }, [navigation, isAuthenticated, logoOpacity, logoPositionX, logoScale, textOpacity, textTranslateX]);

    return (
        <View className="flex-1 bg-white justify-center items-center">
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

            <View className="flex-row items-center justify-center">
                {/* Logo animé */}
                <Animated.View
                    style={{
                        opacity: logoOpacity,
                        transform: [
                            { scale: logoScale },
                            { translateX: logoPositionX }
                        ]
                    }}
                >
                    <Image
                        source={IMAGES.logoGreen}
                        className="w-40 h-40"
                        resizeMode="contain"
                    />
                </Animated.View>

                {/* Texte animé */}
                <Animated.View
                    style={{
                        opacity: textOpacity,
                        transform: [{ translateX: textTranslateX }]
                    }}
                >
                    <Text
                        className="text-black ml-2"
                        style={[TYPOGRAPHY.titleBold, { fontSize: 23 }]}
                    >
                        London Waste
                    </Text>
                    <Text
                        className="text-black ml-2"
                        style={[TYPOGRAPHY.titleBold, { fontSize: 23 }]}
                    >
                        Management
                    </Text>
                </Animated.View>
            </View>
        </View>
    );
};

export default SplashScreen;
