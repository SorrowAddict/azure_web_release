const cosin = require('../models/cosinModel');
const { exec } = require('child_process');

// Python 스크립트 경로 수정
const pythonScriptPath = './cosinController/similarity_final.py';

module.exports.login = async (req, res, next) => {
  try {
    // Python 스크립트 실행 시 인코딩 설정 추가
    exec(
      `set PYTHONIOENCODING=utf-8 && python "${pythonScriptPath}"`,
      { encoding: 'utf8' },
      (error, stdout, stderr) => {
        if (error) {
          console.error(`exec error: ${error}`);
          return;
        }
        if (stderr) {
          console.error(`stderr: ${stderr}`);
          return;
        }
        console.log(`stdout: ${stdout}`);
      }
    );

    return res.json({ msg: 'cosin_response 내용 삽입' });
  } catch (ex) {
    next(ex);
  }
};
