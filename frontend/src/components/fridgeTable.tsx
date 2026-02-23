// reuseable table for fridge and grocery list
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { fontSizes, fontFamily, fontWeights } from "@/themes/fonts";
import { colors } from "@/themes/colors";


export default function FridgeTable({ items }: {items: { id: number; name: string; quantity: number; unit: string; category: string; price: number; expirationDate: string }[] }) {
    return (
        <View style={fridgeStyles.background}>
            
            <View style={fridgeStyles.container}>
                <View style={fridgeStyles.title}>
                    <Text style = {fridgeStyles.title}>🧊 Fridge Inventory</Text>
                    <Text style = {fridgeStyles.subtext}>See what's in your fridge</Text>
                    <TouchableOpacity onPress={() => console.log ("Add new item")} style={fridgeStyles.buttonContainer}>
                        <Text style = {fridgeStyles.button}> + Add New Item </Text>
                    </TouchableOpacity>
                </View>
                {items.map((item) => (
                    <View key={item.id} style={fridgeStyles.row}>
                        <Text style={fridgeStyles.itemText}>{item.name}</Text>
                        <Text style={fridgeStyles.itemText}>{item.quantity} {item.unit}</Text>
                        <Text style ={fridgeStyles.itemText}>${item.price.toFixed(2)}</Text>
                        <Text style={fridgeStyles.itemText}>{item.expirationDate}</Text>
                        <TouchableOpacity onPress={() => console.log(`Remove item with id ${item.id}`)} style={fridgeStyles.buttonContainer}>
                            <Text style = {fridgeStyles.button}> Remove </Text>
                        </TouchableOpacity>
                    </View>
                ))}
            </View>
        </View>
    );    
}

const fridgeStyles = StyleSheet.create({
    background: {
        width: "100%",
        height: "100%",
        backgroundColor: colors.background,
    },
    title: {
        alignItems: "center",
        fontSize: fontSizes.header,
        color: colors.headerText,
        fontWeight: fontWeights.bold,
        marginBottom: 8,
    },
    subtext: {
        fontSize: fontSizes.subtitle,
        color: colors.darkGray,
        paddingBottom: 20,
    },
    container: {
        width: "50%",
        height: "70%",
        alignSelf: "center",
        backgroundColor: colors.background,
        borderRadius: 8,
        borderColor: colors.primary,
        borderWidth: 3,
        paddingTop: 30,
        paddingHorizontal: 10,
        shadowColor: colors.primary,
        shadowRadius: 10,
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: colors.darkGray,
    },
    itemText: {
        fontSize: fontSizes.body,
        fontFamily: fontFamily.body,
        color: colors.darkGray
    },
    button: {
        fontSize: fontSizes.body,
        fontFamily: fontFamily.body,
        color: colors.primary,
        textDecorationLine: "underline",
    },
    buttonContainer: {
        padding: 4,
    }
});