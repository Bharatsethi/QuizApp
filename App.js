// App.js
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { MessageProvider } from './context/MessageContext';
import Login from './components/UserActions/Login';
import Register from './components/UserActions/Register';
import ForgotPassword from './components/UserActions/ForgotPassword';
import PlanList from './components/AdminActions/PlanList';
import ChapterList from './components/AdminActions/ChapterList';
import LessonList from './components/AdminActions/LessonList';
import TopicList from './components/AdminActions/TopicList';
import Quiz from './components/AdminActions/Quiz';
import AdminDashboard from './components/AdminActions/AdminDashboard';
import ManagePlans from './components/AdminActions/ManagePlans';
import ManageChapters from './components/AdminActions/ManageChapters';
import ManageMessages from './components/AdminActions/ManageMessages';
import UserProfile from './components/UserActions/UserProfile';
import UserList from './components/SuperAdminActions/UserList';
import EditUser from './components/SuperAdminActions/EditUser';
import AddAdmin from './components/SuperAdminActions/AddAdmin';

const Stack = createStackNavigator();

function App() {
  return (
    <MessagesProvider> {/* Wrap the app with the MessagesProvider */}
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
          <Stack.Screen 
            name="UserList" 
            component={UserList} 
            options={{ headerShown: false }} 
          />
          <Stack.Screen 
            name="AddAdmin" 
            component={AddAdmin} 
            options={{ headerShown: false }} 
          />
          <Stack.Screen 
            name="EditUser" 
            component={EditUser} 
            options={{ headerShown: false }} 
          />
        </Stack.Navigator>
      </NavigationContainer>
    </MessagesProvider>
  );
}

export default App;
