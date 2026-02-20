// reuseable table for fridge and grocery list
import { Text, View, StyleSheet } from "react-native";
import { fontSizes, fontFamily, fontWeights } from "@/themes/fonts";
import { colors } from "@/themes/colors";

export default function GroceryTable({ items }: {items: { id: number; name: string; quantity: number; unit: string; category: string }[] }) {
    return (
        <View style={groceryStyles.background}>
            <View style={groceryStyles.container}>
                <View style={groceryStyles.title}>
                    <Text style = {groceryStyles.title}>🧊 Your Shopping List</Text>
                    <Text style = {groceryStyles.subtext}>See what's in your shopping list</Text>
                </View>
                {items.map((item) => (
                    <View key={item.id} style={groceryStyles.row}>
                        <Text style={groceryStyles.itemText}>{item.name}</Text>
                        <Text style={groceryStyles.itemText}>{item.quantity} {item.unit}</Text>
                        <Text style = {groceryStyles.itemText}>{item.category}</Text>
                    </View>
                ))}
            </View>
        </View>
    );    
}

const groceryStyles = StyleSheet.create({
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
});