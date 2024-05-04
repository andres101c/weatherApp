===========================================
	     PROJECT STRUCTURE
===========================================

ROOT DIRECTORY

- The root directory for our application contains the main App.js that is setting up our application's stack navigator so that we can go to different screens and go back to previous pages. We can also pass in information to routes using props, which were used for the authenticated screen when we log in, we pass in user information. We also include our package and app json files so that the app has its proper dependencies and setups.

ASSETS

- Assets is where we hold image graphics such as icons and backgrounds for our application. The icons folder contains two images that are used alongside a location's air and UV conditions. The backgrounds folder is used as the image background for a location that matches the current weather or time of day. In the root folder we also have a logo for the application and its loading state. 

SCREENS

- Screens is where we hold the rest of our js files which make up the screens in the stack navigator. AuthScreen is where we handle user logins and sign ups which will navigate to the authenticated screen which allows users to enter zipcodes. This screen can navigate back to the previous screen if logging out or will navigate forward to the zipscreen which has all the weather info for a location when tapping on the zip item component. Screens also holds the zip item component which is just how we hold and display our CRUD operations as a GUI component to users. 

FIREBASE

- To store our registered users and all of the information they hold for this application, we used firebase. When logging in or creating an account, we make sure we authorize the app to be used with firebase with config code and the API key and call predefined functions from the firebase package. These predefined signing in/ up functions allow us to create and save users to our firebase database in the authentication tab. Each user has an ID which will be used as individual documents in the firestore database. This database is where we store the zip codes for each user which are built as an array of objects. The object being a zipcode and an ID to get the specific index in the zipcode stack. We built CRUD operations for the zipcodes to allow each user to modify and access their stack of zip codes whenever they want. Firebase also allows us to have persistent logins where the authentication state for a user is saved on the device, meaning there is no need for a user to log in every time they restart the application.


===========================================
	   INSTALL INSTRUCTIONS
===========================================

1. Make sure that Node.JS is downloaded so that you are able to install the necessary packages for our program and run it
2. Also make sure that "Expo Go" is installed on your mobile device if you are going to use the application on a physical device
3. Download the zip file that our project is compressed in and extract the files to any location on your computer
4. Open a terminal/command prompt on your computer and set the path to the same location as the project folder
5. Enter the command "npm install" to download all of the project packages, if any issues occur stopping the download, try adding "--force" at the end of the command
6. Enter the command "npx expo start" to run the project and scan the QR code with your mobile device to open and use the mobile device
7. Alternatively, if you are going to use the project with an emulator, follow the expo instructions in your terminal/command prompt to run on either an android or IOS emulated device

===========================================
	      USAGE GUIDELINES
===========================================

SIGNING UP / LOGGING IN

- Assuming this is the first time you have used the application, you are going to need to create an account so that you are authenticated in our database and authorized to use the features in our weather app. In the main sign in form, tap on the text that asks if you do not have an account, sign up. This will prompt the user with a form to enter a valid email address and password to use for this app. Keep in mind that there is proper validation for these forms so you need to have proper format when entering an email and the password needs to be greater than 6 characters or else you cannot make an account. Signing in is a similar process with a form asking you to input a valid email and password but these need to be existing accounts stored in our firebase authenticated use list. If the information you place is not valid or does not exist you will get a message telling you what is wrong and be asked to try again. 

ZIPCODES STACK

- Once you sign in/sign up, you are presented with the zipcodes stack screen. When logged in, restarting the application will bring you to this screen now meaning you do not have to always log in on startup. This is a page where a form prompts a user to enter a valid zip code to be added to a list/stack. These zip codes can be deleted from the list and the zip code itself can be edited by pressing their corresponding buttons. This screen also allows you to log out of your account and will bring you back to the sign up/login screen. You can also swipe on your screen to log out or press the navigation header on the top left to log out. 

ZIPCODE SCREEN

- In the zipcodes stack, pressing on the zipcode button itself in the list of zipccodes will present you with a new screen. This will show you quite a bit of information about the location you entered such as the name of the location, what state it is located in, the time and weather. The screen also contains a heat and air advisory meter to let people know if the air quality or sun is too dangerous. A button also appears on this screen to allow users to have clothing options suggested to them based on the current weather at that location right now. A user can swipe on the screen to return to the zipcodes stack once they are done viewing the weather and clothing suggestions

===========================================
	      CHANGES
===========================================

- Added title of app to sign in screen