import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './components/Login';
import Register from './components/Register';
import ForgotPassword from './components/ForgotPassword';
import PlanList from './components/PlanList';
import ChapterList from './components/ChapterList';
import LessonList from './components/LessonList';
import TopicList from './components/TopicList';
import Quiz from './components/Quiz';
import AdminDashboard from './components/AdminDashboard';
import ManagePlans from './components/ManagePlans';
import ManageChapters from './components/ManageChapters';
import ManageMessages from './components/ManageMessages';
import UserProfile from './components/UserProfile';

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen 
          name="Login" 
          component={Login} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="Register" 
          component={Register} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="ForgotPassword" 
          component={ForgotPassword} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="PlanList" 
          component={PlanList} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="ChapterList" 
          component={ChapterList} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="LessonList" 
          component={LessonList} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="TopicList" 
          component={TopicList} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="Quiz" 
          component={Quiz} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="AdminDashboard" 
          component={AdminDashboard} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="ManagePlans" 
          component={ManagePlans} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="ManageChapters" 
          component={ManageChapters} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="ManageMessages" 
          component={ManageMessages} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="UserProfile" 
          component={UserProfile} 
          options={{ headerShown: false }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
