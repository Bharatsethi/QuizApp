import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { MessageProvider } from './context/MessageContext';
import { UserProvider, UserContext } from './context/UserContext';
import { TranslationProvider } from './context/TranslationContext';
import Login from './components/UserActions/Login';
import Register from './components/UserActions/Register';
import ForgotPassword from './components/UserActions/ForgotPassword';
import { Text } from 'react-native'; // Import Text for Suspense fallback

const Stack = createStackNavigator();

const screenOptions = {
  headerShown: false,
};

const AdminScreens = [
  { name: 'PlanList', component: React.lazy(() => import('./components/AdminActions/PlanList')) },
  { name: 'ChapterList', component: React.lazy(() => import('./components/AdminActions/ChapterList')) },
  { name: 'LessonList', component: React.lazy(() => import('./components/AdminActions/LessonList')) },
  { name: 'TopicList', component: React.lazy(() => import('./components/AdminActions/TopicList')) },
  { name: 'Quiz', component: React.lazy(() => import('./components/AdminActions/Quiz')) },
  { name: 'AdminDashboard', component: React.lazy(() => import('./components/AdminActions/AdminDashboard')) },
  { name: 'ManagePlans', component: React.lazy(() => import('./components/AdminActions/ManagePlans')) },
  { name: 'ManageChapters', component: React.lazy(() => import('./components/AdminActions/ManageChapters')) },
  { name: 'ManageLessons', component: React.lazy(() => import('./components/AdminActions/ManageLessons')) },
  { name: 'AddChapter', component: React.lazy(() => import('./components/AdminActions/AddChapter')) },
  { name: 'AddExistingChapter', component: React.lazy(() => import('./components/AdminActions/AddExistingChapter')) },
  { name: 'EditChapter', component: React.lazy(() => import('./components/AdminActions/EditChapter')) },
  { name: 'AddLesson', component: React.lazy(() => import('./components/AdminActions/AddLesson')) },
  { name: 'EditLesson', component: React.lazy(() => import('./components/AdminActions/EditLesson')) },
  { name: 'AddTopic', component: React.lazy(() => import('./components/AdminActions/AddTopic')) },
  { name: 'EditTopic', component: React.lazy(() => import('./components/AdminActions/EditTopic')) },
  { name: 'ManageTranslations', component: React.lazy(() => import('./components/AdminActions/ManageTranslations')) },
  { name: 'QuizList', component: React.lazy(() => import('./components/AdminActions/QuizList')) },
  { name: 'ViewAnswers', component: React.lazy(() => import('./components/AdminActions/ViewAnswers')) },
  { name: 'AddPlan', component: React.lazy(() => import('./components/AdminActions/AddPlan')) },
  { name: 'ManageMessages', component: React.lazy(() => import('./components/AdminActions/ManageMessages')) },
  { name: 'EditPlan', component: React.lazy(() => import('./components/AdminActions/EditPlan')) },
  { name: 'EditMessage', component: React.lazy(() => import('./components/AdminActions/EditMessage')) },
  { name: 'ManageQuestions', component: React.lazy(() => import('./components/AdminActions/ManageQuestions')) }, // Ensure the file exists
];

const SuperAdminScreens = [
  { name: 'UserList', component: React.lazy(() => import('./components/SuperAdminActions/UserList')) },
  { name: 'EditUser', component: React.lazy(() => import('./components/SuperAdminActions/EditUser')) },
  { name: 'AddAdmin', component: React.lazy(() => import('./components/SuperAdminActions/AddAdmin')) },
];

const UserScreens = [
  { name: 'UserProfile', component: React.lazy(() => import('./components/UserActions/UserProfile')) },
  { name: 'UserPlanList', component: React.lazy(() => import('./components/UserActions/UserPlanList')) },
  { name: 'PlanDetails', component: React.lazy(() => import('./components/UserActions/PlanDetails')) },
  { name: 'ViewChapters', component: React.lazy(() => import('./components/UserActions/ViewChapters')) },
  { name: 'ViewLessons', component: React.lazy(() => import('./components/UserActions/ViewLessons')) },
  { name: 'ViewTopics', component: React.lazy(() => import('./components/UserActions/ViewTopics')) },
  { name: 'ViewTopicContent', component: React.lazy(() => import('./components/UserActions/ViewTopicContent')) },
  { name: 'ViewQuiz', component: React.lazy(() => import('./components/UserActions/ViewQuiz')) },
];

const MainApp = () => {
  const { user } = React.useContext(UserContext);
  console.log('User in App:', user); // Debug log
  const renderScreens = (screens) =>
    screens.map((screen) => <Stack.Screen key={screen.name} name={screen.name} component={screen.component} />);

  const getScreensByRole = () => {
    if (user?.role === 'superuser') { // Changed from 'superadmin' to 'superuser'
      return renderScreens(SuperAdminScreens);
    } else if (user?.role === 'admin') {
      return renderScreens(AdminScreens);
    } else {
      return renderScreens(UserScreens);
    }
  };

  return (
    <NavigationContainer>
      <React.Suspense fallback={<Text>Loading...</Text>}>
        <Stack.Navigator initialRouteName="Login" screenOptions={screenOptions}>
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Register" component={Register} />
          <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
          {getScreensByRole()}
        </Stack.Navigator>
      </React.Suspense>
    </NavigationContainer>
  );
};

const App = () => {
  return (
    <TranslationProvider>
      <MessageProvider>
        <UserProvider>
          <MainApp />
        </UserProvider>
      </MessageProvider>
    </TranslationProvider>
  );
};

export default App;
