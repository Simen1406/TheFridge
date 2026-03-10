import { useState } from "react";
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { addGroceryItem } from "../services/api";
import { colors } from "@/themes/colors";
import FormButtons from "./formButtons";

export default function AddGroceryForm({ visible, onClose, onItemAdded }: {visible: boolean; onClose: () => void; onItemAdded: () => void }) {
    const [ean, setEan] = useState("");
    const [name, setName] = useState("");
    const [brand, setBrand] = useState("");
    const [price, setPrice] = useState("");
    const [weight, setWeight] = useState("");
    const [weightUnit, setWeightUnit] = useState("");
    const [image, setImage] = useState("");

    const resetForm = () => {
        setName("");
        setEan("");
        setBrand("");
        setPrice("");
        setWeight("");
        setWeightUnit("");
        setImage("");
    }

    const handleSubmit = async () => {
        await addGroceryItem({
            ean,
            name,
            brand,
            price,
            weight,
            weight_unit: weightUnit,
            image,
        });
        setName("");
        setEan("");
        setBrand("");
        setPrice("");
        setWeight("");
        setWeightUnit("");
        setImage("");
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

                <Text style={formStyles.label}>Price</Text>
                <TextInput style={formStyles.input} placeholder="Price" keyboardType="numeric" value={price} onChangeText={setPrice} />

                <Text style={formStyles.label}>weight</Text>
                <TextInput style={formStyles.input} placeholder="Weight" keyboardType="numeric" value={weight} onChangeText={setWeight} />

                <Text style={formStyles.label}>Weight unit</Text>
                <TextInput style={formStyles.input} placeholder="Unit" value={weightUnit} onChangeText={setWeightUnit} />
                
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
