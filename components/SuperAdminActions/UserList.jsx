import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, Dimensions, TextInput } from 'react-native';
import { fetchUsers, deleteUser } from '../../services/api';
import Header from '../General/Header';
import Icon from 'react-native-vector-icons/FontAwesome';
import { TranslationContext } from '../../context/TranslationContext';
import styles from '../General/styles';

const UserList = ({ navigation, route }) => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [orientation, setOrientation] = useState('PORTRAIT');
  const { translations } = useContext(TranslationContext);

  const t = { ...translations };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchUsers();
        setUsers(response.data);
        setFilteredUsers(response.data);
      } catch (error) {
        Alert.alert(t.error, t.failedToFetchUsers);
      }
    };

    fetchData();

    const updateOrientation = () => {
      const { width, height } = Dimensions.get('window');
      setOrientation(width > height ? 'LANDSCAPE' : 'PORTRAIT');
    };

    Dimensions.addEventListener('change', updateOrientation);
    updateOrientation();

    return () => {
      Dimensions.removeEventListener('change', updateOrientation);
    };
  }, []);

  useEffect(() => {
    if (route.params?.refresh) {
      const fetchData = async () => {
        try {
          const response = await fetchUsers();
          setUsers(response.data);
          setFilteredUsers(response.data);
        } catch (error) {
          Alert.alert(t.error, t.failedToFetchUsers);
        }
      };

      fetchData();
    }
  }, [route.params?.refresh]);

  const handleAddAdmin = () => {
    navigation.navigate('AddAdmin', { onGoBack: refreshUserList });
  };

  const handleLogout = () => {
    navigation.navigate('Login');
  };

  const refreshUserList = async () => {
    try {
      const response = await fetchUsers();
      setUsers(response.data);
      setFilteredUsers(response.data);
    } catch (error) {
      Alert.alert(t.error, t.failedToFetchUsers);
    }
  };

  const handleEditUser = (user) => {
    navigation.navigate('EditUser', { user });
  };

  const handleDeleteUser = async (userId) => {
    try {
      await deleteUser(userId);
      setUsers(users.filter((user) => user._id !== userId));
      setFilteredUsers(users.filter((user) => user._id !== userId));
      Alert.alert(t.success, t.userDeletedSuccessfully);
    } catch (error) {
      Alert.alert(t.error, t.failedToDeleteUser);
    }
  };

  const handleSearch = (text) => {
    setSearchText(text);
    const filtered = users.filter(user => 
      user.username.toLowerCase().includes(text.toLowerCase()) || 
      user.email.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.addButton} onPress={handleAddAdmin}>
          <Icon name="plus" size={16} color="#fff" style={styles.buttonIcon} />
          <Text style={styles.addButtonText}>{t.addAdmin}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Icon name="sign-out" size={16} color="#fff" style={styles.buttonIcon} />
          <Text style={styles.logoutButtonText}>{t.logout}</Text>
        </TouchableOpacity>
      </View>
      <TextInput
        style={styles.searchInput}
        value={searchText}
        onChangeText={handleSearch}
        placeholder={t.searchPlaceholder}
      />
      <View style={styles.tableHeader}>
        <Text style={styles.tableHeaderText}>{t.username}</Text>
        {orientation === 'LANDSCAPE' && <Text style={styles.tableHeaderText}>{t.email}</Text>}
        <Text style={styles.tableHeaderText}>{t.role}</Text>
        <Text style={styles.tableHeaderText}>{t.actions}</Text>
      </View>
      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>{item.username}</Text>
            {orientation === 'LANDSCAPE' && <Text style={styles.tableCell}>{item.email}</Text>}
            <Text style={styles.tableCell}>{item.role}</Text>
            <View style={styles.iconContainer}>
              {item.role !== 'superuser' && (
                <>
                  <TouchableOpacity onPress={() => handleEditUser(item)}>
                    <Icon name="pencil" size={20} color="#000" style={styles.icon} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDeleteUser(item._id)}>
                    <Icon name="trash" size={20} color="#000" style={styles.icon} />
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        )}
        contentContainerStyle={styles.contentContainer}
      />
    </View>
  );
};

export default UserList;
