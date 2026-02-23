import { useState } from "react";
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { addFridgeItem } from "../services/api";
import { colors } from "@/themes/colors";
import FormButtons from "./formButtons";

export default function AddItemForm({ visible, onClose, onItemAdded }: {visible: boolean; onClose: () => void; onItemAdded: () => void }) {
    const [name, setName] = useState("");
    const [category, setCategory] = useState("");
    const [quantity, setQuantity] = useState("");       // turn into number before sending to backend
    const [unit, setUnit] = useState("");
    const [expirationDate, setExpirationDate] = useState("");

    const resetForm = () => {
        setName("");
        setCategory("");
        setQuantity("");
        setUnit("");
        setExpirationDate("");
    }

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
    }

    const handleClose = () => {
        resetForm();
        onClose();
    };

    return (
        <Modal visible={visible} transparent animationType="slide">
            <View style={formStyles.overlay}>
                <View style={formStyles.formContainer}>
                <Text>Add New Item</Text>
                
                <Text style={formStyles.label}>Name</Text>
                <TextInput style={formStyles.input} placeholder="Name" value={name} onChangeText={setName} />

                <Text style={formStyles.label}>Category</Text>
                <TextInput style={formStyles.input} placeholder="Category" value={category} onChangeText={setCategory} />

                <Text style={formStyles.label}>Quantity</Text>
                <TextInput style={formStyles.input} placeholder="Quantity" value={quantity} onChangeText={setQuantity} keyboardType="numeric" />

                <Text style={formStyles.label}>Unit</Text>
                <TextInput style={formStyles.input} placeholder="Unit" value={unit} onChangeText={setUnit} />

                <Text style={formStyles.label}>Expiration Date</Text>
                <TextInput style={formStyles.input} placeholder="Expiration (YYYY-MM-DD)" value={expirationDate} onChangeText={setExpirationDate} />
                
                <FormButtons onSave={handleSubmit} onCancel={handleClose} />
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
        width: "30%",
        padding: 20,
        backgroundColor: colors.lightGray,
        borderWidth: 5,
        borderColor: colors.primary,
        borderRadius: 8,
    },
    label: {
        fontSize: 12,
        color: "gray",
        marginBottom: 4,
        alignContent: "center"
    },
    input: {
        borderWidth: 1,
        borderColor: "gray",
        borderRadius: 6,
        padding: 8,
        marginBottom: 10,
    },
});