const Messages = require('../models/messageModel');
const CompletedChats = require('../models/completedChatsModel'); // 새로운 모델 import

module.exports.addMessage = async (req, res, next) => {
  try {
    const { chatId, question, answer } = req.body;

    // 현재 chatId에 대한 메시지 수를 확인
    const existingChat = await Messages.findOne({ chatId: chatId });

    if (existingChat && existingChat.messages.length === 7) {
      // 7번째 메시지를 추가하기 전이므로, 현재 길이는 6
      // 모든 메시지가 완료된 경우, 새로운 컬렉션에 저장
      const completedChatData = await CompletedChats.create({
        chatId,
        messages: [...existingChat.messages, { question, answer, timestamp: new Date() }],
      });

      // 기존 문서 삭제 또는 기타 처리
      await Messages.findOneAndDelete({ chatId: chatId });

      return res.json({ msg: 'Chat completed and saved to completed chats.' });
    } else {
      // 일반적인 메시지 추가 로직
      const data = await Messages.findOneAndUpdate(
        { chatId: chatId },
        {
          $push: { messages: { question, answer, timestamp: new Date() } },
        },
        { new: true, upsert: true }
      );

      if (data) {
        return res.json({ msg: 'Message added successfully.' });
      } else {
        return res.json({ msg: 'Failed to add message to the database' });
      }
    }
  } catch (ex) {
    next(ex);
  }
};
