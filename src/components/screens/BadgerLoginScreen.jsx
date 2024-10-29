import { useRef, useState,useEffect } from "react";
import { Alert, Button, StyleSheet, Text, View,TextInput} from "react-native";


function BadgerLoginScreen(props) {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const usernameInputRef = useRef(null)

    useEffect(() => {
        usernameInputRef.current?.focus();
      }, []);

    return <View style={styles.container}>
        <Text style={{ fontSize: 36 }}>BadgerChat Login</Text>

        <Text style={styles.text}>Username</Text>
        <TextInput style={styles.textInput} ref={usernameInputRef} autoCapitalize={'none'} onChangeText={(text) => setUsername(text)}/>

        <Text style={styles.text}>Password</Text>
        <TextInput style={styles.textInput} autoCapitalize={'none'} secureTextEntry onChangeText={(text) => setPassword(text)}/>

        <Button color="crimson" title="Login" onPress={() => {
           //console.log("user:" + username)
           //console.log("pwd:" + password)
            if (!username || !password) {
                Alert.alert("You must provide both a username and password!")
                return;
            } else {
                //Alert.alert("Hmmm...", "I should check the user's credentials!");
                props.handleLogin(username, password)
            }
        }} />
        <Text style={styles.text}>New here?</Text>

        <View style={{flexDirection:'row'}}>
            <Button color="grey" title="Signup" onPress={() => props.setIsRegistering(true)} />
            <View style={{width:15}}></View>
            <Button color="grey" title="CONTINUE AS A GUEST" onPress={() => props.setIsGuestModel(true)} />
        </View>
    </View>;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    textInput: {
        height: 30,
        width:150,
        borderColor: 'gray',
        borderWidth: 0.5,
        padding: 4,
        margin:15
    },
    text: {
        margin:10,
        fontSize: 15
    }
});

export default BadgerLoginScreen;