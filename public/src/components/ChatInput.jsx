import React, { useState } from 'react';
import styled from 'styled-components';
import { IoMdSend } from 'react-icons/io';

function ChatInput({ handleSendMsg }) {
  const [msg, setMsg] = useState('');

  const sendChat = (event) => {
    event.preventDefault();
    if (msg.length > 0) {
      handleSendMsg(msg);
      setMsg('');
    }
  };

  return (
    <Container>
      <form className="input-container" onSubmit={(event) => sendChat(event)}>
        <input type="text" placeholder="type your message here" onChange={(e) => setMsg(e.target.value)} value={msg} />
        <button type="submit">
          <IoMdSend />
        </button>
      </form>
    </Container>
  );
}

const Container = styled.div`
  display: grid;
  align-items: center;
  grid-template-columns: 5% 95%;
  background-color: #e7effa;
  padding: 0 2rem;
  @media screen and (min-width: 720px) and (max-width: 1080px) {
    padding: 0 1rem;
    gap: 1rem;
  }

  .input-container {
    width: 2000%;
    border-radius: 2rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.8rem;
    border-radius: 1.5rem;
    gap: 1.5rem;
    background-color: #f8f8f8;
    box-sizing: border-box;
    input {
      width: 90%;
      height: 60%;
      background-color: transparent;
      color: black;
      border: none;
      padding-left: 1rem;
      padding: 0.5rem;
      border-radius: 1.5rem;
      font-size: 1.2rem;
      border: 1.5px solid #5374e6;
      box-sizing: border-box;

      &::placeholder {
        color: #ababab; /* Placeholder 텍스트 색상 변경 */
      }

      &::selection {
        background-color: #9a86f3;
      }
      &:focus {
        outline: none;
      }
    }
    button {
      padding: 10px 20px; /* Adjust padding as needed based on the image size */
      border-radius: 20px;
      background-color: #ffffff; /* You can remove this if the image covers the entire button */
      background-image: url('https://static.thenounproject.com/png/497450-200.png'); /* Path to your image */
      background-size: cover; /* Cover the entire button area */
      color: transparent; /* Hide the text if you only want the image */
      border: none;
      cursor: pointer;
      width: 40px; /* Width of the button, adjust as needed */
      height: 40px; /* Height of the button, adjust as needed */
      background-position: center; /* Center the background image */
      border: 2px solid #ababab;
    }
  }
`;

export default ChatInput;
