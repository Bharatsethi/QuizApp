import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, FlatList, Alert, Picker } from 'react-native';
import { fetchChapters, createChapter, updateChapter, deleteChapter, fetchPlans } from '../../services/api';
import Header from '../General/Header';

const ManageChapters = () => {
  const [chapters, setChapters] = useState([]);
  const [title, setTitle] = useState('');
  const [introduction, setIntroduction] = useState('');
  const [overview, setOverview] = useState('');
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [plans, setPlans] = useState([]);
  const [selectedPlanId, setSelectedPlanId] = useState('');

  useEffect(() => {
    const getPlansAndChapters = async () => {
      const plansResponse = await fetchPlans();
      setPlans(plansResponse.data);

      if (plansResponse.data.length > 0) {
        setSelectedPlanId(plansResponse.data[0]._id);
        const chaptersResponse = await fetchChapters(plansResponse.data[0]._id);
        setChapters(chaptersResponse.data);
      }
    };

    getPlansAndChapters();
  }, []);

  const handleCreateOrUpdate = async () => {
    try {
      if (selectedChapter) {
        await updateChapter(selectedChapter._id, { title, introduction, overview });
        Alert.alert('Success', 'Chapter updated successfully');
      } else {
        await createChapter({ planId: selectedPlanId, title, introduction, overview });
        Alert.alert('Success', 'Chapter created successfully');
      }
      setTitle('');
      setIntroduction('');
      setOverview('');
      setSelectedChapter(null);
      const chaptersResponse = await fetchChapters(selectedPlanId);
      setChapters(chaptersResponse.data);
    } catch (error) {
      Alert.alert('Error', 'Something went wrong');
    }
  };

  const handleEdit = (chapter) => {
    setTitle(chapter.title);
    setIntroduction(chapter.introduction);
    setOverview(chapter.overview);
    setSelectedChapter(chapter);
  };

  const handleDelete = async (chapterId) => {
    try {
      await deleteChapter(chapterId);
      Alert.alert('Success', 'Chapter deleted successfully');
      const chaptersResponse = await fetchChapters(selectedPlanId);
      setChapters(chaptersResponse.data);
    } catch (error) {
      Alert.alert('Error', 'Something went wrong');
    }
  };

  const handlePlanChange = async (planId) => {
    setSelectedPlanId(planId);
    const chaptersResponse = await fetchChapters(planId);
    setChapters(chaptersResponse.data);
  };

  return (
    <View>
        <Header />
      <Text>Select Plan:</Text>
      <Picker
        selectedValue={selectedPlanId}
        onValueChange={(itemValue) => handlePlanChange(itemValue)}
      >
        {plans.map((plan) => (
          <Picker.Item key={plan._id} label={plan.title} value={plan._id} />
        ))}
      </Picker>
      <Text>Title:</Text>
      <TextInput value={title} onChangeText={setTitle} />
      <Text>Introduction:</Text>
      <TextInput value={introduction} onChangeText={setIntroduction} />
      <Text>Overview:</Text>
      <TextInput value={overview} onChangeText={setOverview} />
      <Button title={selectedChapter ? 'Update Chapter' : 'Create Chapter'} onPress={handleCreateOrUpdate} />
      <FlatList
        data={chapters}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View>
            <Text>{item.title}</Text>
            <Text>{item.introduction}</Text>
            <Text>{item.overview}</Text>
            <Button title="Edit" onPress={() => handleEdit(item)} />
            <Button title="Delete" onPress={() => handleDelete(item._id)} />
          </View>
        )}
      />
    </View>
  );
};

export default ManageChapters;
