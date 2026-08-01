---
title: "8채널 EEG SoC는 발작을 어떻게 감지하고 기록할까"
title_en: "How an 8-Channel EEG SoC Detects and Records Seizures"
title_ja: "8チャネルEEG SoCは発作をどう検出・記録するか"
paper_title: "An 8-Channel Scalable EEG Acquisition SoC With Patient-Specific Seizure Classification and Recording Processor"
topic: Neural Interface SoC
year: 2013
summary: "8채널 EEG 측정, 7대역 특징 추출, 환자별 SVM과 사건 기반 원시 신호 기록을 단일 칩에 통합한 구조를 분석하고, 실제 검증 범위와 후속 연구 질문을 구분했습니다."
summary_en: "An analysis of a single-chip system combining 8-channel EEG acquisition, seven-band feature extraction, patient-specific SVM inference, and event-triggered raw recording, with its validation boundaries kept explicit."
summary_ja: "8チャネルEEG計測、7帯域特徴抽出、患者別SVM、イベント駆動の生波形記録を単一チップに統合した構成を分析し、検証範囲と今後の課題を明確に区別しました。"
reading_time: 38
order: 3
math: true
tags:
  - EEG
  - Seizure Detection
  - Patient-Specific SVM
  - Neural Interface
  - Edge AI SoC
---

> **한 문장 요약**
> 두피 EEG를 최대 8채널로 연속 측정하고, 최근 약 6초의 주파수·공간·시간 특징을 칩 내부에서 계산해 환자별 선형 SVM으로 발작을 판정한 뒤, 발작이 검출되면 측정 대역폭을 30 Hz에서 100 Hz로 넓혀 원시 EEG를 64 KB SRAM에 기록하는 2013년 JSSC 통합 SoC 논문이다.

> **이 논문의 핵심 의미**
> 이 연구의 가장 큰 기여는 특정 증폭기나 분류기 하나가 아니라, **전극 입력 → 저잡음 AFE → ADC → 주파수 특징 추출 → 환자별 분류 → 원시 EEG 기록**을 하나의 5 mm × 5 mm 칩 안에 통합했다는 데 있다. 이후 유담 교수님 연구의 `발작 감지 → 폐루프 자극 → one-shot/online tuning → patient-independent zero-shot` 계보를 이해하는 뿌리 논문이다.

> **해석 시 주의**
> 최대 8채널을 지원하지만 실제 사람에게 전극부터 분류기까지 전체 경로를 검증한 실험은 `Fp1–F3`, `Fp2–F4`의 2채널 rapid-eye-blink 시험이었다. 실제 발작 성능은 CHB–MIT의 이미 기록된 디지털 EEG를 프로세서 입력으로 넣어 검증했다. 따라서 **실제 간질 환자의 일상 장기 착용 성능을 입증한 논문은 아니다.**

---

## 1. 서지 정보

| 항목 | 내용 |
|---|---|
| 논문 | An 8-Channel Scalable EEG Acquisition SoC With Patient-Specific Seizure Classification and Recording Processor |
| 저자 | Jerald Yoo, Long Yan, Dina El-Damak, Muhammad Awais Bin Altaf, Ali H. Shoeb, Anantha P. Chandrakasan |
| 학술지 | IEEE Journal of Solid-State Circuits |
| 출판 | 2013년 1월, Vol. 48, No. 1, pp. 214–228 |
| DOI | 10.1109/JSSC.2012.2221220 |
| 공정 | 0.18-μm 1P6M CMOS |
| 칩 면적 | 5 mm × 5 mm = 25 mm² |
| 핵심 블록 | 8채널 AFE, 10-bit SAR ADC, 8채널 Feature Extraction Engine, Linear SVM, 64 KB SRAM |
| 핵심 임상 문제 | 병원 밖 장기 EEG 감시와 환자별 발작 시작 검출 |
| 검증 단계 | 회로 측정 + CHB–MIT 저장 EEG의 온칩 분류 + 건강한 사람 rapid-eye-blink 전체 SoC 검증 |

---

## 2. 이 논문을 왜 읽는가

첫 번째 BCP·SkinECG 리뷰에서는 다음과 같은 확장 가능성을 제기했다.

```text
초저전력 생체신호 센서
→ 평상시 저비용 특징 감시
→ 이상 사건 검출
→ 더 풍부한 원시 파형 기록·전송
```

이 논문은 같은 시스템 철학을 ECG가 아니라 EEG 발작 관리에 먼저 구현했다.

```text
평상시
30 Hz 대역에서 환자별 발작 특징 감시
        ↓ 발작 검출
사건 발생 후
100 Hz 대역으로 넓혀 raw EEG를 SRAM에 기록
```

따라서 이 논문은 다음 질문을 공부하기 위한 기반이다.

- 초저전력 칩이 EEG 발작을 어떻게 특징화하는가?
- 머신러닝 분류기를 어떻게 작은 하드웨어에 넣는가?
- 아날로그 회로와 디지털 분류기가 어떻게 서로 피드백하는가?
- 실제 환자에게 도움이 되는 wearable neural interface로 가기 위해 무엇이 더 필요한가?

### 연구 계보에서의 위치

```text
2013
8-channel EEG acquisition
+ patient-specific SVM
+ event-triggered recording
        ↓
2015
seizure onset·termination detection
+ transcranial electrical stimulation
        ↓
2022
one-shot learning
+ online tuning
+ closed-loop epilepsy management
        ↓
2023
patient-independent SciCNN
+ 0-shot retraining
        ↓
향후 방향
patient-specific sensing geometry
+ pre-trigger raw buffer
+ real-world long-term adaptation
```

---

## 3. 먼저 구분해야 할 용어

### 3.1 Electrode와 Channel

- **Electrode**: 두피에 붙이는 물리적 전기 접점
- **EEG channel**: 두 전위의 차이로 얻는 하나의 신호

\[
V_{\text{channel}}=V_A-V_B
\]

따라서 `8-channel`은 전극이 정확히 8개라는 뜻이 아니라, **동시에 처리할 수 있는 차동 EEG 신호 경로가 최대 8개**라는 뜻이다.

이 칩은 다음 montage를 지원한다.

