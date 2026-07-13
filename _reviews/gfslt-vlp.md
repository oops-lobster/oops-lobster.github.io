---
title: "Gloss 없이 수어를 번역할 수 있을까"
title_en: "Can Sign Language Translation Work Without Glosses?"
paper_title: "Gloss-free Sign Language Translation: Improving from Visual-Language Pretraining"
topic: Sign Language Translation
year: 2023
summary: "시각-언어 사전학습으로 gloss annotation 없이 수어 영상과 자연어 문장을 연결하는 방법을 살펴보고, 손말첫걸음의 교육용 판정 시스템으로 확장할 지점을 정리했습니다."
summary_en: "A study of gloss-free sign language translation through visual-language pretraining, with practical connections to an educational sign-assessment system."
reading_time: 18
order: 1
tags:
  - Gloss-free SLT
  - Visual-Language Pretraining
  - MediaPipe
  - 손말첫걸음
---

> 논문: **Gloss-free Sign Language Translation: Improving from Visual-Language Pretraining**  
> 연구 관심: 수어 영상 처리 방식, gloss-free 접근, 손말첫걸음의 MediaPipe 기반 교육용 판정 시스템 설계

---

## 1. 논문 정보

- **제목**: Gloss-free Sign Language Translation: Improving from Visual-Language Pretraining
- **저자**: Benjia Zhou, Zhigang Chen, Albert Clapes, Jun Wan, Yanyan Liang, Sergio Escalera, Zhen Lei, Du Zhang
- **연도**: 2023
- **arXiv**: 2307.14768
- **핵심 키워드**
  - Sign Language Translation, SLT
  - Gloss-free SLT
  - Visual-Language Pretraining, VLP
  - CLIP
  - Masked Self-Supervised Learning
  - Transformer Encoder-Decoder
  - 수어 영상 표현 학습
  - 교육용 수어 동작 판정

---

## 2. 한 줄 요약

이 논문은 수어 번역에서 **gloss annotation**을 사용하지 않고, 수어 영상과 자연어 문장을 **시각-언어 사전학습(Visual-Language Pretraining)**으로 연결하여 gloss-free 수어 번역 성능을 높이는 방법을 제안한다.

---

## 3. 문제의식

기존 수어 번역 연구는 대체로 다음과 같은 구조를 사용했다.

```text
수어 영상 → gloss sequence → 자연어 문장
```

하지만 gloss 기반 접근에는 두 가지 문제가 있다.

### 3.1 Gloss annotation 구축의 어려움

Gloss는 전문가가 수어 영상을 보고 세밀하게 주석을 달아야 한다.  
특히 연속 수어 영상에서는 어느 구간이 어떤 gloss에 해당하는지 정렬해야 하므로 비용이 크다.

한국수어처럼 대규모 gloss annotation이 충분하지 않은 환경에서는 이 점이 큰 병목이 될 수 있다.

### 3.2 Gloss의 정보 병목

Gloss는 수어 영상을 단순한 기호열로 요약한다.  
이 과정에서 수어의 풍부한 정보가 손실되거나 왜곡될 수 있다.

수어 영상에는 다음 정보가 함께 들어 있다.

- 손 모양
- 손 위치
- 손의 방향
- 움직임 경로
- 속도
- 반복
- 표정
- 몸 방향
- 공간 참조
- 양손 관계

그러나 gloss로 변환하면 이런 정보 중 일부가 사라질 수 있다.  
따라서 gloss는 번역을 쉽게 해주는 중간 다리이지만, 동시에 **information bottleneck**이 될 수 있다.

---

## 4. 핵심 개념: Semantic Gap

이 논문에서 말하는 semantic gap은 **수어 영상 표현 공간**과 **자연어 문장 표현 공간** 사이의 간극이다.

수어 영상은 시각적·시간적 정보이고, 자연어 문장은 언어적 정보이다.  
두 표현은 형식이 다르기 때문에 그대로 연결하기 어렵다.

이 논문은 CLIP의 아이디어처럼 수어 영상과 문장을 함께 학습시켜, 두 표현을 같은 의미 공간에 가깝게 정렬하려고 한다.

```text
수어 영상 표현 ↔ 자연어 문장 표현
```

즉, 모델이 단순히 손의 움직임만 보는 것이 아니라,  
그 움직임이 어떤 언어적 의미와 연결되는지를 배우게 하려는 것이다.

---

## 5. CLIP과 VLP 이해

CLIP은 **Contrastive Language-Image Pretraining**의 약자이다.

