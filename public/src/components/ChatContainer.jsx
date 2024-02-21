import React, { useState, useEffect, useRef } from 'react';
import ChatInput from './ChatInput';
import styled from 'styled-components';
import Logout from './Logout';
import axios from 'axios';
import chatlogo from '../assets/lawydot_logo.png';
import { sendMessageRoute, sendOptionRoute } from '../utils/APIRoutes';

function ChatContainer() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [chatHistory, setChatHistory] = useState([]);
  const messagesEndRef = useRef(null);
  const [situationJudgment, setSituationJudgment] = useState('');
  const [procedure, setProcedure] = useState('');
  const [documentLists, setDocumentLists] = useState([]);
  const [litigationPrediction, setLitigationPrediction] = useState('');
  const [verdict, setVerdict] = useState('');

  // chatHistory가 변경될 때마다 스크롤을 가장 아래로 이동시키는 함수
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const questions = [
    '건물 종류는?',
    '임대 형식은?',
    '가해자는?',
    '사기 유형은?',
    '피해 액은?',
    '피해자 수는?',
    '간략한 상황은?',
    '분석을 시작할까요?',
  ];
  const [options, setOptions] = useState([
    ['아파트', '오피스텔', '다세대(가구) 주택', '고시원', '원룸', '투룸'],
    ['월세', '전세', '차세', '임대차신용대출', '장기임대', '단기임대'],
    ['건설사', '공인중개사', '주택 금융기관', '임대인', '세입자', '공동주택 관리사무소'],
    ['이중 계약', '불법 중개', '저가 매물', '깡통 전세', '불법 건축물', '직거래', '무 자본 갭투자'],
    [],
    [],
    ['전세 보증금을 가로챔', '보증금을 제때 돌려받지 못함', '계약금만 받고 내가 분양해주겠다고 속임'],
    ['예', '아니오'], // "분석을 시작할까요?"에 대한 옵션 추가
  ]);

  const handleOptionSelect = (selectedOption) => {
    const newChatHistory = [
      ...chatHistory,
      { question: questions[currentQuestionIndex], answer: selectedOption, user: true },
    ];
    setChatHistory(newChatHistory);
    handleSendMsg(selectedOption);
  };

  const handleSendMsg = async (msg) => {
    const newChatHistory = [...chatHistory, { question: questions[currentQuestionIndex], answer: msg, user: true }];

    if (currentQuestionIndex < questions.length - 1) {
      // 다음 질문 준비
      const nextQuestionIndex = currentQuestionIndex + 1;
      const nextQuestion = {
        question: questions[nextQuestionIndex],
        answer: '',
        user: false,
      };
      newChatHistory.push(nextQuestion);
      setCurrentQuestionIndex(nextQuestionIndex);
    } else {
      console.log('모든 질문 완료');
      const analysisMessage = {
        question: '말씀해주신 부분을 분석하고 있습니다',
        answer: '', // 여기서는 답변이 필요 없으므로 빈 문자열을 할당
        user: false, // 이 메시지는 시스템(또는 AI)에 의해 생성되므로 user: false로 설정
      };
      newChatHistory.push(analysisMessage);

      console.log(newChatHistory);
      // 서버에 질문과 답변 전송
      const user = JSON.parse(localStorage.getItem('chat-app-user'));
      const formData = {
        chatId: user._id,
        buildingType: chatHistory.find((q) => q.question === '건물 종류는?' && q.user === true)?.answer,
        rentalType: chatHistory.find((q) => q.question === '임대 형식은?' && q.user === true)?.answer,
        perpetrator: chatHistory.find((q) => q.question === '가해자는?' && q.user === true)?.answer,
        fraudType: chatHistory.find((q) => q.question === '사기 유형은?' && q.user === true)?.answer,
        damageAmount: chatHistory.find((q) => q.question === '피해 액은?' && q.user === true)?.answer,
        numberOfVictims: chatHistory.find((q) => q.question === '피해자 수는?' && q.user === true)?.answer,
        briefSituation: chatHistory.find((q) => q.question === '간략한 상황은?' && q.user === true)?.answer,
      };

      try {
        const geminiResult = await axios.post(sendOptionRoute, formData);
        const { situationJudgment, procedure, documentLists, litigationPrediction, verdict } = geminiResult.data;

        // documentLists가 배열인지 확인하고 처리
        if (Array.isArray(documentLists)) {
          // 배열이라면 join 메소드를 사용하여 문자열로 변환
          const documentListsString = documentLists.join(', ');
          setDocumentLists(documentListsString);
        } else {
          // 배열이 아니라면 기본값으로 설정하거나 다른 처리 수행
          setDocumentLists('문서 목록을 불러오지 못했습니다.');
        }

        // 분석 결과를 상태로 설정하는 함수
        const fetchGeminiResult = async () => {
          try {
            // 분석 결과를 상태로 설정
            setSituationJudgment(situationJudgment);
            setProcedure(procedure);
            setDocumentLists(documentLists);
            setLitigationPrediction(litigationPrediction);
            setVerdict(verdict);
          } catch (error) {
            console.error('분석 결과 상태 설정 실패: ', error);
          }
        };

        // 분석 결과를 가져오는 함수 호출
        await fetchGeminiResult();
      } catch (error) {
        console.error('메시지 저장 실패: ', error);
      }

      setCurrentQuestionIndex(Infinity); // 현재 질문 인덱스를 무한대로 설정
    }

    setChatHistory(newChatHistory);

    // 서버에 현재 질문과 답변 저장
    try {
      const user = JSON.parse(localStorage.getItem('chat-app-user'));
      await axios.post(sendMessageRoute, {
        chatId: user._id, // chatId 설정 필요
        question: questions[currentQuestionIndex],
        answer: msg,
      });
    } catch (error) {
      console.error('메시지 저장 실패: ', error);
    }
  };

  useEffect(() => {
    // 컴포넌트가 마운트될 때 첫 번째 질문을 자동으로 표시
    const firstQuestion = {
      question: questions[0],
      answer: questions[0],
      user: false,
    };
    setChatHistory([firstQuestion]);
  }, []);

  // useEffect(() => {
  //   // 컴포넌트가 마운트될 때 한 번만 분석 결과를 가져오도록 수정
  //   const fetchGeminiResult = async () => {
  //     try {
  //       const geminiResult = await axios.post(sendOptionRoute, formData);
  //       const { situationJudgment, procedure, documentLists, litigationPrediction, verdict } = geminiResult.data;
  //       console.log(geminiResult.data);

  //       // 분석 결과를 상태로 설정
  //       setSituationJudgment(situationJudgment);
  //       setProcedure(procedure);
  //       setDocumentLists(documentLists);
  //       setLitigationPrediction(litigationPrediction);
  //       setVerdict(verdict);
  //     } catch (error) {
  //       console.error('분석 결과 가져오기 실패: ', error);
  //     }
  //   };

  //   fetchGeminiResult(); // 컴포넌트가 마운트될 때 한 번 호출
  // }, []); // 빈 배열을 의존성 배열로 설정하여 한 번만 호출되도록 함

  return (
    <Container>
      <div className="chat-header">
        <div className="user-details">
          <div className="avatar">
            <img src={chatlogo} alt="chatlogo" />
          </div>
          <div className="username">
            <h2>Lawydot</h2>
          </div>
        </div>
        <Logout />
      </div>
      <div className="chatbot-container">
        <div className="chat-messages">
          {chatHistory.map((message, index) => (
            <React.Fragment key={index}>
              {message.user === false && (
                <div className="message ai-message">
                  <div className="ai-message-text">{message.question}</div>
                </div>
              )}
              {message.user === true && (
                <div className="message user-message">
                  <div className="user-message-text">{message.answer}</div>
                </div>
              )}
              <div className="scroll1" ref={messagesEndRef} />
            </React.Fragment>
          ))}
        </div>
        {currentQuestionIndex < questions.length && ( // 현재 질문이 마지막 질문이 아닐 때만 옵션 버튼을 표시
          <div className="options-container">
            <div className="options">
              {options[currentQuestionIndex].map((option, index) => (
                <button key={index} onClick={() => handleOptionSelect(option)}>
                  {option}
                </button>
              ))}
            </div>
          </div>
        )}
        {currentQuestionIndex === Infinity && (
          <div className="analysis-results">
            <h3>분석 결과</h3>
            <br />
            <div className="result-item">
              <p>
                <strong>상황 판단:</strong>
              </p>
              <br />
              <p>{situationJudgment}</p>
              <br />
            </div>
            <div className="result-item1">
              <p>
                <strong>절차:</strong>
              </p>
              <br />
              <br />
              <p>{procedure}</p>
              <br />
            </div>
            <div className="result-item2">
              <p>
                <strong>서류 목록:</strong>
              </p>
              <br />
              <p>{documentLists}</p>
              <br />
            </div>
            <div className="result-item3">
              <p>
                <strong>결과 예측:</strong>
              </p>
              <br />
              <p>{litigationPrediction}</p>
              <br />
            </div>
            <div className="result-item4">
              <p>
                <strong>판결문:</strong>
              </p>
              <br />
              <p>{verdict}</p>
              <br />
            </div>
            <div className="scroll2" ref={messagesEndRef} />
          </div>
        )}
      </div>
      {currentQuestionIndex < questions.length - 1 && <ChatInput handleSendMsg={handleSendMsg} />}
    </Container>
  );
}