- bipolar
- referential
- average referential

### 3.2 Scalable

사용 채널 수를 다음과 같이 설정할 수 있다.

| 채널 수 | 시스템 클록 |
|---:|---:|
| 1 | 64 kHz |
| 2 | 128 kHz |
| 4 | 256 kHz |
| 8 | 512 kHz |

사용하지 않는 채널까지 최대 속도로 처리하지 않음으로써 전력 소비를 줄인다.

### 3.3 EEG acquisition

단순히 전극을 붙이는 것이 아니라 다음 전체 과정이다.

```text
전극에서 미세 전압 획득
→ 증폭
→ offset·잡음 제거
→ 필요한 대역만 필터링
→ 디지털 코드로 변환
```

### 3.4 On-chip training과 inference

- **Training**: 환자의 정상·발작 EEG로 SVM 파라미터 \(W,\beta\)를 구하는 과정
- **Inference**: 새로운 EEG 특징에 \(W,\beta\)를 적용해 정상/발작을 판정하는 과정

이 논문은 **training은 off-chip**, inference는 on-chip이다. 파라미터는 제조 시 영구 고정되는 hard-coding이 아니라, 환자별 학습 후 register에 프로그램된다.

---

## 4. 임상적 동기와 기존 방식의 한계

### 4.1 왜 장기 발작 추적이 필요한가

발작 횟수와 패턴을 정확히 기록하면 약물 용량 조절과 치료 평가에 도움이 될 수 있다. 그러나 기존 방식에는 다음 한계가 있다.

#### 환자 인터뷰

- 발작 중 기억 소실 가능
- 수면 중 발작 누락
- 소아 환자에서 정확한 자기보고가 어려움

#### 병원 입원 EEG

- 환자 불편과 비용
- 입원 기간에 발작이 발생한다는 보장이 없음
- 일상생활 환경의 발작을 충분히 포착하기 어려움

저자들은 장기간 착용할 수 있는 patch-type EEG monitoring device를 지향한다.

### 4.2 Electrical onset과 clinical onset

많은 발작에서 EEG의 전기적 변화가 눈에 보이는 임상 증상보다 먼저 나타날 수 있다.

```text
electrical onset
EEG 이상 활동 시작
        ↓
clinical onset
경련·행동 변화·의식 변화
```

따라서 전기적 시작을 자동 검출하면 단순 기록뿐 아니라 향후 폐루프 치료의 trigger로도 사용할 수 있다.

### 4.3 원시 EEG를 계속 무선 전송하지 않는 이유

```text
raw EEG 상시 전송
→ 무선 송신 전력 증가
→ 외부 수신기 의존
→ 이동성 제한
→ 간섭·보안 문제
```

이 논문은 특징 추출, 분류, 저장을 모두 칩 내부에서 수행해 외부 통신 overhead를 줄인다.

> 데이터를 멀리 보내기 전에 센서 가까이에서 의미 있는 정보로 압축한다.

현재 용어로는 on-device processing 또는 edge AI에 해당한다.

---

## 5. 발작 분류 알고리즘: Fig. 1–4

### 5.1 발작을 보는 세 축

논문은 발작 특징에 다음 세 정보를 함께 사용한다.

#### Spectral variation

어떤 주파수 성분이 강해졌는가?

#### Spatial variation

어느 EEG 채널에서 변화가 나타났는가?

#### Temporal variation

최근 몇 초 동안 주파수 특징이 어떻게 변했는가?

```text
주파수
× 위치
× 시간 변화
→ 발작 특징
```

### 5.2 Fig. 1 — 발작 onset의 rhythmic activity

발작 onset 예시에서 반복적인 rhythmic activity가 나타나며, 주파수 영역에서는 2 Hz와 4 Hz 부근의 성분이 두드러진다.

중요한 점은 가장 강한 단일 주파수만 보는 것이 아니라, **덜 강한 주파수 성분까지 함께 고려해야 정상과 발작을 더 잘 구분할 수 있다**는 것이다.

### 5.3 0–28 Hz를 7개 sub-band로 분할

관심 주파수 영역을 7개의 동일한 대역으로 나눈다.

```text
BPF1
BPF2
BPF3
BPF4
BPF5
BPF6
BPF7
```

각 band-pass filter의 2초간 spectral energy를 계산한다.

대략적인 개념은 다음과 같다.

```text
0–4 Hz
4–8 Hz
8–12 Hz
12–16 Hz
16–20 Hz
20–24 Hz
24–28 Hz
```

정확한 필터 경계와 전이대역은 실제 계수 설계를 따라간다.

### 5.4 왜 7개인가: Fig. 4

필터 bank 수를 늘리면 처음에는 발작 검출률이 좋아진다. 하지만 7개 이후부터 검출률 향상이 포화된다.

> 7은 환자별 최적값이 아니라, **분류 성능과 하드웨어 비용 사이의 공통 타협점**이다.

환자별로 달라지는 것은 뒤의 SVM 파라미터 \(W,\beta\)이다.

### 5.5 시간 정보: 2초 × 3구간

각 2초 구간에서 주파수 에너지를 구하고, 연속된 세 구간을 연결한다.

```text
이전 4–6초 특징
+
이전 2–4초 특징
+
현재 0–2초 특징
```

따라서 현재 한순간이 아니라 최근 약 6초 동안 특징이 변하는 과정을 본다.

> 원시 EEG 6초를 저장하는 것이 아니라, **최근 6초의 주파수 특징을 유지·분석**한다.

### 5.6 Fig. 2 — Patient-specific이 필요한 이유

같은 `Fp2–F4` 위치의 발작 EEG라도 환자 A와 B의 시간 파형과 주파수 분포가 크게 다르다.

```text
환자 간 차이
→ 동일한 보편 경계 하나로 분류하기 어려움
→ 환자별 SVM 파라미터 필요
```

### 5.7 Linear SVM

개념적으로 다음 점수를 계산한다.

\[
s=W^\mathsf{T}X+\beta
\]

- \(X\): 현재 EEG feature vector
- \(W\): 각 특징의 환자별 중요도
- \(\beta\): 판정 경계의 offset
- \(s\): 정상/발작 판정 점수

비유하면 환자별 채점표이다.