핵심은 다음과 같다.

```text
맞는 이미지-문장 쌍은 가깝게
틀린 이미지-문장 쌍은 멀게
```

예를 들어:

```text
강아지 사진 ↔ "a dog running in the park"  → 가깝게
강아지 사진 ↔ "a red car"                 → 멀게
```

GFSLT-VLP는 이 아이디어를 수어 영상에 적용한다.

```text
수어 영상 ↔ 해당 번역 문장 → 가깝게
수어 영상 ↔ 다른 문장     → 멀게
```

다만 CLIP은 기본적으로 matching 모델이다.  
이미지와 문장이 맞는 쌍인지 비교하는 데 강하지만, 문장을 생성하는 모델은 아니다.

수어 번역은 최종적으로 문장을 만들어야 하므로 Text Decoder가 필요하다.  
그래서 이 논문은 CLIP식 visual-language alignment에 더해 **masked self-supervised learning**을 함께 사용한다.

---

## 6. 논문의 전체 구조

논문은 두 단계로 구성된다.

### 6.1 Stage 1: Visual-Language Pretraining

```text
수어 영상 V
+
자연어 문장 S
```

을 함께 사용하여 사전학습한다.

구성은 다음과 같다.

```text
수어 영상 V → Visual Encoder → visual feature
문장 S     → Text Encoder   → textual feature
```

그 다음 두 feature를 같은 joint semantic space에서 정렬한다.

또한 문장 일부를 mask하고 복원하는 학습을 통해 Text Decoder가 문장 구조를 배우도록 한다.

### 6.2 Stage 2: Gloss-Free SLT

Stage 1에서 학습한 Visual Encoder와 Text Decoder를 실제 번역 모델에 이어받는다.

```text
수어 영상 → Visual Encoder → Text Decoder → 자연어 문장
```

중간에 gloss는 사용하지 않는다.

---

## 7. 영상 처리 방식

이 논문은 수어 영상을 RGB 프레임으로 처리한다.

입력 형태는 다음과 같다.

```text
T × 224 × 224 × 3
```

- T: 프레임 수
- 224 × 224: 프레임 크기
- 3: RGB 채널

영상 처리 흐름은 다음과 같다.

```text
수어 영상 프레임
→ 2D CNN, ResNet18
→ 프레임별 visual feature
→ Conv1D + BN + ReLU + MaxPooling
→ 시간축 압축
→ Transformer Encoder
→ 수어 영상 representation
```

각 모듈의 역할은 다음과 같다.

### 7.1 2D CNN

프레임별 시각 특징을 추출한다.

- 손 모양
- 얼굴
- 상체
- 배경
- 프레임 단위 visual pattern

### 7.2 Temporal Conv Block

가까운 프레임 사이의 짧은 시간 변화를 학습한다.

예:

- 손이 위로 올라가는 움직임
- 손이 배 쪽으로 이동하는 움직임
- 짧은 반복 동작
- 손 모양이 바뀌는 순간

### 7.3 Transformer Encoder

긴 시간 흐름과 전체 동작 관계를 학습한다.

예:

- 시작 위치
- 중간 움직임
- 끝 위치
- 전체 동작 순서
- 긴 문맥 속 의미 관계

---

## 8. 손말첫걸음 관점에서의 변환

GFSLT-VLP 논문은 수어 번역 모델이다.

```text
수어 영상 → 자연어 문장
```

하지만 손말첫걸음의 현재 목표는 번역이 아니라 **교육용 판정**이다.

```text
학습자 수어 영상 → 정답 동작과의 유사도 판정 → 피드백
```

따라서 논문 구조를 그대로 구현하기보다는 다음처럼 변환해서 이해해야 한다.

```text
논문:
수어 영상 → Visual Encoder → Text Decoder → 자연어 문장

손말첫걸음:
학습자 영상 → MediaPipe landmark encoder → Assessment/Feedback module → 점수와 피드백
```

---

## 9. MediaPipe 기반 구조

손말첫걸음에서는 RGB-CNN 기반 접근보다 MediaPipe 기반 접근이 현실적이다.

```text
웹캠 영상
→ MediaPipe Hands/Holistic
→ 손·몸 landmark 추출
→ 좌표 정규화
→ landmark sequence representation
→ 정답 동작과 비교
→ 성공 여부, 점수, 피드백 생성
```

### 9.1 MediaPipe가 대체하는 부분

논문에서는 CNN이 RGB 프레임에서 visual feature를 뽑는다.

