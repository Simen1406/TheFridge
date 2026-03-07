// reuseable table for fridge and grocery list
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { fontSizes, fontFamily, fontWeights } from "@/themes/fonts";
import { colors } from "@/themes/colors";
import { FridgeItem } from "@/types/foodTypes";


export default function FridgeTable({ items, onAddPress, onRemovePress }: {items: FridgeItem[], onAddPress: () => void, onRemovePress: (itemId: number) => void }) {
    return (
        <View style={fridgeStyles.background}>
            
            <View style={fridgeStyles.container}>
                <View style={fridgeStyles.title}>
                    <Text style = {fridgeStyles.title}>🧊 Fridge Inventory</Text>
                    <Text style = {fridgeStyles.subtext}>See what's in your fridge</Text>
                    <TouchableOpacity onPress={onAddPress} style={fridgeStyles.buttonContainer}>
                        <Text style = {fridgeStyles.button}> + Add New Item </Text>
                    </TouchableOpacity>
                </View>
                {items.map((item) => (
                    <View key={item.id} style={fridgeStyles.row}>
                        <View style={fridgeStyles.nameCol}>
                            <Text style={fridgeStyles.itemText}>{item.name}</Text>
                        </View>
                        <View style={fridgeStyles.amountCol}>
                            <Text style={fridgeStyles.itemText}>{item.weight} {item.weight_unit}</Text>
                        </View>
                        <View style={fridgeStyles.dateCol}>
                            <Text style={fridgeStyles.itemText}>{item.expiration_date}</Text>
                        </View>
                        <View style={fridgeStyles.actionCol}>
                            <TouchableOpacity onPress={() => onRemovePress(item.id)} style={fridgeStyles.buttonContainer}>
                                <Text style = {fridgeStyles.button}> Remove </Text>
                            </TouchableOpacity>
                        </View>
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
        width: "80%",
        maxWidth: 1000,
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
        justifyContent: "flex-start",
        alignItems: "center",
        paddingVertical: 15,
        columnGap: 18,
        borderBottomWidth: 1,
        borderBottomColor: colors.darkGray,
    },
    nameCol: {
        flex: 1.2,
        minWidth: 110,
    },
    amountCol: {
        flex: 1,
        minWidth: 130,
    },
    dateCol: {
        flex: 1.1,
        minWidth: 150,
    },
    actionCol: {
        width: 90,
        alignItems: "flex-start",
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
