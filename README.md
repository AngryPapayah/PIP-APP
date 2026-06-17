PIP-APP
A comprehensive mobile learning application built with React Native and Expo. PIP-APP features a modular course structure, interactive lessons, user authentication, a customizable profile system, and an engaging "Hamsterverse" gamification element.

Features
Authentication System: Secure login and signup flows with dedicated state management.

Modular Learning System: View courses, dive into specific modules, and complete interactive lessons.

Interactive Assessments: Built-in screens for multiple-choice questions, swipeable cards, and dynamic result tracking.

Gamification ("Hamsterverse"): A unique, interactive user dashboard and progression system featuring XP tracking and visual rewards.

App Walkthroughs: Integrated guided tours for new users using react-native-copilot.

Multi-language Support: Built-in localization and language context.

Robust Navigation: Complex routing utilizing stack, drawer, and bottom-tab navigators.

Tech Stack
Framework: React Native (v0.81.5)

Platform: Expo (SDK 54.0.0)

Navigation: React Navigation v7 (Native, Stack, Drawer, Bottom Tabs, Material Top Tabs)

State Management: React Context API (Auth, Loading, Language, Filters)

Storage: @react-native-async-storage/async-storage

Animations: react-native-reanimated, react-native-gesture-handler, and custom Text Animations.

Onboarding: react-native-copilot

Project Structure
The project follows a feature-first, scalable directory structure:

Plaintext
PIP-APP/
├── src/
│   ├── components/      # Reusable UI elements (Buttons, ProgressBars, SwipeCards, XPBar)
│   │   └── animations/  # Custom animations (e.g., TextAnimation, Typewriter)
│   ├── constants/       # App-wide constants (e.g., PipMessages)
│   ├── contexts/        # Global state providers (Auth, Language, Loading, Filter)
│   ├── navigation/      # React Navigation configurations (Stack, Drawer, Tabs)
│   ├── screens/         # Top-level screen components
│   │   ├── courses/     # Nested course, module, and lesson screens
│   │   ├── HamsterverseScreen.js
│   │   ├── QuestionsScreen.js
│   │   ├── ResultScreen.js
│   │   └── ...
│   ├── services/        # API calls and external integrations (Fetch.js)
│   └── styles/          # Global styles and theme configurations
├── App.js               # Application entry point & Root Providers
├── app.json             # Expo configuration and manifest
└── package.json         # Project dependencies and scripts
Prerequisites
Before you begin, ensure you have the following installed:

Node.js (v18 or newer recommended)

npm or Yarn

Expo CLI

Expo Go app installed on your physical device (iOS/Android), or an emulator/simulator setup on your machine.

Installation & Setup
Clone the repository:

Bash
git clone https://github.com/your-username/PIP-APP.git
cd PIP-APP
Install dependencies:

Bash
npm install
# or
yarn install
Environment Variables:
Create a .env file in the root directory based on the project requirements (if any specific API keys are required for Fetch.js).

Start the development server:

Bash
npx expo start
Note: This project strictly relies on Expo SDK v54.0.0. Refer to the Expo v54 Documentation before making structural changes to the build.

🗺 Navigation Architecture
The app uses a layered navigation approach managed in App.js and the src/navigation/ directory:

Auth Stack: Handles LoginScreen and SignupScreen. Users are restricted to this stack until authenticated.

Main App (Drawer & Tabs): Once authenticated, the user enters the MainDrawerNavigator.

Content Stack: Deep-linked screens like LessonsList, QuestionsScreen, and ResultScreen are layered over the main layout for a focused learning experience.

State Management (Contexts)
Global state is managed via React's Context API to keep the app lightweight and avoid prop-drilling:

AuthContext: Manages user sessions, login state, and tokens.

LoadingContext: Controls the global LoadingScreen overlay to prevent UI interaction during heavy data fetches.

LanguageContext: Handles localization preferences.

FilterContext: Manages user filtering preferences for courses and content.

UI & Components
The application relies on highly reusable custom components found in src/components/:

Interactive: MultipleChoice, SwipeCard, CustomButton

Feedback/Progress: ProgressBar, XPBar, TextBubble

Animations: Specialized typewriter effects and transition animations are implemented in TextAnimation.js and are often wrapped in react-native-reanimated for native 60fps performance.

Contributing
Fork the Project

Create your Feature Branch (git checkout -b feature/AmazingFeature)

Commit your Changes (git commit -m 'Add some AmazingFeature')

Push to the Branch (git push origin feature/AmazingFeature)

Open a Pull Request