```text
RGB frame → CNN → visual feature
```

손말첫걸음에서는 MediaPipe가 이 역할을 대체한다.

```text
RGB frame → MediaPipe → landmark feature
```

즉, MediaPipe는 프레임별 손·몸 특징 추출기 역할을 한다.

---

## 10. 지문자와 단어 수어의 차이

### 10.1 지문자

지문자는 비교적 정적인 손모양 classification에 가깝다.

따라서 안정 구간의 손 landmark를 이용해 판정할 수 있다.

볼 수 있는 feature:

- 손가락이 펴졌는가
- 손가락이 접혔는가
- 엄지 위치
- 손가락 간 거리
- 손바닥 방향
- 손목 기준 상대 좌표

### 10.2 단어 수어와 짧은 표현

단어 수어는 정적인 손모양만으로 부족하다.  
시간 흐름이 중요하다.

봐야 할 요소:

- 손 위치
- 시작점과 끝점
- 움직임 방향
- 움직임 경로
- 속도
- 반복 횟수
- 양손 관계
- 몸 기준 상대 위치
- 얼굴/표정 정보

따라서 단어 수어는 frame-level classification이 아니라 **sequence-level motion assessment**로 접근해야 한다.

---

## 11. 교육용 판정 시스템의 목표

손말첫걸음의 최종 목표는 수어 번역기가 아니다.

목표는 다음과 같다.

```text
수어 학습자의 동작을 이해하고,
정답 동작과 비교하여,
구체적인 교육용 피드백을 제공하는 시스템
```

출력은 자연어 번역문이 아니라 다음과 같아야 한다.

- 정답 여부
- 전체 점수
- 손모양 점수
- 위치 점수
- 움직임 방향 점수
- 속도/반복 점수
- 양손 관계 점수
- 구체적 피드백 문장

예시:

```text
손 모양은 좋지만 손 위치가 배보다 조금 위에 있어요.
동작 방향은 맞지만 반복 횟수가 부족해요.
오른손이 몸에서 너무 멀어졌어요.
양손 간격을 조금 더 좁혀보세요.
```

---

## 12. Augmentation 정리

논문은 augmentation을 Stage별로 나누어 실험했다.

### 12.1 Stage 1 augmentation, Aug-S1

Stage 1은 VLP 사전학습 단계이다.

```text
수어 영상 + 문장
→ Visual-Language Pretraining
```

여기서 strong augmentation을 사용하면, 모델이 다양한 영상 조건에서도 같은 의미를 유지하는 robust한 visual representation을 배우게 된다.

논문에서는 Stage 1 augmentation이 성능 향상에 특히 중요했다.

### 12.2 Stage 2 augmentation, Aug-S2

Stage 2는 실제 번역 학습 단계이다.

```text
수어 영상
→ 번역 모델 학습
```

논문에서는 VLP 없이 Stage 2에만 strong augmentation을 넣으면 오히려 성능이 떨어졌다.

이유는 모델이 아직 robust한 표현을 배우지 못한 상태에서 강한 변형을 만나면, augmentation이 도움이 아니라 noise가 될 수 있기 때문이다.

### 12.3 핵심 결론

```text
augmentation은 무조건 좋은 것이 아니다.
Stage 1에서 robust한 표현을 먼저 학습시킬 때 특히 효과적이다.
```

손말첫걸음에 적용하면:

```text
정답 동작의 본질을 먼저 다양한 조건에서 튼튼하게 학습시킨 뒤,
그 다음 학습자 동작을 평가해야 한다.
```

---

## 13. 손말첫걸음에서 가능한 augmentation

### 13.1 비교적 안전한 변형

- 약간의 속도 변화
- 손 크기/카메라 거리 차이에 대한 scale normalization
- 작은 위치 noise
- 조명 변화
- 약간의 손 떨림
- 동작 앞뒤의 불필요한 정지 구간 crop

### 13.2 주의해야 할 변형

- 좌우 반전
- 큰 회전
- 몸 기준 위치를 바꾸는 변형
- 동작 방향을 바꾸는 변형
- 손이 닿아야 하는 신체 부위를 바꾸는 변형

수어에서는 변형이 의미를 바꿀 수 있으므로 augmentation을 조심스럽게 설계해야 한다.

---

## 14. 정규화의 중요성

MediaPipe landmark를 그대로 비교하면 안 된다.  
사람마다 손 크기, 몸 크기, 카메라 거리, 화면 위치가 다르기 때문이다.

따라서 다음 정규화가 필요하다.

