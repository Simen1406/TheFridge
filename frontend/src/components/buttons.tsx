import {Text, View, StyleSheet, Button, TouchableOpacity} from "react-native";
import { fontSizes, fontFamily, fontWeights } from "@/themes/fonts";
import { colors } from "@/themes/colors";

// reuseable button for adding and removing items from inventory and grocery list.

export default function Custombutton({ title, onPress }: { title: string; onPress: () => void }) {
    return (
        <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={onPress}>
                <Text style={styles.button}>{title}</Text>
            </TouchableOpacity>
        </View>
    )
}
const styles = StyleSheet.create ({
    buttonContainer: {
        flexDirection: "row",
        gap: 10,
    },
    button: {
        backgroundColor: colors.primary,
        padding: 10,
        borderRadius: 5,
        color: colors.lightGray
    }
})