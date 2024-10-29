import { useRef, useState } from "react";
import { Alert, Button, StyleSheet, Text, View, TextInput } from "react-native";

function BadgerRegisterScreen(props) {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPwd, setConfirmPwd] = useState('')

    //username:test12345678!!,12345678!!
    //password:p@ssw0rd1

    //console.log("pwd: " + password)
    //console.log("conPwd: " + confirmPwd)


    return <View style={styles.container}>
        <Text style={{ fontSize: 36 }}>Join BadgerChat!</Text>

        <Text style={styles.text}>Username</Text>
        <TextInput style={styles.textInput}  autoCapitalize={'none'} onChangeText={(text) => setUsername(text)}/>

        <Text style={styles.text}>Password</Text>
        <TextInput style={styles.textInput} autoCapitalize={'none'} secureTextEntry onChangeText={(text) => setPassword(text)}/>
        
        <Text style={styles.text}>Confirm Password</Text>
        <TextInput style={styles.textInput} autoCapitalize={'none'} secureTextEntry onChangeText={(text) => setConfirmPwd(text)}/>
        
        {
            !password ? <Text style={{color:"red", margin:10}}>Please enter a password</Text> : <></>
        }
        {
            (password === confirmPwd) || !password ? <></> : <Text style={{color:"red",margin:10}}>Passwords do not match</Text>
        }


        <View style={{flexDirection:'row'}}>
            <Button color="crimson" title="Signup" onPress={() =>props.handleSignup(username, password,confirmPwd)} />
            <View style={{ width: 10 }} /> 
            <Button color="grey" title="Nevermind!" onPress={() => props.setIsRegistering(false)} />
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

export default BadgerRegisterScreen;