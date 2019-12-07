// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
// import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
// import LoginForm from './LoginForm'; 다 해놓고 나눠보자~
// import Chat from './Chat';

const API_ENDPOINT = 'https://snu-web-random-chat.herokuapp.com';
class ChatMessage {
  constructor(userName, message, createdAt) {
    this.message = message;
    this.userName = userName;
    const rawTime = new Date(createdAt);
    const hour = rawTime.getHours();
    const minute = rawTime.getMinutes(); 
    const second = rawTime.getSeconds(); 
    this.createdAt = `${hour}:${minute}:${second}` 
  }

  print() { 
    // if (localStorage.getItem('__key') == { myKey }) {
    //   return console.log('myKey')
    // }
    {
    return (
      <div style={{ border: '1px solid black' }}>
        <span style={{ marginRight: '5px', fontWeight: 'bold' }}>{this.userName}</span>
        <span>
          {this.message}
        </span>
        <span style={{ float: 'right' }}>{this.createdAt}</span>
        </div>
    )}
  }
}

export default function App() {
  const [showLoginForm, setShowLoginForm] = useState(true); // 첫 렌더링 시 login 상태 = false;
  const [loginStatus, setLoginStatus] = useState(false);
  const [messageList, setMessageList] = useState([]);
  const [name, setName] = useState(null);
  const [chatText, setChatText] = useState(null);
  const onLogin = (e) => {
    e.preventDefault();
    if (!name) {
      return alert('input your name');
    }
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
    .then(({ key }) => {
      console.log(key);
      if (key) {
        localStorage.setItem('__key', key); // setItem(key, value);
      }
    })
    .catch((err) => console.error(err));
  };
  useEffect(() => { // 채팅 가져오기(ComponentDidMount 시 채팅 목록을 보여줌)
    fetch(`${API_ENDPOINT}/chats?order=desc`)
      .then((res) => res.json())
      .then((messages) => { 
        // console.log(messages[messages.length - 1]); // 마지막 메시지 콘솔창에 출력
        // const reversedList = messages.reverse()
        setMessageList(
          messages.sort(function(a,b) 
          { return a.createdAt < b.createdAt ? -1 : a.createdAt > b.createdAt ? 1 : 0 }).map((message) => new ChatMessage(message.userName, message.message, message.createdAt))
        );
      });
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
      // if (key) {
      //   localStorage.setItem('__key', key); // setItem(key, value);
      // }
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

  // async getNewChat() {
  //   await getNewChat();
  // }

  // const getNewChat = () => {
  //   fetch(`${API_ENDPOINT}/chats?order=desc`, {
  //     method: 'GET',
  //     headers: {
  //       'Content-Type': 'application/x-www-form-urlencoded', 
  //       'Authorization': `Key ${localStorage.getItem('__key')}`,
  //     }, 
  //     body: `message=${chatText}`,
  //   }) // 방금 보낸 채팅 바로 출력 
  //   .then((res) => res.json())
  //   .then((messages) => {
  //     console.log(messages[messages.length - 1]); // 마지막 메시지 콘솔창에 출력
  //     setMessageList(
  //     messages.map((message) => new ChatMessage(message.name, message.message, message.createdAt)),
  //     );
  //   });
  // }

  if ( !loginStatus ) {
    if ( showLoginForm ) { // 1. 아직 로그인 안 한 상태, 로그인 버튼 
      return (
        <div>
          Chat Program.
          <button onClick={() => setShowLoginForm(false)}>LogIn</button>
          <div className="chatList" style={{ padding: '20px' }}>
            { messageList.map((message) => message.print()) }
          </div>
        </div>
      ) 
    } else { // 2. 로그인 버튼 누른 후 로그인 폼 등장 QQ. 여기 login input의 value로 들어온 id는 어떻게 fetch로 보내지?
      // 여기서만 reverse map이 먹히는 이유?
        return (
          <div>
            Chat Program.
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
            Chat Program.
            <button onClick={() => [ setLoginStatus(false), setShowLoginForm(false) ]}>LogOut</button> 
            <div className="chatList" style={{ padding: '20px' }}>
                {messageList.map((message) => message.print())}
            </div>     
            <form onSubmit={sendChat}> 
              <input type="textarea" name="chat" placeholder="type message" onChange={(e) => setChatText(e.target.value)}/> 
              <input type="submit" value="send" />
            </form>
          </div>
        )
      }
    }

// 이런 코드도! 
// let button = null;
//     if (isLoggedIn) {
//       button = <LogoutButton onClick={this.handleLogoutClick} />;
//     } else {
//       button = <LoginButton onClick={this.handleLoginClick} />;
//     }
 
//     return (
//       <div>
//         <Greeting isLoggedIn={isLoggedIn} />
//         {button}
//       </div>
//     );
// 출처: https://blog.sonim1.com/180 [Kendrick's Blog]