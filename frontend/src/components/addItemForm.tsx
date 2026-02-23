import { useState } from "react";
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { addFridgeItem } from "../services/api";

export default function AddItemForm({ visible, onClose, onItemAdded }: {visible: boolean; onClose: () => void; onItemAdded: () => void }) {
    const [name, setName] = useState("");
    const [category, setCategory] = useState("");
    const [quantity, setQuantity] = useState("");       // turn into number before sending to backend
    const [unit, setUnit] = useState("");
    const [expirationDate, setExpirationDate] = useState("");

    const handleSubmit = async () => {
        await addFridgeItem({
            name,
            category,
            quantity,
            unit,
            expiration_date: expirationDate,
        });
        setName("");
        setCategory("");
        setQuantity("");
        setUnit("");
        setExpirationDate("");
        onItemAdded(); // Refresh the list after adding
        onClose(); // Close the form after adding
    };

    return (
        <Modal visible={visible} transparent animationType="slide">
            <View style={formStyles.overlay}>
                <View style={formStyles.formContainer}>
                <Text>Add New Item</Text>
                
                <TextInput placeholder="Name" value={name} onChangeText={setName} />
                <TextInput placeholder="Category" value={category} onChangeText={setCategory} />
                <TextInput placeholder="Quantity" value={quantity} onChangeText={setQuantity} keyboardType="numeric" />
                <TextInput placeholder="Unit" value={unit} onChangeText={setUnit} />
                <TextInput placeholder="Expiration (YYYY-MM-DD)" value={expirationDate} onChangeText={setExpirationDate} />
                
                <TouchableOpacity onPress={handleSubmit}>
                    <Text>Save</Text>
                </TouchableOpacity>
                
                <TouchableOpacity onPress={onClose}>
                    <Text>Cancel</Text>
                </TouchableOpacity>
                </View>
            </View>
        </Modal>
        );};
//create one for groceries as well

const formStyles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    formContainer: {
        width: "80%",
        padding: 20,
        backgroundColor: "white",
    },
});