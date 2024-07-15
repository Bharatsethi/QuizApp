import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { MessageProvider } from './context/MessageContext';
import { TranslationProvider } from './context/TranslationContext';
import ViewChapters from './components/UserActions/ViewChapters';
import ViewLessons from './components/UserActions/ViewLessons';
import ViewTopics from './components/UserActions/ViewTopics';
import ViewTopicContent from './components/UserActions/ViewTopicContent';
import Login from './components/UserActions/Login';
import Register from './components/UserActions/Register';
import ForgotPassword from './components/UserActions/ForgotPassword';
import UserProfile from './components/UserActions/UserProfile';
import PlanList from './components/AdminActions/PlanList';
import ChapterList from './components/AdminActions/ChapterList';
import LessonList from './components/AdminActions/LessonList';
import TopicList from './components/AdminActions/TopicList';
import Quiz from './components/AdminActions/Quiz';
import AdminDashboard from './components/AdminActions/AdminDashboard';
import ManagePlans from './components/AdminActions/ManagePlans';
import ManageChapters from './components/AdminActions/ManageChapters';
import ManageLessons from './components/AdminActions/ManageLessons';
import ManageMessages from './components/AdminActions/ManageMessages';
import UserList from './components/SuperAdminActions/UserList';
import EditUser from './components/SuperAdminActions/EditUser';
import AddAdmin from './components/SuperAdminActions/AddAdmin';
import EditChapter from './components/AdminActions/EditChapter';
import AddChapter from './components/AdminActions/AddChapter';
import AddLesson from './components/AdminActions/AddLesson';
import EditLesson from './components/AdminActions/EditLesson';
import AddTopic from './components/AdminActions/AddTopic';
import EditTopic from './components/AdminActions/EditTopic';
import ManageTranslations from './components/AdminActions/ManageTranslations';
import UserPlanList from './components/UserActions/UserPlanList';
import PlanDetails from './components/UserActions/PlanDetails'; // Ensure this is created
import ViewQuiz from './components/UserActions/ViewQuiz';
import QuizList from './components/AdminActions/QuizList';
import ViewAnswers from './components/AdminActions/ViewAnswers';
import AddPlan from './components/AdminActions/AddPlan'; // New Component

const Stack = createStackNavigator();

function App() {
  return (
    <TranslationProvider>
      <MessageProvider>
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
              name="ManageLessons" 
              component={ManageLessons} 
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
            <Stack.Screen 
              name="AddChapter" 
              component={AddChapter} 
              options={{ headerShown: false }} 
            />
            <Stack.Screen 
              name="EditChapter" 
              component={EditChapter} 
              options={{ headerShown: false }} 
            />
            <Stack.Screen 
              name="AddLesson" 
              component={AddLesson} 
              options={{ headerShown: false }} 
            />
            <Stack.Screen 
              name="EditLesson" 
              component={EditLesson} 
              options={{ headerShown: false }} 
            />
            <Stack.Screen 
              name="AddTopic" 
              component={AddTopic} 
              options={{ headerShown: false }} 
            />
            <Stack.Screen 
              name="EditTopic" 
              component={EditTopic} 
              options={{ headerShown: false }} 
            />
            <Stack.Screen 
              name="ManageTranslations" 
              component={ManageTranslations} 
              options={{ headerShown: false }} 
            />
            <Stack.Screen 
              name="UserPlanList" 
              component={UserPlanList} 
              options={{ headerShown: false }} 
            />
            <Stack.Screen 
              name="PlanDetails" 
              component={PlanDetails} 
              options={{ headerShown: false }} 
            />
            <Stack.Screen 
              name="ViewChapters" 
              component={ViewChapters} 
              options={{ headerShown: false }} 
            />
            <Stack.Screen 
              name="ViewLessons" 
              component={ViewLessons} 
              options={{ headerShown: false }} 
            />
            <Stack.Screen 
              name="ViewTopics" 
              component={ViewTopics} 
              options={{ headerShown: false }} 
            />
            <Stack.Screen 
              name="ViewTopicContent" 
              component={ViewTopicContent} 
              options={{ headerShown: false }} 
            />
            <Stack.Screen 
              name="ViewQuiz" 
              component={ViewQuiz} 
              options={{ headerShown: false }} 
            />
            <Stack.Screen 
              name="QuizList" 
              component={QuizList} 
              options={{ headerShown: false }} 
            />
            <Stack.Screen 
              name="ViewAnswers" 
              component={ViewAnswers} 
              options={{ headerShown: false }} 
            />
            <Stack.Screen 
              name="AddPlan" 
              component={AddPlan} 
              options={{ headerShown: false }} 
            />
          </Stack.Navigator>
        </NavigationContainer>
      </MessageProvider>
    </TranslationProvider>
  );
}

export default App;
