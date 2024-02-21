const Gemini = require('../models/geminiModel');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const GeminiResult = require('../models/results_chema');
// const { get } = require('mongoose');
// import { HarmBlockThreshold, HarmCategory } from '@google/generative-ai';

module.exports.geminiall = async (req, res, next) => {
  try {
    const chatId = req.body.chatId;

    const { buildingType, rentalType, perpetrator, fraudType, damageAmount, numberOfVictims, briefSituation } =
      req.body;

    const chatId_ = await Gemini.findOne({ chatId: chatId }).sort({ createdAt: -1 });

    // 여기에 console.log를 추가하여 입력 값을 확인합니다.
    console.log('Received values:');
    console.log('Building Type:', buildingType);
    console.log('Rental Type:', rentalType);
    console.log('Perpetrator:', perpetrator);
    console.log('Fraud Type:', fraudType);
    console.log('Damage Amount:', damageAmount);
    console.log('Number of Victims:', numberOfVictims);
    console.log('Brief Situation:', briefSituation);
    // Access your API key as an environment variable (see "Set up your API key" above)
    // const genAI = new GoogleGenerativeAI(process.env.API_KEY);
    const genAI = new GoogleGenerativeAI('AIzaSyBlvNFO57MvApW1Mz2C7fctzvxBhPozNBQ');

    // DB에서 7개의 입력 받은 사례 정보 받아오기
    // async function getCaseInfo() {
    //     // 변수 정의
    //     const buildingType = '아파트';
    //     const rentalType = '전세';
    //     const perpetrator = '공인 중개사';
    //     const fraudType = '이중 계약';
    //     const damageAmount = '1억원';
    //     const numberOfVictims = 10;
    //     const briefSituation = '주택담보대출 근저당 설정된 아파트 전세 계약 후 먹튀';
    // }

    const generationConfig = {
      stopSequences: ['red'],
      maxOutputTokens: 2048,
      temperature: 0.4,
      topP: 1,
      topK: 1,
    };

    // const safetySettings = [
    //     {
    //         category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    //         threshold: HarmBlockThreshold.BLOCK_NONE,
    //     },
    //     {
    //         category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    //         threshold: HarmBlockThreshold.BLOCK_NONE,
    //     },
    //     {
    //         category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    //         threshold: HarmBlockThreshold.BLOCK_NONE,
    //     },
    //     {
    //         category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    //         threshold: HarmBlockThreshold.BLOCK_NONE,
    //     },
    //     {
    //         category: HarmCategory.HARM_CATEGORY_UNSPECIFIED,
    //         threshold: HarmBlockThreshold.BLOCK_NONE,
    //     },
    // ];

    // const buildingType = '아파트';
    // const rentalType = '전세';
    // const perpetrator = '공인 중개사';
    // const fraudType = '이중 계약';
    // const damageAmount = '1억원';
    // const numberOfVictims = 10;
    // const briefSituation = '주택담보대출 근저당 설정된 아파트 전세 계약 후 먹튀';

    // For text-only input, use the gemini-pro model
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' }, generationConfig);

    // 사례 정보 받아오기
    // async () => {
    //     const { buildingType, rentalType, perpetrator, fraudType, damageAmount, numberOfVictims, briefSituation } =
    //         await getCaseInfo();
    // }
    // const chat = model.startChat({
    //     history: [
    //         {
    //             role: 'user',
    //             parts: 'Hello, I have 2 dogs in my house.',
    //         },
    //         {
    //             role: 'model',
    //             parts: 'Great to meet you. What would you like to know?',
    //         },
    //     ],
    //     generationConfig: {
    //         maxOutputTokens: 100,
    //     },
    // });

    const prompt = `${buildingType} ${rentalType} 사기 피해 사례입니다. ${perpetrator}에 의해 ${fraudType} 당해 ${damageAmount} 피해를 입었습니다. 피해자는 ${numberOfVictims}명이며, 상황은 ${briefSituation} 일 때 `;

    // const result = await chat.sendMessage(msg);
    // const response = await result.response;
    // const text = response.text();
    // console.log(text);
    //
    // 7개 변수 생성
    const situationJudgment = model.generateContent(prompt + '상황 판단 결과(사기유형 및 근거 설명) 작성 각 한줄씩만');
    const response = (await situationJudgment).response;
    const situationJudgment_result = response.text();

    const procedure = model.generateContent(
      prompt + '절차(순서대로 어느 기관에 어떤 신고나 행동을 해야되는지 각 세부 내용 구체이고 꼼꼼하게 적어줘)'
    );
    const response2 = (await procedure).response;
    const procedure_result = response2.text();

    const documentLists = model.generateContent(prompt + '내가 써야되는 서류 목록 적어줘');
    const response3 = (await documentLists).response;
    const documentLists_result = response3.text();

    const litigationPrediction = model.generateContent(prompt + '소송 결과 예측해줘');
    const response5 = (await litigationPrediction).response;
    const litigationPrediction_result = response5.text();

    const verdict = model.generateContent(prompt + '판결문 만들고 실제로 있는 판결문인지 진위 여부도 작성해줘');
    const response6 = (await verdict).response;
    const verdict_result = response6.text();

    const situationSummary = model.generateContent(
      prompt +
        '입력받은 상황을 {누구(들)을 통해서 어떤 계약을 했는데 어떤 상황을 당해서 어떤 부분을 돌려받고 싶지만 안되는 상황} 과 비슷한 결(한 문장으로) 변환해줘'
    );
    const response7 = (await situationSummary).response;
    const situationSummary_reuslt = response7.text();

    // GeminiResult Input Code //
    const resultInstance = new GeminiResult({
      situationJudgment: situationJudgment_result,
      procedure: procedure_result,
      documentLists: documentLists_result,
      litigationPrediction: litigationPrediction_result,
      verdict: verdict_result,
      situationSummary: situationSummary_reuslt,
    });
    try {
      resultInstance.save();
      console.log('Result saved to MongoDB');
    } catch (error) {
      console.error('Error saving result to MongoDB:', error);
    }
    console.log('finish');
    return res.json({
      chatId_: chatId_,
      situationJudgment: situationJudgment_result,
      procedure: procedure_result,
      documentLists: documentLists_result,
      litigationPrediction: litigationPrediction_result,
      verdict: verdict_result,
      situationSummary: situationSummary_reuslt,
    });
  } catch (ex) {
    next(ex);
  }

  // run();
};