const Container = styled.div`
  display: grid;
  grid-template-rows: 15% 70% 15%;
  gap: 0.1rem;
  overflow: hidden;
  @media screen and (min-width: 720px) and (max-width: 1080px) {
    grid-template-rows: 15% 70% 15%;
  }
  .chatbot-container {
    display: flex;
    flex-direction: column;
    padding: 1rem;
    height: 100%; /* 또는 적절한 높이 */
    overflow-y: auto; /* 메시지가 많을 경우 스크롤 */
  }

  .chat-messages {
    display: flex;
    flex-direction: column;
    gap: 1rem; /* 메시지 간 간격 */
    margin-bottom: 1rem;
  }

  .message {
    display: flex;
    padding: 8px;
    border-radius: 8px; /* 둥근 모서리 */
    margin: 5px 0; /* 상하 마진 */
  }

  .user-message {
    background-color: #1a18b8;
    color: #fff;
    text-align: right;
    align-self: flex-end;
    border-radius: 1rem 0rem 1rem 1rem;
  }

  .result-item,
  .result-item1,
  .result-item2,
  .result-item3,
  .result-item4 {
    margin-bottom: 1rem;
    position: relative;
  }

  .result-item p,
  .result-item1 p,
  .result-item2 p,
  .result-item3 p,
  .result-item4 p {
    margin: 0;
    padding: 10px;
    background-color: #ffffff;
    border-radius: 10px;
    position: relative;
    border-radius: 0rem 1rem 1rem 1rem;
  }

  .analysis-results strong,
  .result-item strong,
  .result-item1 strong,
  .result-item2 strong,
  .result-item3 strong,
  .result-item4 strong {
    color: #5374e6;
  }

  .result-item::before,
  .result-item1::before,
  .result-item2::before,
  .result-item3::before,
  .result-item4::before {
    content: '';
    position: absolute;
    width: 0;
    height: 0;
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    border-bottom: 10px solid #f0f0f0;
    top: -8px;
    left: 50%;
    transform: translateX(-50%);
  }

  .ai-message {
    background-color: #ffffff;
    text-align: left;
    align-self: flex-start;
    color: #333;
    border-radius: 0rem 1rem 1rem 1rem;
  }

  .user-message-text {
    max-width: 100%; /* 메시지 최대 너비 */
    word-wrap: break-word; /* 긴 단어가 있을 경우 줄바꿈 */
  }
  .ai-message-text {
    max-width: 100%; /* 메시지 최대 너비 */
    word-wrap: break-word; /* 긴 단어가 있을 경우 줄바꿈 */
  }
  .analysis-message-text {
    max-width: 100%; /* 메시지 최대 너비 */
    word-wrap: break-word; /* 긴 단어가 있을 경우 줄바꿈 */
  }
  .options-container {
    display: flex;
    justify-content: flex-start;
    padding: 0.5rem;
  }

  .options {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    justify-content: flex-start; /* 버튼들을 왼쪽으로 정렬 */
  }

  .options button {
    padding: 8px 12px;
    font-size: 0.8rem;
    color: #ffffff;
    background-color: #5374e6;
    border: 1px solid #5374e6;
    border-radius: 15px;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
  }

  .options button:hover {
    background-color: pink;
    border: 1px solid pink;
  }

  .options button:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(33, 37, 41, 0.1);
  }
  .chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 2rem;
    .user-details {
      display: flex;
      align-items: center;
      gap: 1rem;
      .avatar {
        img {
          height: 3rem;
        }
      }
      .username {
        h2 {
          color: black;
        }
      }
    }
  }
`;

export default ChatContainer;