```text
각 주파수 특징 × 환자별 중요도
→ 모두 합산
→ 기준선을 넘는지 판정
```

---

## 6. 전체 시스템 구조: Fig. 5

```text
8개 EEG AFE
   ↓
Channel MUX
   ↓
10-bit SAR ADC
   ↓
8개 Feature Extraction Engine
   ↓
하나의 Classification Engine
   ↓
Seizure_info
   ↓
64 KB SRAM 기록
```

동시에 디지털 회로에서 아날로그 회로로 피드백이 간다.

```text
ADC 진폭
→ Gain-Bandwidth Controller
→ AFE gain 조절

발작 판정 상태
→ Gain-Bandwidth Controller
→ AFE bandwidth 조절
```

### 6.1 AFE

각 채널은 다음 두 블록으로 구성된다.

```text
CS-CCIA
→ ASPU
```

- CS-CCIA: 저잡음 기본 증폭과 전극·offset 문제 보정
- ASPU: 추가 gain과 30/100 Hz bandwidth 설정

### 6.2 ADC 공유

8개 AFE 출력은 MUX를 통해 하나의 ADC를 공유한다.

- 채널당 4 kS/s
- 8채널 사용 시 총 32 kS/s

ADC를 8개 두는 것보다 면적과 전력을 줄일 수 있다.

### 6.3 Feature Extraction Engine은 채널별 병렬

각 채널에서 2초 동안 7개 주파수 대역의 에너지를 계속 계산해야 하므로 Feature Extraction Engine은 채널마다 하나씩 둔다.

```text
8 channels × 7 filters
= 56 digital filters
```

이 56개 필터를 작은 면적에 넣는 것이 DQ-LUT의 출발점이다.

---

## 7. 두 가지 동작 모드

### 7.1 Seizure Detection Mode

```text
AFE bandwidth: 30 Hz
Feature Extraction Engine: ON
Classification Engine: ON
raw EEG recording: 기본적으로 OFF
```

발작 분류에 필요한 특징이 0–28 Hz에 있으므로 평상시에는 30 Hz까지만 처리한다.

### 7.2 Seizure Recording Mode

발작이 검출되면:

```text
AFE bandwidth: 30 → 100 Hz
Feature Extraction Engine: OFF
Classification Engine: OFF
ADC raw data → 64 KB SRAM
```

설정된 기간 기록한 뒤 detection mode로 돌아간다.

비유하면:

```text
평상시
저비용 움직임 감시
        ↓ 사건 검출
사건 발생 후
더 넓은 대역의 원본 녹화
```

### 7.3 중요한 한계

발작 검출 전 최근 6초의 **특징**은 사용하지만, 검출 이전 raw EEG를 순환 저장하는 pre-trigger circular buffer는 명시되지 않았다.

따라서 발작 직전 원시 파형을 보존하려면 다음 확장이 필요하다.

```text
평상시 raw EEG circular buffer
→ 발작 검출
→ 이전 N초 동결
→ 이후 N초 추가 기록
```

---

## 8. Feature Extraction Engine과 DQ-LUT: Fig. 6–11

### 8.1 FIR filter의 기본 계산

43차 FIR filter는 44개의 tap을 사용한다.

\[
y[n]=\sum_{k=0}^{43}h_kx[n-k]
\]

- \(x[n-k]\): 현재와 과거 EEG sample
- \(h_k\): 필터 계수
- \(y[n]\): 특정 주파수 대역의 출력

핵심 연산은 MAC이다.

```text
sample × coefficient
→ 기존 합계에 누적
```

### 8.2 기존 네 가지 구조: Fig. 7

#### Fully parallel

- tap마다 전용 multiplier·adder
- 가장 빠름
- 면적·전력 큼

#### Fully serial

- multiplier·adder 하나를 반복 사용
- 면적 감소
- 더 빠른 clock 필요

#### Partly serial

- 일부 병렬, 각 묶음 내부는 직렬
- 속도와 면적의 타협

#### Cascaded serial

- accumulator를 더 적극적으로 재사용
- partly serial보다 면적 절감

그러나 8채널·56필터 구조에서는 기존 MAC 방식이 여전히 너무 크다. 병렬 구조를 적용하면 프로세서 면적의 88.7%가 필터에 사용될 수 있어 분류기와 SRAM을 통합하기 어렵다.

---

### 8.3 계수가 왜 고정되는가

필터 계수는 자연적으로 고정되는 값이 아니라, **통과시킬 주파수 대역을 미리 설계했기 때문에 고정**된다.

```text
계속 변하는 것
→ EEG sample x

설계 후 고정되는 것
→ FIR coefficient h
```

각 BPF에는 별도의 고정 계수 44개가 있다.

```text
BPF1 coefficient set
BPF2 coefficient set
...
BPF7 coefficient set
```

모든 환자에게 같은 주파수 자를 적용하고, 그 결과를 어떻게 해석할지는 환자별 SVM이 담당한다.

---

### 8.4 Distributed Arithmetic의 핵심

원래 계산:

\[
Y[N]=\sum_{n=0}^{N-1}C[n]X[n]
\]

샘플을 비트 단위로 분해하면:

\[
Y[N]
=
\sum_{b=0}^{B-1}2^b
\sum_{n=0}^{N-1}C[n]X_b[n]
\]

여기서 \(X_b[n]\)은 0 또는 1이다.

따라서 같은 bit position의 여러 tap을 묶으면, 결과는 고정 계수들의 가능한 부분합 중 하나가 된다.

#### 4-input 예시

입력 비트가 `1011`이면:

\[
C_0+C_2+C_3
\]

를 출력한다.

LUT에는 16가지 가능한 조합을 모두 저장한다.

| 주소 | 미리 계산한 부분합 |
|---|---|
| 0000 | 0 |
| 0001 | \(C_3\) |
| 0010 | \(C_2\) |
| 0101 | \(C_1+C_3\) |
| 1011 | \(C_0+C_2+C_3\) |
| 1111 | \(C_0+C_1+C_2+C_3\) |

> 자주 쓰는 값만 저장하는 cache가 아니라, **가능한 16개 조합의 답을 모두 적어 둔 작은 정답표**이다.

