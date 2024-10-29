import { useEffect, useState } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';

import CS571 from '@cs571/mobile-client'
import * as SecureStore from 'expo-secure-store';
import BadgerChatroomScreen from './screens/BadgerChatroomScreen';
import BadgerRegisterScreen from './screens/BadgerRegisterScreen';
import BadgerLoginScreen from './screens/BadgerLoginScreen';
import BadgerLandingScreen from './screens/BadgerLandingScreen';
import BadgerLogoutScreen from './screens/BadgerLogoutScreen'
import BadgerConversionScreen from './screens/BadgerConversionScreen'
import { Alert } from 'react-native';



const ChatDrawer = createDrawerNavigator();

export default function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isRegistering, setIsRegistering] = useState(false);
  const [chatrooms, setChatrooms] = useState([]);
  const [isGuestModel, setIsGuestModel] = useState(false)

  useEffect(() => {
    fetch('https://cs571.org/api/s24/hw9/chatrooms',{
      method:"GET",
      headers: {
        "X-CS571-ID": CS571.getBadgerId(),
        "Content-Type": "application/json"
      }}
      )
      .then(res => res.json())
      .then(data => setChatrooms(data))
  }, []);

  
  function save(key, value) {
    SecureStore.setItemAsync(key, value).then(() => {
      Alert.alert("Secure Storage", "Saved a value to '" + key + "'");
    });
  }


  function handleLogin(username, password) {

    if (!username || !password) {
        Alert.alert("You must provide both a username and password!")
        return;
    } else {
        fetch(`https://cs571.org/api/s24/hw9/login`,{
          method:"POST",
          headers: {
            "X-CS571-ID": CS571.getBadgerId(),
            "Content-Type": "application/json"
          },
          body:JSON.stringify({
            username: username,
            password: password
          })
        })
        .then(res => {
          if (res.status === 200) {
            return res.json()
          } else {
            throw new Error('login unsuccessfully')
          }
        })
        .then(data=> {
            console.log("login info: " + data)
            save('token', data.token)
            save('username',username)
            // hmm... maybe this is helpful!
            setIsLoggedIn(true); // I should really do a fetch to login first!
        })
        .catch(error => {
          Alert.alert('Incorrect username or password!');
        })
    }
  }

  function handleSignup(username, password, confirmPwd) {
    if (!username || !password) {
      Alert.alert("You must provide both a username and password!")
      return;
    } else if (password !== confirmPwd) {
      Alert.alert("Your passwords do not match!")
      return
    } else {
      fetch(`https://cs571.org/api/s24/hw9/register`,{
        method:"POST",
        headers: {
          "X-CS571-ID": CS571.getBadgerId(),
          "Content-Type": "application/json"
        },
        body:JSON.stringify({
          username: username,
          password: password
        })
      })
      .then(res => {
        if (res.status === 200) {
          return res.json()
        } else {
          throw new Error('register unsuccessfully')
        }
      })
      .then(data=> {
          console.log("register info: " + data)
          save('token', data.token)
          save('username',username)
          setIsRegistering(false)
          // hmm... maybe this is helpful!
          setIsLoggedIn(true); // I should really do a fetch to register first!
      })
      .catch(error => {
        Alert.alert('That username has already been taken!');
      })
    }
  }

  const handleLogout = ()=> {
    SecureStore.deleteItemAsync('token').then(() => { 
        SecureStore.deleteItemAsync('username').then(() =>{
        Alert.alert("Log out", "You have been logged out")
        setIsLoggedIn(false)
        })
    })
  }

  if (isLoggedIn || isGuestModel) {
    return (
      <NavigationContainer>
        <ChatDrawer.Navigator>
          <ChatDrawer.Screen name="Landing" component={BadgerLandingScreen} />
          {
            chatrooms.map(chatroom => {
              return <ChatDrawer.Screen key={chatroom} name={chatroom}>
                {(props) =>{ 
                    //console.log(props);
                    //props is default pass to BadgerChatroomScreen
                    return <BadgerChatroomScreen  name={chatroom} isGuest={isGuestModel}/>
                  }
                }
              </ChatDrawer.Screen>
            })
          }
          {

          !isGuestModel ? <ChatDrawer.Screen name="Logout">
                {(props) =>{ 
                    return <BadgerLogoutScreen name="Logout" handleLogout={handleLogout}/>
                  }
                }
          </ChatDrawer.Screen>
          :
          <ChatDrawer.Screen name="Signup">
                {(props) =>{ 
                    return <BadgerConversionScreen name="Signup" setIsRegistering={setIsRegistering} setIsGuestModel={setIsGuestModel}/>
                  }
                }
          </ChatDrawer.Screen>
          }
        </ChatDrawer.Navigator>
      </NavigationContainer>
    );
  } else if (isRegistering) {
    return <BadgerRegisterScreen handleSignup={handleSignup} setIsRegistering={setIsRegistering} />
  } else {
    return <BadgerLoginScreen handleLogin={handleLogin} setIsRegistering={setIsRegistering} setIsGuestModel={setIsGuestModel}/>
  }
}