export default ({ config }) => ({
    ...config,
    name: "sous",
    slug: "sous",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon-ios.png",
    scheme: "sous",
    newArchEnabled: true,
    ios: {
        supportsTablet: true,
        bundleIdentifier: "com.anonymous.sous",
        infoPlist: {
            NSCameraUsageDescription:
                "This app needs access to your camera to scan a QR code.",
            ITSAppUsesNonExemptEncryption: false,
        },
    },
    android: {
        adaptiveIcon: {
            backgroundColor: "#E6F4FE",
            foregroundImage: "./assets/images/android-icon-foreground.png",
            backgroundImage: "./assets/images/android-icon-background.png",
            monochromeImage: "./assets/images/android-icon-monochrome.png",
        },
        edgeToEdgeEnabled: true,
        predictiveBackGestureEnabled: false,
        package: "com.anonymous.sous",
        permissions: ["android.permission.CAMERA", "android.permission.RECORD_AUDIO"],
    },
    web: {
        output: "static",
        favicon: "./assets/images/favicon.png",
    },
    plugins: [
        "expo-router",
        [
            "expo-splash-screen",
            {
                image: "./assets/images/splash-icon.png",
                imageWidth: 100,
                resizeMode: "contain",
                backgroundColor: "#FFD541",
                dark: { backgroundColor: "#000000" },
            },
        ],
        "expo-font",
        "expo-web-browser",
        [
            "expo-camera",
            {
                cameraPermission: "Allow $(PRODUCT_NAME) to access your camera",
            },
        ],
    ],
    experiments: {
        typedRoutes: true,
        reactCompiler: true,
    },
    extra: {
        router: {},
        eas: {
            projectId: "86d552c4-119e-4ba1-8264-b38eee58f997",
        },
        apiHost: process.env.EXPO_PUBLIC_API_HOST,
        clerkKey: process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY,
    },
});