import { useState, useCallback } from "react";
import { View, Text, StyleSheet } from "react-native";
import { ScrollView, TextInput } from "react-native-gesture-handler";
import { newColors } from "../../constants/colors";
import { Place } from "../../models/place";
import Button from "../ui/Button";
import ImagePicker from "./ImagePicker";
import LocationPicker from "./LocationPicker";

function PlaceForm({ onCreatePlace }) {
  const [enteredTitle, setEnteredTitle] = useState("");

  const [selectImage, setSelectImage] = useState();

  const [pickLocation, setPickLocation] = useState();

  function changeTitleHandler(enteredText) {
    setEnteredTitle(enteredText);
  }

  function takeImageHandler(imageUri) {
    setSelectImage(imageUri);
  }

  const pickLocationHandler = useCallback((location) => {
    setPickLocation(location);
  }, []);

  function savePlaceHandler() {
    const placeData = new Place(enteredTitle, selectImage, pickLocation);
    onCreatePlace(placeData);
  }

  return (
    <ScrollView style={styles.form}>
      <View>
        <Text style={styles.label}>Title</Text>
        <TextInput
          style={styles.input}
          onChangeText={changeTitleHandler}
          value={enteredTitle}
        />
      </View>
      <ImagePicker onTakeImage={takeImageHandler} />
      <LocationPicker onPickLocation={pickLocationHandler} />
      <Button onPress={savePlaceHandler}>Add Place</Button>
    </ScrollView>
  );
}

export default PlaceForm;

const styles = StyleSheet.create({
  form: {
    flex: 1,
    padding: 24,
  },
  label: {
    fontWeight: "bold",
    marginBottom: 4,
    color: newColors.primary500,
  },
  input: {
    marginVertical: 8,
    paddingHorizontal: 4,
    paddingVertical: 8,
    fontSize: 16,
    borderBottomColor: newColors.primary700,
    borderBottomWidth: 2,
    backgroundColor: newColors.primary100,
  },
});
