// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
// import $ from "jquery";
// import jQuery from "jquery";
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
// import Icon from '@material-ui/core/Icon';
// import AccountCircleIcon from '@material-ui/icons/AccountCircle';
// import { send } from 'q';

// window.$ = window.jQuery = jQuery;

const API_ENDPOINT = 'https://snu-web-random-chat.herokuapp.com';
class ChatMessage {
  constructor(userName, message, createdAt) {
    // this.userId = userId;
    this.message = message;
    this.userName = userName;
    const rawTime = new Date(createdAt);
    const hour = rawTime.getHours();
    const minute = rawTime.getMinutes(); 
    const second = rawTime.getSeconds(); 
    this.createdAt = `${hour}:${minute}:${second}` 
  }

  print() { 
    if (this.userName === localStorage.getItem('username')) { // key나 id로 하면 좋을텐데 userName으로 임시방편
      return (
        <div>
          <span style={{ marginRight: '5px', color: "white", fontWeight: 'bold', backgroundColor: "orange", borderRadius: "5px"}}>{this.userName}</span>
          <div style={{ border: '1px solid orange', textAlign: 'right', margin: "5px", padding: "2px", borderRadius: "5px", display: "inline-block"}}>
            <span>
              {this.message}
            </span> 
          </div>  
          <span style={{ color: "grey" }}>{this.createdAt}</span>
        </div>
      )
    }
    {
      return (
        <div>
          <span style={{ marginRight: '5px', fontWeight: 'bold' }}>{this.userName}</span>
          <div style={{ border: '1px solid black', textAlign: 'left', margin: "5px", padding: "2px", borderRadius: "5px", display: "inline-block"}}> 
            <span>
              {this.message}
            </span>
          </div>
          <span style={{ color: "grey" }}>{this.createdAt}</span>
        </div>
      )
    }
  }
}

const useStyles = makeStyles(theme => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
      width: 200,
    },
  },
  button: {
    margin: theme.spacing(1),
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

export default function App() {
  const classes = useStyles();
  const [showLoginForm, setShowLoginForm] = useState(true); // 첫 렌더링 시 login 상태 = false;
  const [loginStatus, setLoginStatus] = useState(false);
  const [messageList, setMessageList] = useState([]);
  const [name, setName] = useState(null);
  const [chatText, setChatText] = useState(null);
  const [open, setOpen] = React.useState(false);
  const sendForm = document.getElementById("sendForm");
  const chatBox = document.getElementById("chatBox");
  const sendButton = document.getElementById("sendButton");
  
  const onLogin = (e) => {
    e.preventDefault();
    if (!name) {
      return alert('input your name');
    }
    localStorage.setItem('username', name);
    setLoginStatus(true)
    fetch(`${API_ENDPOINT}/login`, { // 로그인 // 기본 형식: fetch(url, options)
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded', 
        'Authorization': `Key ${localStorage.getItem('__key')}`,
      }, // header에 locatlStorage의 값들을 넣어서 POST로 보냄
      body: `name=${name}`,
    })
    .then((response) => response.json()) // fetch는 response 객체에 json을 호출하여 json 객체를 반환
    .then(({ key }) => { // 파라미터에 _id
      console.log(key); // 파라미터에 _id
      if (key) {
        localStorage.setItem('__key', key); // setItem(key, value);
      }
    })
    .catch((err) => console.error(err));
  };
  useEffect(() => {
    const interval = setInterval(() => {
      fetch(`${API_ENDPOINT}/chats?order=desc`)
      .then((res) => res.json())
      .then((messages) => { 
        console.log(messages[messages.length - 1]); // 마지막 메시지 콘솔창에 출력
        setMessageList(
          messages.sort(function(a,b) 
          { return a.createdAt < b.createdAt ? -1 : a.createdAt > b.createdAt ? 1 : 0 }).map((message) => new ChatMessage(message.userName, message.message, message.createdAt))
        );
      });
      }, 3000);
      return () => clearInterval(interval);    
    }, []);

  // useEffect 에서 설정한 함수가 컴포넌트가 화면에 가장 처음 렌더링될 때만 실행되고 업데이트 할 경우에는 실행 할 필요가 없는 경우엔 함수의 두번째 파라미터로 비어있는 배열을 넣어줌
  const sendChat = async (e) => {
    e.preventDefault();    
   
    await fetch(`${API_ENDPOINT}/chats?order=desc`, { // 채팅 보내기
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded', 
        'Authorization': `Key ${localStorage.getItem('__key')}`,
      }, 
      body: `message=${chatText}`,
    })
    .then((response) => response.json()) // fetch는 response 객체에 json을 호출하여 json 객체를 반환
    .then((body) => {
      console.log(body);
    })
    .catch((err) => console.error(err));
    
    fetch(`${API_ENDPOINT}/chats?order=desc`)
    .then((res) => res.json())
    .then((messages) => { 
      setMessageList(
        messages.sort(function(a,b) 
        { return a.createdAt < b.createdAt ? -1 : a.createdAt > b.createdAt ? 1 : 0 }).map((message) => new ChatMessage(message.userName, message.message, message.createdAt))
      );
    });
  }

    const handleOpen = () => {
      setOpen(true);
    };

    const handleClose = () => {
      setOpen(false);
    };
    
  if ( !loginStatus ) {
    if ( showLoginForm ) { // 1. 아직 로그인 안 한 상태, 로그인 버튼 
      return (
        <div>
          <button onClick={() => setShowLoginForm(false)}>LogIn</button>
          <div className="chatList" style={{ padding: '20px' }}>
            { messageList.map((message) => message.print()) }
          </div>
        </div>
      ) 
    } else { // 2. 로그인 버튼 누른 후 로그인 폼 등장
        return (
          <div>
            <form onSubmit={onLogin}>
              <input type="text" name="name" placeholder="type your name" onChange={(e) => setName(e.target.value)} />
              <input type="submit" value="login" />
            </form>
            <div className="chatList" style={{ padding: '20px' }}>
              { messageList.map((message) => message.print()) }
            </div>            
          </div>
        )
      }
    } else { // 3. 로그인된 상태. 로그아웃버튼을 보여줌
        return (
          <div>
            <span>{name}님, 안녕하세요.</span>
            <button onClick={() => [ setLoginStatus(false), setShowLoginForm(false) ]}>LogOut</button> 
            <div className="chatList" style={{ padding: '20px' }}>
                {messageList.map((message) => message.print())}
            </div>     

            {/* <form id="sendForm" onSubmit={ sendChat }> 
              <textarea id="chatBox" type="text" name="chat" placeholder="type message" onChange={(e) => setChatText(e.target.value)}/> 
              <input id="sendButton" type="submit" value="send" />
            </form> */}

            {/* { $("#chatBox").keydown(function(e) {
                if (e.keyCode === 13 && !e.shiftKey) {
                  $("#sendForm").submit();
                  e.preventDefault();
                }
              })
            } */}

            <form className={classes.root} noValidate autoComplete="off" onSubmit={sendChat}>
                <TextField id="standard-basic" label="type message" onChange={(e) => setChatText(e.target.value)} />
                <Button type="submit" variant="contained" color="primary" className={classes.button} >
                 Send
                </Button>
            </form>

          </div>
        )
      }
    }
