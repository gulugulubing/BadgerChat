import { useEffect,useState } from "react";
import { Alert, Button, Text } from "react-native";
import BadgerCard from "./BadgerCard"
import CS571 from '@cs571/mobile-client'
import * as SecureStore from 'expo-secure-store';
function BadgerChatMessage(props) {

    const dt = new Date(props.created);
    const [username, setUsername] = useState('')

    useEffect(() => {
        SecureStore.getItemAsync('username').then(result => {
            if (result) {
              setUsername(result)
            };
        })
    },[])

    const handleDelete = () => {
        SecureStore.getItemAsync('token').then(result => {
        //console.log("id:" + props.id)
           fetch(`https://cs571.org/api/s24/hw9/messages?id=${props.id}`,{
               method:"DELETE",
               headers: {        
                   "X-CS571-ID": CS571.getBadgerId(),
                   "Authorization": "Bearer " + result
                 },
           }).then(res => {
                //console.log("status: " + res.status)
                return res.json()
            }).then(data => {
               Alert.alert('Alert', data.msg)
               props.refresh()
           }).catch(error => console.error(error))
        })
    }

    return <BadgerCard style={{ marginTop: 16, padding: 8, marginLeft: 8, marginRight: 8}}>
        <Text style={{fontSize: 28, fontWeight: 600}}>{props.title}</Text>
        <Text style={{fontSize: 12}}>by {props.poster} | Posted on {dt.toLocaleDateString()} at {dt.toLocaleTimeString()}</Text>
        <Text></Text>
        <Text>{props.content}</Text>
        {
            username === props.poster ? <Button color="crimson" title="Delete" onPress={handleDelete}/> : <></>
        }
    </BadgerCard>
}

export default BadgerChatMessage;