각 bit position에서 LUT 값을 읽고, 자릿수에 맞춰 shift한 뒤 누적하면 원래 곱셈합과 같은 결과를 얻는다.

---

### 8.5 Symmetric FIR: 44 → 22쌍

필터 계수가 대칭이면:

\[
h_0=h_{43},\quad h_1=h_{42},\dots
\]

따라서:

\[
h_0x_0+h_{43}x_{43}
=
h_0(x_0+x_{43})
\]

처럼 대칭 sample을 먼저 더할 수 있다.

```text
44 taps
→ 같은 계수의 양끝 sample을 묶음
→ 22개의 계산 항
```

계수 44개를 4개로 줄인 것이 아니다.

### 8.6 Quad의 의미

22개 항을 다음처럼 나눈다.

```text
4-input LUT × 5
+
2-input LUT × 1
```

`Quad`는 전체 계수 수가 4라는 뜻이 아니라, **한 LUT가 네 개 항의 같은 bit position을 함께 처리한다**는 뜻이다.

### 8.7 왜 하필 4-input인가: Fig. 9

한 LUT 입력 수가 \(K\)이면 저장 조합은 \(2^K\)개이다.

| 묶음 크기 | LUT 조합 수 |
|---:|---:|
| 2 | 4 |
| 3 | 8 |
| 4 | 16 |
| 5 | 32 |
| 6 | 64 |
| 8 | 256 |

#### 너무 작게 묶으면

- LUT 하나는 작음
- LUT 개수와 결과 합산 회로가 많아짐
- accumulator·adder overhead 증가

#### 너무 크게 묶으면

- LUT 개수는 감소
- LUT 자체가 지수적으로 커짐

실제 logic synthesis 결과에서 4-bit slice의 전체 logic cell 수가 최소였다.

> **4는 보편적 진리가 아니라 이 필터·구조·공정에서 실제 합성으로 찾은 최저 비용점이다.**

### 8.8 성능 개선

Serial architecture 대비:

- power × delay: 51.4% 감소
- power × delay × area: 52.8% 감소

#### DQ-LUT 한 문장 요약

> 고정된 44개 FIR 계수를 대칭성으로 22쌍으로 줄이고, 네 항씩 가능한 bit 조합의 부분합을 미리 LUT에 저장해 multiplier를 없앤 뒤 shift·accumulate로 같은 필터 출력을 얻는다.

---

## 9. Classification Engine: Fig. 12

### 9.1 입력과 환자별 파라미터

각 채널의 feature vector:

\[
X=[X_1,\dots,X_7]
\]

환자별 파라미터:

\[
W=[W_1,\dots,W_7],\quad \beta
\]

논문 구현에서는 \(W_1\)–\(W_7\)과 \(\beta\)가 register에 저장된다.

### 9.2 하나의 SVM을 8채널이 공유

각 채널에 SVM을 하나씩 두지 않고 MUX bank를 통해 하나의 Classification Engine이 차례로 처리한다.

```text
8개의 검사실
→ 결과표를 한 명의 판독자가 순서대로 읽음
```

### 9.3 연산

\[
W_1X_1+\cdots+W_7X_7+\beta
\]

7개 곱셈을 모두 병렬로 하지 않고 floating-point multiplier 하나를 반복 사용해 hardware cost를 줄인다.

```text
W1X1 계산·누적
→ W2X2 계산·누적
→ ...
→ W7X7 계산·누적
→ β 추가
→ 정상/발작
```

필터는 56개라 multiplier 자체를 LUT로 대체했지만, SVM은 연산 수가 적어 multiplier 하나를 재사용하는 편이 유리하다.

### 9.4 Training은 칩 밖에서

```text
환자의 정상·발작 EEG
→ 외부 컴퓨터에서 SVM 학습
→ W, β 산출
→ chip register에 입력
→ 칩에서는 inference만 수행
```

따라서 착용 중 자동으로 가중치가 점점 학습되는 online-learning 구조는 아니다.

---

## 10. Gain-Bandwidth Controller: Fig. 13

### 10.1 Gain과 Bandwidth는 다른 기준으로 조절된다

```text
EEG signal amplitude
→ gain 결정

seizure detection status
→ bandwidth 결정
```

#### Gain

ADC output code를 다섯 구간으로 나누고 2초마다 다음 네 단계 중 하나를 선택한다.

```text
52 dB
60 dB
72 dB
80 dB
```

- 작은 신호: gain 증가
- 큰 신호: gain 감소
- 목적: 작은 EEG의 분해능 확보와 큰 EEG의 ADC saturation 방지

#### Bandwidth

- Detection mode: 30 Hz
- Recording mode: 100 Hz

### 10.2 카메라 비유

- **Gain** = 노출·밝기
  어두우면 높이고, 너무 밝으면 낮춘다.
- **Bandwidth** = 담는 정보의 범위
  평상시에는 필요한 범위만 보고, 사건이 검출되면 더 넓게 기록한다.

### 10.3 Header에 설정값 저장

gain이 바뀌면 같은 실제 EEG도 ADC code가 달라지므로, feature와 raw EEG packet에 당시의 다음 정보를 함께 기록한다.

- channel
- gain
- bandwidth

나중에 원래 신호를 해석하기 위한 촬영 metadata와 같다.

---

## 11. Analog Front-End: CS-CCIA, Fig. 14–15

### 11.1 해결해야 할 네 문제

- 50/60 Hz common-mode interference
- 증폭기의 저주파 \(1/f\) noise와 offset
- 큰 electrode DC offset
- dry electrode의 높은 impedance와 mismatch

논문은 Chopper와 세 개의 loop를 역할별로 배치한다.

| 문제 | 회로 | 비유 |
|---|---|---|
| 저주파 EEG와 회로 잡음이 겹침 | Chopper | 신호에 표식을 붙여 다른 주파수로 운반 |
| 입력 임피던스 저하 | IBL | 전극이 공급할 전류를 뒤에서 대신 보조 |
| 전극 DC offset | DSL | 천천히 기운 배를 자동 수평 보정 |
| 증폭기 자체 offset·mismatch | OCL | 빈 저울의 영점 오차 보정 |

