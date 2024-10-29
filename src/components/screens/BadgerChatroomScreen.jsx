import { useEffect, useState } from "react";
import { StyleSheet, Text, View, TextInput, FlatList, Pressable, Modal,Button,Alert } from "react-native";
import CS571 from '@cs571/mobile-client'
import BadgerChatMessage from "../helper/BadgerChatMessage"
import * as SecureStore from 'expo-secure-store';



function BadgerChatroomScreen(props) {
    const[messages, setMessages] = useState([])
    const [isLoading, setIsLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [title, setTitle] = useState('')
    const [body, setBody] = useState('')


    const refresh = ()=>{
        setIsLoading(true);       
        fetch(`https://cs571.org/api/s24/hw9/messages?chatroom=${props.name}`,{
            method:"GET",
            headers: {
              "X-CS571-ID": CS571.getBadgerId(),
              "Content-Type": "application/json"
            }}
        )
        .then(res => res.json())
        .then(data => {
            setMessages(data.messages)
            setIsLoading(false);
        })        
    }

    useEffect(() => {
        refresh()
    },[])

    const addPost = (token) => {
        fetch(`https://cs571.org/api/s24/hw9/messages?chatroom=${props.name}`,{
            method:"POST",
            headers: {
              "X-CS571-ID": CS571.getBadgerId(),
              "Content-Type": "application/json",
              "Authorization": "Bearer " + token
            },
            body : JSON.stringify({
              title: title,
              content: body
            })
          }).then(res => res.json()).then(data => {
            if (Object.keys(data).length > 1) {
                Alert.alert('Successfully Posted', data.msg)
                setModalVisible(false)
                refresh()
            } else {
                Alert.alert('Post Failure', data.msg)
            }
          })
    }

    function getTokenToPost() {
        SecureStore.getItemAsync('token').then(result => {
          //console.log("token: "+ result)
          if (result) {
            addPost(result)
          } else {
            Alert.alert('Secure Storage', 'you must login in');
            return
          }
        });
    }


    return <View style={{ flex: 1 }}>
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
                Alert.alert('Adding window has been closed.');
                setModalVisible(false);}
            }
        >
            <View style={styles.modelView}>
                <Text style={{fontSize: 30,left:-60}}>Create A Post</Text>
                <View style={{height:20}}></View>
                <Text  style={{fontSize: 20,left:-130}}> Title </Text>
                <TextInput style={styles.textInput}  autoCapitalize={'none'} onChangeText={(text) => setTitle(text)}/>
                <Text style={{fontSize: 20,left:-130}}> Body </Text>
                <TextInput style={[styles.textInput,{height:80}]}   autoCapitalize={'none'} onChangeText={(text) => setBody(text)}/>

                <View style={{flexDirection:'row'}}>
                    <Button color="crimson" title="CREATE POST"  disabled={!title || !body} onPress={getTokenToPost}/>
                    <View style={{ width: 10 }} /> 
                    <Button color="grey" title="CANCEL" onPress={()=>{
                        setModalVisible(false);
                        setBody('');
                        setTitle('')}}/>
                </View>
            </View>
        </Modal>

        <FlatList style={{flex: 1, backgroundColor: modalVisible ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.0)'}}
            data={messages}
            onRefresh={refresh}
            refreshing={isLoading}
            keyExtractor={m => m.id}//same as map's key
            renderItem={(renderObj) => <BadgerChatMessage {...renderObj.item} refresh={refresh}/>}
        >
        </FlatList>
       
        <Pressable onPress={() => setModalVisible(true)} disabled={props.isGuest}>
            <Text style={styles.bottomButton}>ADD POST</Text>
        </Pressable>
    </View>
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    bottomButton:{
        backgroundColor:'#4b0000', 
        textAlign:'center', 
        color: 'white',
        fontWeight: 'bold',
        fontSize:20
    },
    modelView: {
        marginTop:200,
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    textInput: {
        height: 30,
        left:-50,
        width:200,
        borderColor: 'gray',
        borderWidth: 2,
        padding: 4,
        margin:15,
        borderRadius: 10,
    },
});

export default BadgerChatroomScreen;