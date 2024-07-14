import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, Dimensions } from 'react-native';
import { fetchUsers, deleteUser } from '../../services/api';
import Icon from 'react-native-vector-icons/FontAwesome';

const UserList = ({ navigation, route }) => {
  const [users, setUsers] = useState([]);
  const [orientation, setOrientation] = useState('PORTRAIT');

  const fetchData = async () => {
    const response = await fetchUsers();
    setUsers(response.data);
  };

  useEffect(() => {
    fetchData();

    const updateOrientation = () => {
      const { width, height } = Dimensions.get('window');
      if (width > height) {
        setOrientation('LANDSCAPE');
      } else {
        setOrientation('PORTRAIT');
      }
    };

    Dimensions.addEventListener('change', updateOrientation);
    updateOrientation();

    return () => {
      Dimensions.removeEventListener('change', updateOrientation);
    };
  }, []);

  useEffect(() => {
    if (route.params?.refresh) {
      fetchData();
    }
  }, [route.params?.refresh]);

  const handleAddAdmin = () => {
    navigation.navigate('AddAdmin', { onGoBack: fetchData });
  };

  const handleEditUser = (user) => {
    navigation.navigate('EditUser', { user, onGoBack: fetchData });
  };

  const handleDeleteUser = async (userId) => {
    try {
      await deleteUser(userId);
      setUsers(users.filter(user => user._id !== userId));
      Alert.alert('Success', 'User deleted successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to delete user');
    }
  };

  const renderUserItem = ({ item }) => (
    <View style={styles.userItem}>
      <Text style={styles.userText}>{item.username}</Text>
      {orientation === 'LANDSCAPE' && <Text style={styles.userText}>{item.email}</Text>}
      <View style={styles.iconContainer}>
        <TouchableOpacity onPress={() => handleEditUser(item)}>
          <Icon name="pencil" size={20} color="#000" style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDeleteUser(item._id)}>
          <Icon name="trash" size={20} color="#000" style={styles.icon} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.addButton} onPress={handleAddAdmin}>
        <Text style={styles.addButtonText}>Add Admin</Text>
      </TouchableOpacity>
      <FlatList
        data={users}
        keyExtractor={(item) => item._id}
        renderItem={renderUserItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f5f5f5',
    flex: 1,
  },
  addButton: {
    backgroundColor: '#1E90FF',
    paddingVertical: 12,
    borderRadius: 4,
    alignItems: 'center',
    marginBottom: 16,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  userItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  userText: {
    fontSize: 16,
  },
  iconContainer: {
    flexDirection: 'row',
  },
  icon: {
    marginLeft: 15,
  },
});

export default UserList;