### 11.2 Instrumentation Amplifier

두 전극의 차이는 키우고 공통으로 들어온 간섭은 억제한다.

\[
V_{\text{out}}\propto V_A-V_B
\]

공통 성분을 제거하는 능력이 CMRR이다.

### 11.3 Chopper Stabilization

EEG는 저주파이고 증폭기의 \(1/f\) noise도 저주파에 크다. 입력 EEG를 4 kHz 부근으로 변조해 증폭한 뒤 다시 복원함으로써 원하는 신호와 회로의 저주파 잡음을 분리한다.

```text
저주파 EEG
→ 4 kHz 부근으로 이동
→ 증폭
→ 저주파로 복원
```

### 11.4 IBL — Impedance Boosting Loop

입력 chopper를 coupling capacitor보다 앞에 배치하면 mismatch까지 modulation해 CMRR을 높일 수 있지만 입력 임피던스가 저하될 수 있다.

IBL은 출력의 일부를 입력으로 되돌려 입력에 필요한 전류 일부를 대신 공급한다.

```text
전극이 직접 공급해야 할 입력 전류 감소
→ 전극이 느끼는 부하 감소
→ effective input impedance 증가
```

별도 능동 block 없이 피드백을 이용해 추가 전력을 최소화한다.

### 11.5 DSL — DC Servo Loop

전극–피부 접촉에서 생기는 큰 electrode DC offset이 증폭기를 포화시키지 않도록, 출력의 매우 느린 DC 성분을 감지해 반대 방향 보정값을 되먹임한다.

EEG는 0.5 Hz부터 보존해야 하므로 DSL은 매우 느리게 동작해야 한다.

실제 거대한 저항 대신 off-state PMOS pseudo-resistor를 사용해 작은 10 pF MIM capacitor로 sub-Hz cutoff를 구현한다.

### 11.6 OCL — Offset Cancellation Loop

트랜지스터 mismatch로 생긴 증폭기 자체 offset을 감지해 반대 보정 전류를 만든다. 4 kHz chopping frequency 부근에 notch 특성도 형성해 chopping spike 억제 overhead를 줄인다.

### 11.7 전체 역할

> CS-CCIA는 chopper로 원하는 EEG와 저주파 회로 잡음을 분리하고, IBL로 전극의 부하를 줄이며, DSL로 전극 DC offset을 제거하고, OCL로 증폭기 자체 영점 오차를 보정하는 전치증폭기이다.

채널당 소비전력은 약 2.5 μW이다.

---

## 12. ASPU: Fig. 16

### 12.1 역할

CS-CCIA가 저잡음 기본 증폭을 담당하면 ASPU는 다음을 수행한다.

- 추가 gain 설정
- 30/100 Hz low-pass bandwidth 설정
- correlated double sampling
- offset·finite-gain 보정

### 12.2 Switched-Capacitor Amplifier

#### Sampling phase

CS-CCIA 출력 전압을 gain-control capacitor에 전하로 저장한다.

#### Amplification phase

저장된 전하를 더 작은 feedback capacitor로 옮겨 capacitor ratio에 따라 전압을 확대한다.

\[
\text{Gain}\approx\frac{C_{\text{in}}}{C_{\text{feedback}}}
\]

### 12.3 Gain 단계

ASPU 추가 gain:

```text
×4
×10
×30
×100
```

CS-CCIA의 기본 gain과 합쳐 전체 channel gain은 약:

```text
52 / 60 / 72 / 80 dB
```

### 12.4 CDS

빈 체중계의 오차와 사람을 올린 측정값을 연속해서 측정한 뒤 차를 구하는 것처럼, 두 sampling phase의 공통 offset을 제거한다.

### 12.5 Bandwidth

- 발작 감지: 약 30 Hz
- 발작 기록: 약 100 Hz

gain은 **신호 진폭** 기준이고, bandwidth는 **발작 상태** 기준이다.

---

## 13. SAR ADC: Fig. 17

이 논문에서 필요한 수준의 요약:

> 10-bit SAR ADC는 입력 전압을 대상으로 이진탐색을 수행하는 판독기이다.

핵심 설계점:

- fully differential
- 10-bit = 1024 level
- 6-bit main DAC + 4-bit sub-DAC
- split-capacitor array로 면적·전력 감소
- 한 conversion에 16 clock cycles
- 채널 수에 따라 4–32 kS/s
- 8채널 32 kS/s에서 약 1 μW

ADC는 새로운 알고리즘 기여보다는 전체 SoC에 적합한 저전력 digitizer로 이해한다.

---

## 14. 측정 및 검증 결과

### 14.1 Fig. 18–21 — 아날로그 회로

이 부분의 메시지는 단순하다.

> 설계한 보정·gain·bandwidth 회로가 실제 silicon에서도 의도한 대로 작동한다.

#### Fig. 18

- 기본 gain 약 40 dB
- DSL 활성화 시 HPF cutoff 약 70 mHz
- OCL 활성화 시 4 kHz chopping frequency 부근 suppression

#### Fig. 19

0.5–100 Hz integrated noise RTI:

- OCL only: 약 0.83 μV\(_\mathrm{rms}\)
- DSL + OCL: 약 0.91 μV\(_\mathrm{rms}\)

추가 보정 회로를 사용해도 noise 증가를 제한했다.

#### Fig. 20–21

- 네 gain 단계가 구분됨
- 30/100 Hz bandwidth 전환 확인

### 14.2 Fig. 22 — CHB–MIT 발작 EEG 검증

- 24명
- 906시간 이상 surface EEG
- 환자별 일부 데이터로 학습
- 나머지 데이터를 칩의 external digital interface에 입력

#### 결과

| 지표 | On-chip | MATLAB |
|---|---:|---:|
| 평균 detection rate | 82.7% | 83.0% |
| false-positive rate | 4.5% | 4.0% |

환자별 detection rate:

- 최고 88.0%
- 최저 71.4%

핵심 메시지:

> 알고리즘을 실제 하드웨어로 구현했는데 MATLAB simulation과 성능 차이가 작았다.

#### 지표 해석 주의

