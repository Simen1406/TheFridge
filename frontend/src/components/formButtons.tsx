import {Text, View, StyleSheet, Button, TouchableOpacity} from "react-native";
import { fontSizes, fontFamily, fontWeights } from "@/themes/fonts";
import { colors } from "@/themes/colors";


export default function FormButtons({ onSave, onCancel }: { onSave: () => void; onCancel: () => void }) {
    return (
        <View style={buttonStyles.buttonContainer}>
            <TouchableOpacity onPress={onSave} style={buttonStyles.saveButton}>
                <Text style={{ color: "white" }}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onCancel} style={buttonStyles.cancelButton}>
                <Text style={{ color: "white" }}>Cancel</Text>
            </TouchableOpacity>
        </View>
    );
}

const buttonStyles = StyleSheet.create ({
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 10,
        marginTop: 20,
    },
    saveButton: {
        backgroundColor: colors.primary,
        alignContent: "center",
        padding: 15,
        borderRadius: 6,
    },
    cancelButton: {
        backgroundColor: colors.primary,
        alignContent: "center",
        padding: 15,
        borderRadius: 6,
    },
    buttonText: {
        color: colors.lightGray,
        fontWeight: fontWeights.bold,
    }
});