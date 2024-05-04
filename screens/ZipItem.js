// ContactItem.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const ZipItem = ({ zip, onDelete, onEdit, onSearch }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => onSearch(zip)} style={styles.button}>
        <Text style={styles.buttonText}>{zip.zipCode}</Text>
      </TouchableOpacity>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity onPress={() => onEdit(zip)} style={styles.editButton}>
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onDelete(zip.id)} style={styles.deleteButton}>
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    backgroundColor: '#ffffff',

  },
  
  buttonsContainer: {
    flexDirection: 'row',
    
  },
  button: {
    marginRight: 10,
    backgroundColor: '#007BFFAA',
    padding: 5,
    borderRadius: 4,
    alignItems: 'center',
    width: 100
  },
  deleteButton: {
    marginRight: 10,
    backgroundColor: '#B30000',
    padding: 5,
    borderRadius: 4
  },
  editButton: {
    marginRight: 10,
    backgroundColor: '#FFC100',
    padding: 5,
    borderRadius: 4
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16
  },
});

export default ZipItem;