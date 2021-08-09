
import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import Fab from '@material-ui/core/Fab';
import SendIcon from '@material-ui/icons/Send';
import { isIterableArray } from '../common/utils';
import { w3cwebsocket as W3CWebSocket } from "websocket";

const useStyles = makeStyles({
    table: {
        minWidth: 650,
    },
    chatSection: {
        width: '100%',
        height: '100%'
    },
    headBG: {
        backgroundColor: '#e0e0e0'
    },
    borderRight500: {
        borderRight: '1px solid #e0e0e0'
    },
    messageArea: {
        height: '70vh',
        overflowY: 'auto'
    }
});

const Chatapp = () => {
    const classes = useStyles();

   
    const [groupList, setGroupList] = React.useState([]);
    const [messageList, setMessageList] = React.useState([]);
    const [loggedInUser, setLoggedInUser] = React.useState(null);
    const [selectedGroup, setSelectedGroup] = React.useState(0);
    const [client, setClient] = React.useState(null);
    const [msgValue, setMsgValue] = React.useState('');


    useEffect(() => {
        setLoggedInUser('test');
        setGroupList([{ 'id': 1, 'group_name': 'test' }, { 'id': 2, 'group_name': 'test2' }])
        console.log(selectedGroup)
    }, []);

    useEffect(() => {
        console.log('hey')
        setMessageList([{ 'id': 1, 'message': 'link1', 'from_user': 'test2', 'time': '11:23' }, { 'id': 2, 'message': 'link2', 'from_user': 'test', 'time': '11:23' }])
    }, [])

    var count = 3
    useEffect(()=>{
        console.log('erw',...messageList);
        if(client)
        {
            client.onopen = () => {
            console.log('WebSocket Client Connected');
          };
        client.onmessage = (message) => {
        const dataFromServer = JSON.parse(message.data);
        console.log('got reply! ', dataFromServer.type);

        if (dataFromServer) {
            // this.setState((state) =>
            // ({
            //     messages: [...state.messages,
            //     {
            //     msg: dataFromServer.message,
            //     name: dataFromServer.name,
            //     }]
            // })
            // );
            console.log(dataFromServer)
            // setMessageList([...messageList, {'id':dataFromServer.id,'message':dataFromServer.message,'from_user':dataFromServer.username, 'time': '11:23'}])
            
            setMessageList(messageList => [...messageList, {'id':count+1,'message':dataFromServer.message,'from_user':dataFromServer.username, 'time': '11:23'}])
            // setMessageList
            console.log(messageList)
        }
        };
    }
    },[client])

    useEffect(()=>{
        console.log('messageList',messageList)
    },[messageList])

    const onButtonClicked = (e) => {
        console.log('wd')
        client.send(JSON.stringify({
          type: "message",
          message: msgValue,
          username: loggedInUser
        }));
        setMsgValue('')
        e.preventDefault();
      }

    const handleGroupListItemClick = (event, index) => {
        console.log(index)
        setSelectedGroup(index);
        setClient(new W3CWebSocket('ws://127.0.0.1:8000/ws/chat/test/'));
        
    };

    return (
        <React.Fragment>
            <Grid container component={Paper} className={classes.chatSection}>
                <Grid item xs={3} className={classes.borderRight500}>
                    <List>
                        <ListItem button key="RemySharp">
                            <ListItemIcon>
                                <Avatar alt="Remy Sharp" src="https://material-ui.com/static/images/avatar/1.jpg" />
                            </ListItemIcon>
                            <ListItemText primary="John Wick"></ListItemText>
                        </ListItem>
                    </List>
                    <Divider />
                    <Grid item xs={12} style={{ padding: '10px' }}>
                        <TextField id="outlined-basic-email" label="Search" variant="outlined" fullWidth />
                    </Grid>
                    <Divider />
                    <List>
                        {isIterableArray(groupList) && groupList.map((group, index) => {
                            // console.log(group)
                            return (
                                <ListItem
                                    button
                                    key={group['id']}
                                    selected={selectedGroup === group['id']}
                                    onClick={(event) => { handleGroupListItemClick(event, group['id']); console.log('heyy') }}
                                >
                                    <ListItemIcon>
                                        <Avatar alt={group['group_name']} src="https://material-ui.com/static/images/avatar/1.jpg" />
                                    </ListItemIcon>
                                    <ListItemText primary={group['group_name']}>{group['group_name']}</ListItemText>
                                </ListItem>
                            )
                        }
                        )}

                    </List>
                </Grid>
                {selectedGroup !== 0 ?
                    <Grid item xs={9}>
                        <List className={classes.messageArea}>
                            {isIterableArray(messageList) && messageList.map((message, index) => {
                                // console.log(message)
                                return (
                                    <ListItem key={index}>
                                        <Grid container>
                                            <Grid item xs={12}>
                                                <ListItemText align={loggedInUser === message['from_user'] ? "right" : "Left"} primary={message['message']}></ListItemText>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <ListItemText align={loggedInUser === message['from_user'] ? "right" : "left"} secondary={message['time']}></ListItemText>
                                            </Grid>
                                        </Grid>
                                    </ListItem>
                                )
                            }
                            )}
                        </List>
                        <Divider />
                        <Grid container style={{ padding: '20px' }}>
                            <Grid item xs={11}>
                                <TextField 
                                id="outlined-basic-email" 
                                label="Type Something" 
                                fullWidth 
                                value={msgValue}
                                onChange={e => {
                                setMsgValue(e.target.value)
                                }}
                                />
                            </Grid>
                            <Grid item xs={1} align="right">
                                <Fab color="primary" aria-label="add" onClick={(event)=>{onButtonClicked(event)}}><SendIcon /></Fab>
                            </Grid>
                        </Grid>
                    </Grid>
                    : <></>}
            </Grid>
        </React.Fragment>
    );
}

export default Chatapp;