이 detection rate는 실제 발작 지속 구간에서 반복 classification 중 몇 비율을 seizure로 판정했는가에 가까우며, 발작 사건 100개 중 몇 개를 포착했는지 나타내는 event-level sensitivity와 같지 않다.

false-positive rate도 하루 오경보 횟수와 직접 동일하지 않다.

### 14.3 Fig. 23 — 전체 SoC 검증

건강한 사람의 이마에 다음 2채널을 구성했다.

```text
Fp1–F3
Fp2–F4
+ common reference
```

rapid-eye-blink를 다음 기준으로 학습했다.

```text
5초 안에 10회 이상 눈 깜빡임
```

- 4시간 연속 동작
- 2초 이내 84.4% 검출
- 8채널 기준 2.03 μJ/classification

#### 중요한 구분

| 실험 | 실제로 검증한 것 |
|---|---|
| CHB–MIT 발작 EEG | 디지털 특징 추출·SVM 프로세서 |
| rapid-eye-blink | 전극 → AFE → ADC → 분류기 전체 신호 경로 |
| 실제 발작 환자 장기 착용 | 수행하지 않음 |

### 14.4 Fig. 24 — 칩 성적표

- 0.18-μm 1P6M CMOS
- 5 mm × 5 mm
- 8-channel AFE power: 총 66 μW
- AFE noise RTI: 0.91 μV\(_\mathrm{rms}\)
- CS-CCIA NEF: 약 5.12
- ADC: 10-bit, 4 kS/s/channel
- 64 KB SRAM
- raw EEG 최대 약 120초 저장
- overall energy: 2.03 μJ/classification
- 128 classifications/s

---

## 15. 이 논문의 핵심 기여

### 15.1 System integration

8채널 EEG acquisition, feature extraction, patient-specific classification, raw-data memory를 하나의 SoC에 통합했다.

### 15.2 Algorithm–hardware co-design

정확도만 높은 알고리즘이 아니라 하드웨어 구현 비용까지 고려했다.

- 0–28 Hz를 7개 sub-band로 제한
- linear SVM 선택
- DQ-LUT로 fixed-coefficient FIR 최적화
- 채널별 feature engine과 공유 classification engine

### 15.3 Adaptive analog–digital loop

디지털 결과가 아날로그 회로를 제어한다.

```text
signal amplitude → gain
seizure status → bandwidth
```

단순 recording chip이 아니라 측정 조건을 스스로 바꾸는 adaptive sensor이다.

### 15.4 Detection과 Recording 분리

항상 100 Hz raw EEG를 처리하지 않고:

```text
저전력 감지
→ 사건 발생 시 고정보량 기록
```

으로 duty를 분리했다.

### 15.5 후속 closed-loop neural interface의 기반

발작 감지 결과를 기록뿐 아니라 자극 trigger로 확장할 수 있는 architecture를 제시했다.

---

## 16. 한계와 비판적 평가

### 16.1 실제 간질 환자의 전체 시스템 검증 부재

발작 EEG는 디지털 데이터로 프로세서에 넣었고, 실제 전극부터 전체 시스템을 통과한 실험은 rapid-eye-blink였다.

### 16.2 8채널 지원과 실제 신체 시험의 차이

칩은 최대 8채널이지만 실제 사람에게 전체 SoC로 보여준 것은 2채널이다.

### 16.3 환자별 전극 위치를 최적화하지 않음

환자별 SVM은 사용하지만, 어떤 electrode/montage가 환자의 발작을 가장 잘 포착하는지는 자동 선택하지 않는다.

### 16.4 Off-chip training과 fixed patient parameters

\(W,\beta\)는 외부에서 학습 후 입력한다. 장기적으로 발작 양상이 변하거나 새로운 seizure phenotype이 나타나도 자동 적응하지 않는다.

### 16.5 Pre-trigger raw EEG 부재

최근 6초 특징은 사용하지만 발작 검출 전 raw EEG circular buffer는 설명되지 않는다.

### 16.6 지표의 임상적 직관성 제한

82.7% detection rate와 4.5% false-positive rate가 실제 하루 발작 사건 민감도·일일 오경보 부담으로 바로 환산되지는 않는다.

### 16.7 실생활 artifact 검증 제한

움직임, 근전도, 장기 dry-electrode 접촉 변화, 수면 자세, 땀 등 real-world wearable 조건을 충분히 검증하지 않았다.

---

## 17. 논문을 읽으며 직접 제기한 질문

### Q1. 환자별로 발작 시작 위치와 전파 양상이 다르면 최적 전극 위치도 환자마다 달라야 하지 않는가?

#### 논문의 답

- 환자별 SVM은 제공
- 환자별 electrode/channel selection은 제공하지 않음

#### 확장 질문

> 분류기뿐 아니라 sensing geometry도 patient-specific이어야 하지 않는가?

---

### Q2. 8채널 칩을 실제 사람에게 8채널로 검증했는가?

#### 논문의 답

- CHB–MIT 발작 데이터: 저장된 digital EEG 입력
- 전체 SoC human test: 2-channel rapid-eye-blink

#### 확장 질문

> 실제 간질 환자에게 8채널 wearable system을 장기간 적용하면 성능과 착용성이 어떻게 달라지는가?

---

### Q3. 발작을 검출한 뒤 기록을 시작하면 발작 직전 raw EEG는 사라지지 않는가?

#### 논문의 답

- 최근 6초의 spectral feature는 사용
- pre-trigger raw circular buffer는 명시되지 않음

#### 확장 질문

> 초저전력 rolling buffer로 발작 전후 raw EEG를 함께 보존할 수 있는가?

---

### Q4. 환자별 학습값은 착용 중 계속 갱신되는가?

#### 논문의 답

- off-chip training
- \(W,\beta\)를 register에 입력
- on-chip inference only

#### 확장 질문

> 새로운 발작이 생길 때 one-shot learning이나 online tuning으로 모델을 업데이트할 수 있는가?

---

### Q5. 같은 환자의 발작 양상은 장기적으로 안정적인가?

#### 논문의 범위

- 환자 간 차이는 반영
- 환자 내 장기 변화, 약물·수면·질병 진행에 따른 concept drift는 검증하지 않음

#### 확장 질문

> 환자별 signature를 유지하면서 시간에 따른 변화에도 적응하는 모델을 만들 수 있는가?

