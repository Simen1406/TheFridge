// reuseable table for fridge and grocery list
import { Text, View, StyleSheet } from "react-native";
import { fontSizes, fontFamily, fontWeights } from "@/themes/fonts";
import { colors } from "@/themes/colors";

export default function FridgeTable({ items }: {items: { id: number; name: string; quantity: number; unit: string; category: string; price: number; expirationDate: string }[] }) {
    return (
        <View style={fridgeStyles.background}>
            
            <View style={fridgeStyles.container}>
                <View style={fridgeStyles.title}>
                    <Text style = {fridgeStyles.title}>🧊 Fridge Inventory</Text>
                    <Text style = {fridgeStyles.subtext}>See what's in your fridge</Text>
                </View>
                {items.map((item) => (
                    <View key={item.id} style={fridgeStyles.row}>
                        <Text style={fridgeStyles.name}>{item.name}</Text>
                        <Text style={fridgeStyles.quantity}>{item.quantity} {item.unit}</Text>
                        <Text style ={fridgeStyles.price}>${item.price.toFixed(2)}</Text>
                        <Text style={fridgeStyles.expirationDate}>{item.expirationDate}</Text>
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
    name: {
        fontSize: fontSizes.body,
        fontFamily: fontFamily.body,
        color: colors.darkGray
    },
    quantity: {
        fontSize: fontSizes.body,
        fontFamily: fontFamily.body,
        color: colors.darkGray
    },
    unit: {
        fontSize: fontSizes.body,
        fontFamily: fontFamily.body,
        color: colors.darkGray
    },
    price: {
        fontSize: fontSizes.body,
        fontFamily: fontFamily.body,
        color: colors.darkGray
    },
    expirationDate: {
        fontSize: fontSizes.body,
        fontFamily: fontFamily.body,
        color: colors.darkGray
    }
});