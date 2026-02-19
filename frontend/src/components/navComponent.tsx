import { View, StyleSheet, Text } from "react-native";
import { Link } from "expo-router";

import { fontSizes, fontFamily, fontWeights, } from "@/themes/fonts";
import { colors } from "@/themes/colors";

// navigation menu for all pages

export default function SharedNav() {
    return (
        <View style = {styles.container}>
            <Text style = {styles.navTitle}> The Fridge</Text>
            <View style={styles.navLinks}>
                <Link href="/(tabs)" style={styles.navLink}>
                    <Text style={styles.linkText}>Home</Text>
                </Link>
                <Link href="/(tabs)/fridgeInventory" style={styles.navLink}>
                    <Text style={styles.linkText}>Inventory</Text>
                </Link>
                <Link href="/(tabs)/groceryList" style={styles.navLink}>
                    <Text style={styles.linkText}>Grocery List</Text>
                </Link>    
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.background,
        height: 150,
        justifyContent: "center",
        alignItems: "center",
        padding: 10,
    },
    navTitle: {
        color: colors.primary,
        fontSize: fontSizes.navText,
        fontFamily: fontFamily.navFont,
        fontWeight: fontWeights.medium
    },
    navLinks: {
        flexDirection: "row",
        marginTop: 10,
        gap: 20,
    },
    navLink: {
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    linkText: {
        color: colors.primary,
        fontSize: fontSizes.navText
    },
});