---

### Q6. 환자마다 새 발작을 수집해 학습하지 않고도 사용할 수 있는가?

#### 확장 질문

> 여러 환자에게 공통된 발작 표현을 먼저 학습하고, 새 환자의 정상 EEG만 짧게 calibration하여 발작 예시 없이 배치할 수 있는가?

이 질문은 이후 SciCNN의 patient-independent, 0-shot-retraining 방향과 직접 연결된다.

---

## 18. 내가 제기한 질문과 실제 후속 연구의 연결

> **해석 원칙**
> 아래 논문들은 이번 2013년 논문을 읽으며 자연스럽게 제기한 질문과 대응되는 후속 연구다. 일부는 제목·초록·서지 수준으로만 확인했으며, **각 논문의 세부 방법과 성능은 별도 원문 정독이 필요하다.**

| 내가 제기한 질문 | 관련 후속 연구 | 연결점 |
|---|---|---|
| 환자별 최적 전극·채널 위치는? | **Optimizing Electrode Configurations for Wearable EEG Epileptic Seizure Detection** (2023) | wearable EEG의 electrode 수와 configuration을 체계적으로 비교 |
| 채널 수를 줄여도 발작을 잡을 수 있나? | **Seizure Detection With Reduced Electroencephalogram Channels** (2023) | reduced-channel detection과 channel selection trade-off |
| 감지만 하지 말고 자극까지 할 수 있나? | **A 16-Channel Patient-Specific Seizure Onset and Termination Detection SoC With Impedance-Adaptive Transcranial Electrical Stimulator** (2015) | onset·termination detection과 noninvasive stimulation 통합 |
| 고정 환자별 모델이 장기 변화에 적응할 수 있나? | **A Patient-Specific Closed-Loop Epilepsy Management SoC With One-Shot Learning and Online Tuning** (2022) | 적은 예시로 초기화하고 online tuning 수행 |
| 새 환자마다 발작 EEG를 수집하지 않을 수 있나? | **Seizure-Cluster-Inception CNN (SciCNN): A Patient-Independent Epilepsy Tracking SoC With 0-Shot-Retraining** (2023) | patient-independent representation과 zero-seizure-shot deployment 지향 |
| 더 낮은 latency와 환자 독립성을 함께 얻을 수 있나? | **A 16.4 nJ/Class Patient-Independent Prototype-Based Spatio-Temporal CNN Processor With Forward-Inference-Based Adaptation for Robust and Low-Latency Seizure Detection** (ISSCC 2026) | prototype-based adaptation과 patient-independent low-latency processing |

### 18.1 SciCNN의 zero-shot에 대한 현재 이해 — 검토필요

> **원문 미정독**
> 다음 내용은 후속 논문을 정식으로 같이 읽기 전의 예비 이해이며, 정확한 cluster labeling·calibration protocol·성능 평가는 원문으로 다시 확인해야 한다.

현재 이해한 핵심 사고방식은 다음과 같다.

```text
여러 기존 환자의 정상·발작 EEG
→ 공통 feature space와 다양한 대표 pattern 학습
        ↓
새 환자
→ 발작 예시는 수집하지 않음
→ 짧은 정상 EEG calibration으로 이 환자의 정상 영역 표시
        ↓
나머지 의심 cluster를 이용해 발작 추적
```

따라서 엄밀히는 완전한 `no-data zero-shot`보다:

> **zero-seizure-shot + normal-only calibration**

으로 이해하는 것이 타당할 가능성이 있다.

---

## 19. 연구자적 질문 패턴에 대한 자기평가

> **이번 읽기에서 드러난 강점**
> 논문이 명시한 성공 결과만 따라간 것이 아니라, 시스템의 경계에서 다음 질문을 즉시 제기했다.
>
> - 분류기만 patient-specific이면 충분한가?
> - sensing geometry도 patient-specific이어야 하지 않는가?
> - 검출 전 raw EEG는 왜 남지 않는가?
> - off-chip에서 한 번 학습한 모델이 장기적으로 유지되는가?
> - 8채널이라고 했는데 실제 환자에서 어디까지 검증했는가?
> - 환자별 발작 예시 없이 배치할 수 있는가?

이 질문들의 상당수가 이후 실제 연구 주제와 대응한다는 점은, **논문의 limitation을 임상적·시스템적 후속 문제로 변환하는 연구 습관이 작동하고 있다는 근거**로 볼 수 있다.

다만 다음을 구분해야 한다.

- 좋은 질문을 독립적으로 재발견했다는 것
- 그 질문이 완전히 새로운 연구 주제라는 것

은 동일하지 않다.

연구자적 강점은 “아무도 생각하지 않은 질문을 즉시 만들었다”는 데만 있지 않다. 더 중요한 것은:

```text
논문 구조 이해
→ 검증 범위와 미검증 범위 구분
→ 환자·사용 맥락에서 병목 발견
→ 후속 문헌으로 질문 검증
→ 남은 gap을 다시 좁힘
```

이라는 과정을 자연스럽게 수행한 점이다.

---

## 20. 생성형 AI 인공지능을 활용한 학습 및 검토 기록

### 20.1 비유를 통해 이해한 핵심

#### 전체 SoC

8개의 감시 마이크와 자동 판독·기록 기능이 들어간 지능형 경비실.

#### Spectral–spatial–temporal feature

- 어떤 음역인가?
- 어느 마이크에서 들리는가?
- 최근 6초 동안 어떻게 변했는가?

#### DQ-LUT

44개 곱셈 문제를 매번 풀지 않고:

```text
대칭성으로 22묶음
→ 4묶음씩 가능한 답 16개를 미리 저장
→ bit별로 찾아서 shift·누적
```

#### CS-CCIA

문제별 전문 보정 장치가 증폭기 주변을 둘러싼 구조.

- Chopper: 신호 위치 이동
- IBL: 전극 부하 완화
- DSL: 전극 DC 기울기 보정
- OCL: 회로 영점 오차 보정

#### Gain과 Bandwidth

카메라의 서로 다른 두 제어축.

- gain = 밝기·노출
- bandwidth = 담는 정보 범위

### 20.2 검토필요한 이해

