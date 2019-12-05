// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';

const API_ENDPOINT = 'https://snu-web-random-chat.herokuapp.com';

const Chat = ({ text }) => {
    const onSend = (text) => {
        // e.preventDefault();
        fetch(`${API_ENDPOINT}/chats?order=desc`, { // 기본 형식: fetch(url, options)
            method: 'GET',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded', 
              Authorization: `Key ${localStorage.getItem('__key')}`,
            }, // header에 locatlStorage의 값들을 넣어서 POST로 보내
            body: `message=${text}`,
          })
          .then((response) => response.json())
    };
    useEffect(() => {
        

    })
    return (
        <div>
            <form onSubmit={ onSend }> 
                <input type="text" name="chat" placeholder="type message" />
                <input type="submit" value="send" />
            </form>
        </div>
    );
};

export default Chat;

// const TodoForm = ({onCreate}) => {
//     // console.log(onCreate);
//     // const { onCreate } = props; // 함수 파라미터를 props로 받았을 경우
//     const [subject, setSubject] = useState('');
//     const createTodo = (e) => {
//         e.preventDefault();
//         onCreate(subject); // App.js의 onCreate를 호출
//     }
//     const onChangeSubject = (event) => {
//         setSubject(event.target.value); // event.target = 해당 event가 일어난 dom을 얻을 수 있음
//     }
//     return (
//         <form onSubmit={createTodo}>
//             <input type="text" placeholder="enter you todo" value={subject} onChange={onChangeSubject} />
//             <input type="submit" value="create" /> 
//         </form>
//     );
// };