- 화면 좌표를 몸 기준 상대 좌표로 변환
- 손 크기를 손목-중지 길이 등으로 scale normalization
- 어깨 너비 기준으로 몸 전체 scale normalization
- 얼굴/가슴/배 기준 상대 위치 계산
- 동작 시작과 끝을 기준으로 시간축 resampling
- 결측 landmark 보정

예를 들어 “배가 아파요”를 판정할 때는 화면 좌표상 아래쪽에 손이 있는지가 아니라,  
**몸 기준으로 배 부근에 손이 위치하는지**를 봐야 한다.

---

## 15. 손말첫걸음 구현 로드맵

### 15.1 1단계: 지문자 판정

```text
MediaPipe Hands
→ 한 손 landmark 21개
→ 손가락 각도/거리/상대 위치 feature
→ 지문자 classification
```

### 15.2 2단계: 단어 수어 판정

```text
MediaPipe Hands + Pose
→ 양손 landmark + 어깨/얼굴/몸 기준점
→ 1~3초 landmark sequence
→ DTW 또는 lightweight classifier
→ 단어 동작 판정
```

### 15.3 3단계: 짧은 표현 미션

```text
여러 단어 수어 sequence
→ 순서 판정
→ 미션 성공 여부
→ 교육용 피드백
```

예:

- 배가 아파요
- 약 주세요
- 도와주세요
- 병원에 가고 싶어요

### 15.4 4단계: Contrastive learning 확장

데이터가 쌓이면 다음 방향으로 확장할 수 있다.

```text
같은 동작의 전문가 영상과 학습자 영상 → 가까운 representation
다른 동작 영상 → 먼 representation
```

이를 통해 정답 동작과 학습자 동작의 유사도를 더 정교하게 계산할 수 있다.

---

## 16. 이 논문의 실험에서 얻는 교훈

논문의 ablation study에서 얻을 수 있는 교훈은 다음과 같다.

1. VLP만으로는 효과가 제한적이다.
2. Stage 1에서 strong augmentation을 함께 사용할 때 성능이 크게 향상된다.
3. VLP 없이 Stage 2에만 augmentation을 넣으면 성능이 떨어질 수 있다.
4. 프레임별 feature만 보는 것보다 시간 관계를 함께 모델링하는 것이 중요하다.
5. 모델을 무작정 크게 만든다고 성능이 좋아지는 것은 아니다.
6. 데이터가 작으면 overfitting이 심해질 수 있다.

손말첫걸음에 적용하면:

```text
처음부터 큰 end-to-end 모델을 만들기보다,
해석 가능한 rule-based / DTW / 작은 classifier부터 시작하는 것이 현실적이다.
```

---

## 17. 최종 연구 메모

GFSLT-VLP를 그대로 구현하는 것이 손말첫걸음의 목표는 아니다.

이 논문에서 가져갈 핵심은 다음이다.

1. 수어는 단순 이미지가 아니라 시간적 시각 언어이다.
2. gloss는 도움이 되지만 정보 요약 과정에서 손실과 왜곡을 만들 수 있다.
3. gloss annotation이 부족한 환경에서는 gloss-free 접근이 중요하다.
4. 수어 영상에서 의미 있는 representation을 만드는 것이 핵심이다.
5. 손말첫걸음에서는 이 representation을 번역이 아니라 교육용 판정과 피드백에 연결해야 한다.
6. MediaPipe 기반 접근에서는 landmark extraction 이후의 정규화와 시간 흐름 분석이 핵심이다.
7. 교육용 앱에서는 “맞다/틀리다”보다 “어디가 어떻게 다른지” 설명하는 피드백이 더 중요하다.

---

## 18. 생성형 AI를 활용한 이해 / 검토 필요

- 한국수어에서 gloss annotation이 어느 정도 구축되어 있는지는 별도 문헌 조사가 필요하다.
- 손말첫걸음 MVP에서는 RGB-CNN 기반 모델보다 MediaPipe landmark 기반 접근이 현실적이다.
- 지문자와 단어 수어는 다른 판정 구조를 가져야 한다.
- 단어 수어 판정에서는 손 위치, 움직임 방향, 몸 기준 상대 위치, 양손 관계를 함께 봐야 한다.
- 교육용 판정 시스템에서는 end-to-end 번역보다 설명 가능한 feature 기반 피드백이 우선되어야 한다.
- 향후 데이터가 충분히 쌓이면 contrastive learning 또는 self-supervised learning을 적용할 수 있다.
