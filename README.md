# Purpose
## Usage
### SuperUser
1. Login: Use the credentials email: support@poojabharat.com and password: PoojaBharat.
2. User Management: Navigate to the User List screen to add new Admin users.
3. Message Management: Post messages that will be visible to all users.
### Admin
1. Login: Use the credentials provided by the SuperUser.
2. Content Management: Create and manage plans, chapters, lessons, topics, and quizzes.
### User
1. Register/Login: Create an account or log in to an existing one.
2. Participate in Quizzes: Navigate through the plans and take quizzes.
3. Contributing
4. Contributions are welcome! Please fork the repository and submit pull requests for review.

## License
This project is licensed under the MIT License. See the LICENSE file for details.

## Troubleshooting
If you can't get this to work, see the Troubleshooting page.
MangoDB connection failed : ensure mangoDB service is running
Open a terminal or command prompt and run:
### sudo systemctl status mongod
or for Windows:
### net start MongoDB

## Learn More
To learn more about React Native, take a look at the following resources:
1. React Native Website - Learn more about React Native.
2. Getting Started - An overview of React Native and how to set up your environment.
3. Learn the Basics - A guided tour of the React Native basics.
4. Blog - Read the latest official React Native Blog posts.
5. @facebook/react-native - The open-source GitHub repository for React Native.

This is a new [**React Native**](https://reactnative.dev) project, bootstrapped using [`@react-native-community/cli`](https://github.com/react-native-community/cli).

# Congratulations!
You've successfully run and modified your React Native App. 🎉

# Getting Started

>**Note**: Make sure you have completed the [React Native - Environment Setup](https://reactnative.dev/docs/environment-setup) instructions till "Creating a new application" step, before proceeding.

## Step 1: Start the Metro Server

First, you will need to start **Metro**, the JavaScript _bundler_ that ships _with_ React Native.

To start Metro, run the following command from the _root_ of your React Native project:

```bash
# using npm
npm start

# OR using Yarn
yarn start
```

## Step 2: Start your Application

Let Metro Bundler run in its _own_ terminal. Open a _new_ terminal from the _root_ of your React Native project. Run the following command to start your _Android_ or _iOS_ app:

### For Android

```bash
# using npm
npm run android

# OR using Yarn
yarn android
```

### For iOS

```bash
# using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up _correctly_, you should see your new app running in your _Android Emulator_ or _iOS Simulator_ shortly provided you have set up your emulator/simulator correctly.

This is one way to run your app — you can also run it directly from within Android Studio and Xcode respectively.

## Step 3: Modifying your App

Now that you have successfully run the app, let's modify it.

1. Open `App.tsx` in your text editor of choice and edit some lines.
2. For **Android**: Press the <kbd>R</kbd> key twice or select **"Reload"** from the **Developer Menu** (<kbd>Ctrl</kbd> + <kbd>M</kbd> (on Window and Linux) or <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> (on macOS)) to see your changes!

   For **iOS**: Hit <kbd>Cmd ⌘</kbd> + <kbd>R</kbd> in your iOS Simulator to reload the app and see your changes!

## Congratulations! :tada:

You've successfully run and modified your React Native App. :partying_face:

### Now what?

- If you want to add this new React Native code to an existing application, check out the [Integration guide](https://reactnative.dev/docs/integration-with-existing-apps).
- If you're curious to learn more about React Native, check out the [Introduction to React Native](https://reactnative.dev/docs/getting-started).

# Troubleshooting

If you can't get this to work, see the [Troubleshooting](https://reactnative.dev/docs/troubleshooting) page.

# Learn More

To learn more about React Native, take a look at the following resources:

- [React Native Website](https://reactnative.dev) - learn more about React Native.
- [Getting Started](https://reactnative.dev/docs/environment-setup) - an **overview** of React Native and how setup your environment.
- [Learn the Basics](https://reactnative.dev/docs/getting-started) - a **guided tour** of the React Native **basics**.
- [Blog](https://reactnative.dev/blog) - read the latest official React Native **Blog** posts.
- [`@facebook/react-native`](https://github.com/facebook/react-native) - the Open Source; GitHub **repository** for React Native.

# Quiz App

Welcome to the Quiz App project! This app is designed to provide an interactive learning experience through quizzes. The app supports multiple user roles, including SuperUser, Admin, and regular users, each with different levels of access and functionality.

## Features

- **User Authentication**: Secure login and registration for users.
- **Role-Based Access Control**:
  - **SuperUser**: Can manage all users and assign admin roles.
  - **Admin**: Can create and manage plans, chapters, lessons, topics, and quizzes.
  - **User**: Can view and participate in quizzes.
- **Content Management**:
  - **Plans**: Organized structure for quizzes.
  - **Chapters**: Sub-sections within plans.
  - **Lessons**: Detailed content under chapters.
  - **Topics**: Specific topics under lessons.
- **Quiz Functionality**:
  - Users can take quizzes and view their scores.
- **Messaging System**: Admin can post messages to users.
- **Responsive Design**: Optimized for both mobile and desktop views.

## Requirements

- **Backend**:
  - Node.js
  - Express.js
  - MongoDB
  - bcryptjs
  - jsonwebtoken
  - nodemailer
  - mongoose

- **Frontend**:
  - React Native
  - axios
  - react-navigation
  - jwt-decode
  - react-native-vector-icons

## Installation

### Setup Database - MangoDB
1. Install MangoDB Compass locally
2. Create a Local Database for testing
3. Create a production database at MangoDB atlas: https://www.mongodb.com/products/platform/atlas-database?utm_source=compass&utm_medium=product

### Setup API Server
1. Spin a linex server - I am using lightsail linux server 
2. Install npm and node
#### Update package list
sudo apt update

#### Install Node.js and npm
sudo apt install nodejs npm -y

#### Verify installation
node -v
npm -v

#### Install NodeSource
curl -sL https://deb.nodesource.com/setup_14.x | sudo -E bash -

#### Install Node.js
sudo apt install -y nodejs

#### Install Git
sudo apt install git -y

#### Clone your repository
git clone https://github.com/yourusername/your-repo.git

#### Navigate to your project directory
cd your-repo

#### Install Dependencies
npm install

#### Configure Environment Variables
nano .env

#### Start Your Backend Server
##### Install pm2 globally
sudo npm install -g pm2

##### Start your backend server
pm2 start server.js

##### Save the pm2 process list and corresponding environments
pm2 save

##### Set pm2 to start on system startup
pm2 startup



### Backend

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/quiz-app.git
   cd QuizApp/backend

2. Install all dependencies
npm install

3. setup mangoDB
MONGO_URI=mongodb://localhost:27017/QuizApp
JWT_SECRET=your-secret-key
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-email-password

4. Navigate to backend folder and Start Backend server for API
node server.js

5. Navigate to the QuizApp Folder and run 
npm install
npx react-native link react-native-vector-icons

6. Run the App
npx react-native run-android  # For Android
npx react-native run-ios      # For iOS

