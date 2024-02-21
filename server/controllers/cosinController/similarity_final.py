import pandas as pd
from sentence_transformers import SentenceTransformer
import pandas as pd
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

# BERT 모델 불러오기
model = SentenceTransformer('distiluse-base-multilingual-cased')

data = pd.read_csv('./output.csv')
# 'sentence_embeddings' 열을 문자열(string)에서 리스트로 변환
data['sentence_embeddings'] = data['sentence_embeddings'].apply(eval)

# 사용자 입력 텍스트 예시
user_input_text = "부동산을 통해서 어제 전세 계약을 했는데 사기를 당함. 보증금을 돌려받고자 했으나 인정이 되지 않는 상황"
user_input_embedding = model.encode([user_input_text])  # 리스트로 감싸서 2차원 배열로 변환

sentence_embeddings = data['sentence_embeddings'].tolist()
similarities = cosine_similarity(sentence_embeddings, user_input_embedding).reshape(-1)  # 1차원 배열로 변환

# 상위 3개 유사한 사건의 인덱스 찾기
top_indices = np.argsort(similarities)[-3:][::-1]

# 상위 3개 유사한 사건과 유사도 출력
print("Top 3 Similar Cases:")
for idx in top_indices:
    case_no = data.loc[idx, 'caseNo']  # 사건 번호
    # similarity = similarities[idx]  # 유사도
    case_description = data.loc[idx, 'fact_one']  # 사건 내용
    # print(f'CaseNo: {case_no}, Similarity: {similarity:.4f}')
    print(f'CaseNo: {case_no}')
    print(f'Case Description: {case_description}\n')