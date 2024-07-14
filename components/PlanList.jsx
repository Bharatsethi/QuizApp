import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import Header from './Header';

const PlanList = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Header />
      <Button 
        title="View Profile" 
        onPress={() => navigation.navigate('UserProfile', { userId: 'USER_ID' })} 
      />
      {/* Other content */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
});

export default PlanList;