> **생성형 AI 보조 설명 — 원문·회로 전공자 검토필요**

1. 3 × 2초 feature vector가 하드웨어 내부에서 구체적으로 어떤 register·bit allocation으로 유지되는지
2. 7-D feature와 70-bit vector, 3-window temporal concatenation 사이의 정확한 데이터 표현
3. IBL의 정확한 loop gain과 input impedance boosting 식
4. OCL과 DSL이 동시에 동작할 때 stability와 noise trade-off
5. rapid-eye-blink 시험에서 사용한 정확한 electrode·bias·ground 구성
6. CHB–MIT train/test split이 발작 단위·시간 단위·recording 단위 중 어떻게 구성되었는지
7. detection rate와 false-positive rate의 정확한 denominator와 임상적 환산
8. 64 KB SRAM의 120초 저장 계산에서 실제 channel 수·sample rate·bit packing 조건

---

## 21. 유담 교수님께 확인할 질문

1. 이 연구에서 8채널의 위치는 어떤 임상적·알고리즘적 기준으로 정했는가?
2. 환자별 electrode/channel selection까지 통합하려는 시도가 당시에도 있었는가?
3. 최근 6초의 feature와 별개로 pre-trigger raw EEG buffer를 넣지 않은 가장 큰 이유는 SRAM 면적·전력·architecture 중 무엇이었는가?
4. CHB–MIT 검증에서 각 환자의 training과 testing 구간은 어떤 방식으로 분리했는가?
5. 실제 간질 환자에게 전체 analog–digital path를 적용하기 전 가장 큰 장애물은 IRB·전극·artifact·전력 중 무엇이었는가?
6. DQ-LUT의 4-input 최적점은 공정·filter order·word length가 달라지면 얼마나 이동하는가?
7. 2013년 fixed patient-specific SVM에서 2022년 one-shot/online tuning으로 넘어갈 때 가장 어려웠던 회로 병목은 무엇이었는가?
8. SciCNN의 `0-shot-retraining`은 새로운 환자의 정상 calibration까지 포함해 어떤 의미로 정의했는가?
9. 향후 wearable epilepsy system에서 patient-specific channel geometry와 patient-independent classifier 중 어느 방향이 더 실용적이라고 보는가?

---

## 22. 논문에서 바로 가져갈 수 있는 연구 논리

### 문제

- 발작은 환자마다 EEG signature가 다르다.
- 장기 raw EEG 무선 전송은 전력과 이동성에 부담이 된다.
- 다채널 주파수 분석은 필터 면적이 매우 크다.
- EEG amplitude가 변해 고정 gain으로는 saturation과 분해능 저하가 발생한다.

### 해결

- 7-band, 3 × 2-second spectral–spatial–temporal feature
- patient-specific linear SVM
- fixed-coefficient FIR용 DQ-LUT
- adaptive gain and 30/100 Hz bandwidth
- event-triggered raw EEG recording
- AFE, ADC, processor, SRAM의 SoC 통합

### 검증

- analog block measurement
- CHB–MIT stored EEG processor test
- MATLAB–chip 결과 비교
- rapid-eye-blink whole-system demonstration
- chip power·area·noise 측정

### 남은 gap

- 실제 간질 환자 장기 wearable validation
- patient-specific electrode configuration
- pre-trigger raw buffer
- on-device or online adaptation
- event-level clinical metric
- motion·contact artifact robustness

---

## 23. 최종 평가

이 논문은 현재 기준으로 보면 분류 정확도나 실제 환자 검증이 제한적이다. 그러나 2013년 시점에 다음을 하나의 칩에 통합했다는 점이 핵심이다.

```text
저잡음 8채널 EEG acquisition
+ 주파수 특징 추출
+ 환자별 머신러닝 분류
+ adaptive analog feedback
+ event-triggered raw recording
```

가장 인상적인 부분은 개별 회로 기록보다 **임상 문제를 회로·알고리즘·시스템의 공동설계로 해결한 방식**이다.

### 내 관점에서의 가치

- neural interface 연구가 회로 하나만의 문제가 아님을 보여준다.
- 임상적 필요가 feature, memory, power mode를 결정한다.
- 알고리즘의 구조가 회로 면적과 전력을 직접 바꾼다.
- 논문의 limitation에서 이후 연구 계보가 자연스럽게 나온다.
- “환자에게 실제로 어떤 정보가 남고 어떤 상황에서 실패하는가?”라는 질문을 계속 유지해야 한다.

> 최종 한 문장:
> **환자별 발작을 온칩에서 감시하고 사건 발생 후 원시 EEG를 기록하는 초기 통합 SoC이며, 이후 closed-loop stimulation과 adaptive·patient-independent epilepsy AI SoC로 발전한 연구 계보의 출발점이다.**

---

## 24. 관련 노트

- Concurrent Body-Coupled Powering and Communication ICs With a Single Electrode
- Body-Coupled Powering에서 SkinECG까지
- Wearable EEG
- Epilepsy
- Closed-Loop Neural Interface
- On-Device Machine Learning
- Analog Front-End
- Chopper Stabilization
- Distributed Arithmetic
- Support Vector Machine
- SciCNN
- Patient-Specific Electrode Selection

---

## 25. 다음 읽기 후보

### 우선순위 A — 같은 계보를 시간순으로

1. **A 16-Channel Patient-Specific Seizure Onset and Termination Detection SoC With Impedance-Adaptive Transcranial Electrical Stimulator**
   `감지 → 기록`에서 `감지 → 자극 → 종료 확인`으로 확장

2. **A Patient-Specific Closed-Loop Epilepsy Management SoC With One-Shot Learning and Online Tuning**
   fixed parameter에서 적은 예시와 장기 적응으로 확장

3. **Seizure-Cluster-Inception CNN (SciCNN): A Patient-Independent Epilepsy Tracking SoC With 0-Shot-Retraining**
   환자별 발작 사전 수집 자체를 줄이는 방향

### 우선순위 B — 이번에 직접 제기한 질문

1. **Optimizing Electrode Configurations for Wearable EEG Epileptic Seizure Detection**
2. **Seizure Detection With Reduced Electroencephalogram Channels**

---
