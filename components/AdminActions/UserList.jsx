import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Alert } from 'react-native';
import axios from 'axios';
import Header from '../General/Header';
import Icon from 'react-native-vector-icons/FontAwesome';
import { fetchUsers, deleteUser, updateUser } from '../../services/api';
import { TranslationContext } from '../../context/TranslationContext';
import styles from '../General/styles';

const UserList = ({ navigation }) => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const { translations } = useContext(TranslationContext);

  useEffect(() => {
    fetchUsersData();
  }, []);

  const fetchUsersData = async () => {
    try {
      const response = await fetchUsers();
      setUsers(response.data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      Alert.alert(translations.error || 'Error', translations.failedToFetchUsers || 'Failed to fetch users.');
    }
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const handleDeleteUser = async (userId) => {
    try {
      await deleteUser(userId);
      Alert.alert(translations.success || 'Success', translations.userDeletedSuccessfully || 'User deleted successfully');
      fetchUsersData();
    } catch (error) {
      console.error('Delete user error:', error);
      Alert.alert(translations.error || 'Error', translations.failedToDeleteUser || 'Failed to delete user.');
    }
  };

  const handleSaveChanges = async () => {
    try {
      await updateUser(selectedUser._id, selectedUser);
      Alert.alert(translations.success || 'Success', translations.userUpdatedSuccessfully || 'User updated successfully');
      setShowEditModal(false);
      fetchUsersData();
    } catch (error) {
      console.error('Update user error:', error);
      Alert.alert(translations.error || 'Error', translations.failedToUpdateUser || 'Failed to update user.');
    }
  };

  const renderUserItem = ({ item }) => (
    <View style={styles.planItem}>
      <Text style={styles.planText}>{item.username}</Text>
      <View style={styles.planActions}>
        <TouchableOpacity onPress={() => handleEditUser(item)}>
          <Icon name="edit" size={20} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDeleteUser(item._id)}>
          <Icon name="trash" size={20} color="#ff0000" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header />
      <Text style={styles.sectionTitle}>{translations.manage} {translations.users || 'Users'}</Text>
      <FlatList
        data={users}
        keyExtractor={(item) => item._id}
        renderItem={renderUserItem}
        contentContainerStyle={styles.plansList}
      />
      {showEditModal && (
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>{translations.editUser || 'Edit User'}</Text>
          <TextInput
            style={styles.input}
            value={selectedUser.username}
            onChangeText={(text) => setSelectedUser({ ...selectedUser, username: text })}
            placeholder={translations.username || 'Username'}
          />
          <TextInput
            style={styles.input}
            value={selectedUser.email}
            onChangeText={(text) => setSelectedUser({ ...selectedUser, email: text })}
            placeholder={translations.email || 'Email'}
          />
          <TextInput
            style={styles.input}
            value={selectedUser.password}
            onChangeText={(text) => setSelectedUser({ ...selectedUser, password: text })}
            placeholder={translations.password || 'Password'}
            secureTextEntry
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.primaryButton} onPress={handleSaveChanges}>
              <Text style={styles.buttonText}>{translations.saveChanges || 'Save Changes'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={() => setShowEditModal(false)}>
              <Text style={styles.buttonText}>{translations.cancel}</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

export default UserList;
