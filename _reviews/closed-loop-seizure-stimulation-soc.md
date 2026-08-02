---
title: "발작 감지에서 자극까지 연결한 16채널 EEG SoC"
title_en: "A 16-Channel EEG SoC from Seizure Detection to Stimulation"
title_ja: "発作検出から刺激までつなぐ16チャネルEEG SoC"
paper_title: "A 16-Channel Patient-Specific Seizure Onset and Termination Detection SoC With Impedance-Adaptive Transcranial Electrical Stimulator"
topic: Closed-Loop Neural Interface
year: 2015
summary: "두 채널이 AFE를 공유하고 하나의 필터를 16채널·7대역에 재사용해 발작 시작과 종료를 검출한 뒤, 임피던스 적응형 두피 자극으로 연결하는 폐루프 SoC를 분석했습니다. 실제 환자 치료효과는 검증되지 않았다는 경계도 구분했습니다."
summary_en: "An analysis of a closed-loop SoC that shares analog front ends, reuses one filter across 16 channels and seven bands, detects seizure onset and termination, and triggers impedance-adaptive stimulation—without claiming verified therapeutic efficacy in patients."
summary_ja: "AFE共有と16チャネル・7帯域でのフィルタ再利用により発作の開始・終了を検出し、インピーダンス適応型刺激へ接続する閉ループSoCを分析しました。患者での治療効果は未検証であることも明確に区別しています。"
reading_time: 28
order: 4
math: true
tags:
  - EEG
  - Closed-Loop Stimulation
  - Seizure Detection
  - Patient-Specific SVM
  - Neural Interface SoC
---

> **출처 구분**
> - **논문 내용**: 업로드된 2015년 JSSC 원문을 기준으로 정리하였다.
> - **비판적 해석**: 논문의 실험 설계와 주장 범위를 바탕으로 한 검토이다.
> - **확장 아이디어**: 논문에 직접 제시된 내용이 아니라, 정독 과정에서 전민성이 제안한 시스템 구상과 후속 연구 질문이다.

---

## 1. 논문 정보

**논문명**
*A 16-Channel Patient-Specific Seizure Onset and Termination Detection SoC With Impedance-Adaptive Transcranial Electrical Stimulator*

**저자**
Muhammad Awais Bin Altaf, Chen Zhang, Jerald Yoo

**학술지**
IEEE Journal of Solid-State Circuits, 2015

**핵심 키워드**
16-channel EEG, patient-specific seizure detection, seizure termination, DCCR-AFE, FTDM, D2A-LSVM, digital hysteresis, impedance-adaptive tES, closed-loop SoC

---

## 2. 한 문장 요약

> **16채널 두피 EEG를 저전력으로 연속 측정하고, 환자별 발작 시작과 종료를 검출한 뒤 피부–전극 임피던스에 맞춰 비침습적 전기자극을 자동으로 켜고 끄는 폐루프 SoC를 구현한 논문이다. 다만 실제 뇌전증 환자의 발작 억제 효과는 검증하지 않았다.**

---

## 3. 연구 배경과 임상적 문제

뇌전증(epilepsy)은 반복적인 비유발 발작이 발생할 소인을 가진 만성 신경계 질환이다. 과거 한국어 병명인 ‘간질’과 같은 질환을 뜻하지만, 현재는 낙인 문제 등을 고려해 ‘뇌전증’이라는 용어를 사용한다.

발작(seizure)은 일시적인 사건이고, 뇌전증은 그러한 발작이 반복될 수 있는 질환이다.

이 논문이 주목한 시간축은 다음과 같다.

```text
정상 EEG
→ Electrical onset
  EEG상 발작 활동 시작
→ Clinical onset
  의식 변화·경련 등 임상 증상 출현
→ 발작 확산·지속
```

논문은 electrical onset이 clinical onset보다 약 0.5–10초 앞설 수 있다고 설명한다. 따라서 이 시스템은 **발작을 미리 예측하는 장치가 아니라**, 이미 EEG상 시작된 발작을 빠르게 감지해 임상 증상, 전신화, 낙상, 지속상태 등 더 심한 결과로 진행하기 전에 자극하려는 장치이다.

### DBS, VNS, tES의 위치

- **DBS**: 뇌 깊은 부위에 전극을 삽입해 자극하는 침습적 치료
- **VNS**: 목의 미주신경에 전극을 감아 자극하는 이식형 치료
- **tES**: 두피 표면 전극을 통해 전류를 흘리는 비침습적 자극

논문은 DBS와 VNS의 수술·감염·출혈·흉터·교체 부담을 동기로 들며, 비침습적 tES를 이용한 환자 친화적 폐루프 시스템을 지향한다.

다만 이 논문이 주장하는 것은 **비침습 치료가 항상 침습 치료보다 우월하다**는 것이 아니라, 충분한 치료 효과를 확보할 수 있다면 더 낮은 침습성으로 같은 목적을 달성할 수 있지 않겠느냐는 연구 방향에 가깝다.

---

## 4. 2013년 시스템에서 2015년 시스템으로의 진화

| 2013년 SoC | 2015년 SoC |
|---|---|
| 8채널 | 16채널 |
| 발작 시작 검출 | 발작 시작 + 종료 검출 |
| 검출 후 raw EEG 기록 | 검출 후 기록 + 자동 자극 |
| 단일 LSVM 중심 | 두 LSVM + digital hysteresis |
| 채널별 증폭기 | 두 채널이 증폭기 하나를 공유 |
| 모니터링 중심 | 비침습 폐루프 치료 지향 |

핵심 변화는 다음과 같다.

```text
2013
측정 → 판단 → 기록

2015
측정 → 시작 판단 → 자극 → 종료 판단 → 자극 중단
```

---

## 5. 전체 시스템 구조

SoC는 크게 세 부분으로 구성된다.

```text
16채널 EEG
↓
DCCR-AFE
아날로그 신호 획득
↓
ADC
↓
FTDM 특징 추출
↓
WAA + 두 LSVM + digital hysteresis
발작 시작·종료 판정
↓
PVTES
임피던스 적응형 두피 자극
```

또한 64 kB SRAM이 통합되어 있으며, 논문은 발작 사건이 검출되었을 때 clinical onset 전후의 raw EEG를 저장한다고 설명한다.

> **기록 범위 해석**
> Electrical onset이 clinical onset보다 앞서므로 임상 증상 이전 EEG는 저장할 수 있다. 그러나 **electrical onset 검출 이전의 raw EEG를 circular buffer로 얼마 동안 보존하는지**는 본문에서 충분히 명확하지 않다.

---

## 6. DCCR-AFE: 두 채널이 증폭기 하나를 공유하는 방법

### 6.1 기본 문제

16채널 각각에 독립적인 증폭기를 두면 면적과 전력이 크게 증가한다. 저자들은 두 EEG 채널이 하나의 CS-CCIA를 시간 분할로 공유하도록 설계했다.

```text
CH1 ┐
    ├→ 공유 CS-CCIA → 채널별 PGA
CH2 ┘
```

16채널이므로 CS-CCIA는 8개만 필요하다.

### 6.2 사진기사 비유

> 사진기사 한 명이 조명 조건이 다른 두 방을 번갈아 촬영한다.
> 방을 바꿀 때마다 카메라를 처음부터 재설정하지 않고, 각 방의 마지막 설정을 저장했다가 다시 불러온다.

회로 대응은 다음과 같다.

| 회로 요소 | 비유 |
|---|---|
| CH1, CH2 | 조건이 다른 두 방 |
| 공유 증폭기 | 사진기사와 카메라 한 대 |
| 채널별 EDO | 방마다 다른 기본 조명 |
| DSL 상태 저장 | 방별 노출·DC 보정값 저장 |
| LNA 내부 상태 저장 | 카메라 센서의 직전 안정 상태 저장 |
| PGA | 채널별 최종 확대 배율 |

### 6.3 채널별 보정값이 다른 이유

주된 이유는 두개골의 신호 분산보다 **전극–피부 접촉 조건이 채널마다 다르기 때문**이다.

- 땀과 수분
- 접촉 압력
- 머리카락
- 전극 젤 상태
- 움직임
- 전극 재질과 피부 상태

이로 인해 각 채널의 전극 DC offset과 임피던스가 달라진다. 따라서 공유 증폭기가 CH1과 CH2를 오갈 때 각 채널에 맞는 DSL 보정값과 LNA 내부 동작점을 따로 기억해야 한다.

두개골의 volume conduction은 채널별 EEG 파형과 진폭이 달라지는 이유이고, 전극–피부 접촉은 채널별 아날로그 보정 상태가 달라지는 주된 이유이다.

### 6.4 Analog sleep mode와 상태 저장

한 채널이 동작하는 동안 다른 채널은 완전히 초기화되지 않고, 커패시터에 내부 상태를 저장한 채 analog sleep mode로 대기한다.

- `C_DSL-CH1`, `C_DSL-CH2`: 채널별 DSL 보정 상태
- `C_OTA-CH1`, `C_OTA-CH2`: 채널별 LNA 내부 상태

채널 전환 시 이 값을 복원함으로써 안정화 시간을 줄인다.

### 6.5 두 종류의 settling time

#### 전원 최초 켜짐: 1시간 이상 → 약 0.5초

DSL은 0.5 Hz 부근의 느린 EEG를 보존해야 하므로 정상 운용 중에는 매우 느리게 반응한다. 이 때문에 큰 전극 DC offset을 처음 제거하는 데 한 시간 이상 걸릴 수 있다.

FS-DSL은 초기화 때만 pseudo-resistor의 저항을 낮춰 빠르게 보정한 뒤, 정상 측정에서는 다시 큰 저항 상태로 돌아간다.

```text
전원 ON
→ Fast settling mode
→ 큰 EDO를 약 0.5초 안에 제거
→ Normal mode
→ 느린 EEG 보존
```

#### CH1 ↔ CH2 전환: 61 μs → 40 μs 미만

LNA 시간상수는 약 8.7 μs이고, 99.9% settling에는 약 61 μs가 필요하다. 채널별 DSL·LNA 상태를 저장하고 복원해 실제 전환 후 안정화 시간을 40 μs 미만으로 줄였다.

### 6.6 DC-CHOP

기존에는 다음 두 스위치 기능이 별도로 필요하다.

1. 저주파 EEG를 증폭기 저주파 잡음과 분리하기 위한 chopper
2. CH1과 CH2 중 어느 채널을 선택할지 정하는 multiplexer

DC-CHOP은 이 두 기능을 하나의 스위치망으로 합쳤다.

- chopping: 4 kHz
- 채널 전환: 1 kHz

4 kHz chopping과 1 kHz 채널 제어를 결합하면 3 kHz와 5 kHz sideband가 생긴다.

```text
4 kHz - 1 kHz = 3 kHz
4 kHz + 1 kHz = 5 kHz
```

식 (1)–(6)과 Fig. 8은 이 3·5 kHz 성분이 의도된 신호가 아니라 두 clock이 곱해질 때 생기는 수학적으로 예상 가능한 부산물임을 보인다. 핵심 4 kHz chopping 성분은 유지되지만 입력환산잡음이 약 12% 증가한다.

#### AFE trade-off

- 전류 약 43% 감소
- 면적 약 28% 감소
- 잡음 약 12% 증가
- 채널당 소비전류 0.9 μA
- 입력환산잡음 0.90 μV\(_{rms}\)

> **요약:** 사진기사 한 명이 두 방을 오가더라도, 방별 설정을 저장해 안정적인 사진을 찍도록 만든 구조이다.

---

## 7. FTDM 특징 추출: 필터 하나를 112개처럼 사용

### 7.1 문제

16채널 각각에서 7개 주파수 대역을 분석하려면 단순 구현 시 다음이 필요하다.

```text
16 channels × 7 bands = 112 filter outputs
```

각 필터는 46-tap BPF이므로 하드웨어 부담이 크다.

### 7.2 FTDM 구조

저자들은 하나의 46-tap BPF를 시간과 주파수 양쪽으로 다중화했다.

- 16개의 채널별 46-sample FIFO
- 7세트의 BPF 계수
- 단 하나의 46-tap BPF
- 동작주파수 16 kHz

```text
Band 1: CH1 → CH16
Band 2: CH1 → CH16
...
Band 7: CH1 → CH16
```

EEG는 채널당 128 sample/s, 즉 새 샘플이 약 7.8 ms마다 들어온다.

공유 필터는 16 kHz로 동작하므로:

- 한 계산 슬롯: 62.5 μs
- 16채널 한 대역 처리: 약 1 ms
- 7대역 전체 처리: 약 7 ms

다음 EEG 샘플이 도착하기 전에 모든 계산을 끝낼 수 있다.

> 필터가 절대적으로 매우 빠르다기보다, **EEG가 느리기 때문에 하나의 디지털 연산기를 반복 사용해도 시간 여유가 있다.**

### 7.3 46-tap과 2초 window는 다른 개념

- **46-tap BPF**: 특정 주파수 대역을 추출
- **2초 window**: 추출된 대역 신호의 에너지를 일정 시간 누적

즉 46-tap은 주파수 선택, 2초 window는 시간 평균과 에너지 계산이다.

---

## 8. Windowing: 2초 사진, 1초 판정

네 가지 windowing 방식 중 최종적으로 선택한 방식은 **2초 window + 1초 increment**이다.

```text
FV1 = 0–2초
FV2 = 1–3초
FV3 = 2–4초
FV4 = 3–5초
```

따라서:

> **최근 2초의 EEG를 충분히 관찰하면서, 1초마다 새로운 feature vector를 생성한다.**

이 논문을 가장 간단히 기억하는 문장 중 하나는 다음과 같다.

> **2초 사진, 1초 판정.**

---

## 9. WAA: 변화를 잘 보여주는 채널을 더 믿기

모든 채널이 발작의 시작과 종료를 동일하게 잘 보여주지는 않는다.

WAA(Weight and Average)는 spectral energy 변화가 큰 채널에 더 큰 가중치를 부여한다.

```text
발작 전후 변화가 큼 → 큰 가중치
변화가 작거나 애매함 → 작은 가중치
```

특히 발작 종료 직후에는 postictal slowing이나 억제 상태가 남을 수 있어, 단순히 정상 패턴으로 돌아왔는지만 보는 것보다 공간적 가중치를 이용하는 편이 유리하다.

기존 WAA는 모든 채널을 함께 처리했지만, 이 논문은 인접한 두 채널씩 총 8쌍으로 제한했다.

```text
CH1–CH2
CH3–CH4
...
CH15–CH16
```

이는 국소발작 정보가 관련 없는 채널들에 희석되는 것을 줄이고, gate count와 에너지 소모도 감소시킨다.

- gate count 56% 감소
- 에너지 23% 감소

---

## 10. D2A-LSVM: 민감한 심사위원과 신중한 심사위원

### 10.1 Detector 1

- sensitivity 중심
- box-constraint를 낮추는 방향으로 조정
- 발작을 놓치지 않으려 함
- false positive가 늘 수 있음

### 10.2 Detector 2 + WAA

- specificity 중심
- box-constraint를 높이는 방향으로 조정
- 확실한 경우에만 발작으로 판단
- WAA로 재가공된 feature를 사용

### 10.3 Digital hysteresis

각 Detector 출력은:

- seizure: +1
- non-seizure: -1

두 출력을 합하면:

| Detector 1 | Detector 2 | 합 | 처리 |
|---:|---:|---:|---|
| +1 | +1 | +2 | 발작 방향 증거 |
| -1 | -1 | -2 | 정상 방향 증거 |
| +1 | -1 | 0 | 현재 상태 유지 |
| -1 | +1 | 0 | 현재 상태 유지 |

의견이 다를 때는 상태를 바꾸지 않는다. 또한 patient-specific threshold(PST)만큼 연속된 동의가 있어야 정상→발작 또는 발작→정상으로 전환한다.

### 10.4 LSVM을 선택한 이유

#### 임상·데이터 측면

- 환자별 발작 사례가 적음
- 발작이 수일 또는 수개월 간격으로 발생할 수 있음
- 같은 환자에게도 서로 다른 발작 패턴이 존재할 수 있음
- 복잡한 NLSVM은 제한된 훈련 패턴에 과적합될 위험이 있음

#### 하드웨어 측면

LSVM은 대략 다음 계산으로 끝난다.

\[
W^T X + \beta
\]

반면 NLSVM은 다수의 support vector와 kernel 연산을 반복해야 한다.

따라서 LSVM은:

- 저장 파라미터 감소
- 연산량 감소
- 소비전력 감소
- 외부 업로드 인터페이스 단순화

에 유리하다.

> **중요한 구분**
> LSVM도 학습은 칩 밖에서 수행한다. 단점은 ‘밖에서 학습한다’는 사실 자체가 아니라, **복잡한 모델일수록 칩에 업로드하고 지속 실행해야 할 파라미터와 연산이 커진다는 점**이다.

### 10.5 환자 맞춤형의 의미

\(W\), \(\beta\), `scaleFactor`, `scaleShift`, WAA weight 등은 환자별 데이터로 off-chip training한 뒤 칩에 업로드한다.

따라서 이 시스템은:

- 환자별 모델은 있음
- 실사용 중 온라인 재학습은 없음
- 장기적인 발작 패턴 변화에 자동 적응하지 않음

---

## 11. PVTES: 환자에게 전기신호를 어떻게 주는가

### 11.1 왜 고정 전압만으로는 부족한가

전압 모드에서 전류는 피부–전극 임피던스에 따라 달라진다.

\[
I = \frac{V}{Z}
\]

- 임피던스가 낮으면 전류가 많이 흐름
- 임피던스가 높으면 전류가 적게 흐름

따라서 같은 전압이라도 실제 전달 전하량이 달라질 수 있다.

### 11.2 이 논문의 선택

> **전력 효율이 좋은 voltage-mode stimulation을 사용하되, 피부–전극 임피던스에 맞춰 pulse 수를 조절한다.**

```text
임피던스 낮음
→ pulse 하나당 전달 전하 큼
→ pulse 수 감소

임피던스 높음
→ pulse 하나당 전달 전하 작음
→ pulse 수 증가
```

### 11.3 Biphasic stimulation

자극은 다음 순서로 구성된다.

```text
Cathodic phase
→ Inter-phase delay
→ Anodic phase
→ Electrode shorting
```

한 방향으로 넣은 전하를 반대 방향으로 회수해 순전하 축적을 최소화한다.

\[
Q_{\text{cathodic}} + Q_{\text{anodic}} \approx 0
\]

순전하가 0에 가깝다는 것은 신경자극이 없다는 뜻이 아니라, 장기적으로 특정 방향의 DC 전하가 전극–조직 계면에 쌓이지 않도록 한다는 뜻이다.

### 11.4 임피던스 추정

- 1 MHz 전압 pulse
- 5 pF known capacitor
- 피부–전극 RC relaxation
- 50 MHz 이상 ring oscillator
- 10-bit counter

지연 시간을 counter로 측정해 피부–전극 임피던스를 추정하고, 그 결과로 자극 pulse 수를 결정한다.

같은 counter를 cathodic phase의 up-count와 anodic phase의 down-count에 재사용해 전하 균형도 맞춘다.

PVTES 제어부 소비전력은 2.45 μW이다.

> **전력 수치 해석**
> 2.45 μW는 자극 제어 회로의 저전력 구현을 나타내는 값이며, 환자 조직에 전달되는 전체 치료 에너지와 동일하다고 단정할 수 없다. 실제 전달 에너지는 자극 전압, 임피던스, pulse 폭, pulse 수, 자극 지속시간에 따라 달라진다.

---

## 12. 검증 설계와 결과

### 12.1 발작 분류기

- CHB-MIT EEG database
- 23 patients
- 906 hours
- 198 seizure events
- patient-specific hold-out validation
- 환자별 training dataset 600초
- 훈련 파라미터는 off-chip에서 계산 후 업로드

결과:

- sensitivity: 95.7%
- specificity: 98%
- false alarms: 0.27/h
- latency: 1 s
- classifier energy: 1.85 μJ/classification
- whole SoC: 2.73 μJ/classification

### 12.2 자극 회로

저항·커패시터로 피부–전극 부하를 모사했다.

- 10–100 kΩ 저항 변화에서 pulse 수 조절 확인
- cathodic/anodic charge balance 확인
- 실제 뇌전증 환자의 발작 억제 효과는 검증하지 않음

### 12.3 전체 SoC

전체 감지–판정–자극 연결은 실제 발작이 아니라 **rapid-eye-blink pattern**으로 검증했다.

- 4-channel mode
- Fp1–F3, Fp2–F4
- 2시간 연속 운용
- sensitivity 92%
- specificity 97%
- blink start/end 검출과 PVTES trigger 동시 동작 확인

---

## 13. 이 논문이 실제로 증명한 것과 증명하지 않은 것

### 증명한 것

1. 16채널 EEG AFE를 저전력·소면적으로 통합할 수 있다.
2. 두 채널이 증폭기 하나를 공유하면서도 안정적으로 측정할 수 있다.
3. 하나의 BPF를 16채널 × 7대역에 재사용할 수 있다.
4. 환자별 저장 EEG에서 발작 시작과 종료를 높은 성능으로 분류할 수 있다.
5. 피부–전극 임피던스에 맞춰 pulse 수를 조절할 수 있다.
6. cathodic/anodic charge balance를 맞출 수 있다.
7. 감지 신호가 들어오면 자극기를 자동으로 켜고 끌 수 있다.

### 증명하지 않은 것

1. 이 자극이 실제 뇌전증 환자의 발작을 멈춘다는 것
2. 발작 지속시간이나 전신화를 줄인다는 것
3. 임상 증상을 억제한다는 것
4. 장기간 착용 가능한 16채널 전극 시스템
5. 젤·전선·배터리·무선통신이 포함된 실제 wearable
6. 자극 중 EEG artifact를 제거하며 종료를 계속 검출할 수 있다는 것
7. 환자 상태 변화에 온라인으로 적응한다는 것

> **가장 공정한 결론:**
> 발작을 감지해 전하균형 자극을 자동으로 출력하는 하드웨어 기반은 만들었지만, 그 자극이 실제 사람의 발작을 억제한다는 임상적 폐루프는 검증하지 않았다.

---

## 14. 논문의 강점

1. **시스템 수준 통합**
   AFE, ADC, SRAM, 특징 추출, 두 LSVM, 자극기를 하나의 SoC에 통합했다.

2. **16채널 확장**
   채널 공유와 FTDM으로 전력·면적을 억제하면서 16채널을 구현했다.

3. **발작 종료 검출**
   onset detection에 머물지 않고 termination detection을 포함해 자극 중단까지 고려했다.

4. **민감도–특이도 절충 구조**
   두 분류기와 digital hysteresis를 이용해 빠른 반응과 오경보 억제를 동시에 노렸다.

5. **임피던스 적응형 자극**
   환자와 시간에 따라 달라지는 피부–전극 임피던스를 회로가 보정한다.

6. **전하균형 안전성 고려**
   biphasic stimulation과 shorting phase로 잔류 전하를 줄였다.

---

## 15. 핵심 한계

### 15.1 실제 치료효과 미검증

이 논문의 가장 큰 한계이다. 분류기는 실제 환자 저장 EEG로 검증했지만, 폐루프 치료는 실제 뇌전증 환자에게 적용하지 않았다.

### 15.2 자극 프로토콜의 임상적 타당성 부족

다음이 충분히 규정되지 않는다.

- 자극 전극 위치
- 환자별 최적 전압과 전류
- 반복 주기
- 자극 지속시간
- 실제 뇌에 도달하는 유효 전기장
- 용량–반응 관계

회로는 정해진 자극을 안정적으로 전달할 수 있지만, 어떤 자극이 실제 치료에 효과적인지는 별도 문제이다.

### 15.3 자극 artifact

EEG는 μV 수준인데 자극 신호는 훨씬 크다. 자극 중 AFE 포화, 오검출, 종료 검출 실패 가능성이 있다.

필요한 후속 기술:

- stimulation blanking
- input protection
- 빠른 AFE recovery
- artifact subtraction
- sensing/stimulation electrode separation
- 자극 중 termination detection

### 15.4 환자별 모델의 장기 적응 부재

- off-chip training
- fixed model
- online learning 없음
- 약물, 수면, 전극 접촉, 질병 경과에 따른 drift 대응 부족

### 15.5 발작 예측이 아니라 발작 검출

electrical onset 이후 개입한다. 발작을 사전에 막는 prediction 시스템은 아니다.

### 15.6 실제 착용 시스템 미완성

칩은 작지만 다음은 해결되지 않았다.

- 장기 전극
- 젤과 접착
- 전선
- 전원
- PMIC
- 무선통신
- 충전
- 외관
- 세척과 유지관리
- 환자·간호사 workflow

---

## 16. 정독 과정에서 제안한 확장 아이디어

> **아래 내용은 논문에 직접 포함된 제안이 아니라, 논문을 읽으며 전민성이 제시한 시스템 아이디어이다.**

### 16.1 치료 철학

> **효과가 충분히 같다면 더 침습적인 치료를 선택할 이유는 없다. 다만 치료 성능을 확보하려면 필요한 최소 수준의 침습은 허용할 수 있다.**

즉 ‘무조건 비침습’이 아니라 **최소침습 최적화**에 가깝다.

### 16.2 부분 삭발형 EEG 패치 + 부분가발

환자별로 발작 신호가 잘 잡히는 부위를 미리 찾고, 해당 부위만 작게 삭발해 전극 패치를 부착한다.

```text
환자별 full EEG
→ 발작이 잘 보이는 위치 선정
→ 부분 삭발
→ 소수 채널 패치
→ 부분가발로 고정·은폐
```

부분가발 역할:

- 외관 은폐
- 전극 위치와 압력 유지
- 배터리·통신·SoC 수납
- 전선 길이 감소
- 반복 부착 위치 가이드

#### 장점

- 머리카락에 의한 접촉 불량 감소
- 젤 관리 부담 감소
- 전극 위치 재현성 향상
- 실제 wearable form factor 가능성

#### 한계

- 머리카락 재성장
- 피부 자극
- 땀과 접착제
- 장기 유지관리
- 두개골에 의한 EEG 감쇠는 그대로 존재

### 16.3 정상 두피 제거 + 인공 피부 아이디어

정상 두피를 제거하고 전극 친화적 인공 인터페이스로 대체하는 구상도 검토하였다.

그러나 현재 판단은 부정적이다.

- 정상 조직 제거의 수술 부담이 큼
- 감염과 재건 실패 위험
- 두개골은 그대로 남아 핵심 전도 장벽이 해결되지 않음
- 같은 목적은 피하 전극으로 더 합리적으로 달성 가능

### 16.4 수정안: 환자 맞춤형 피하 EEG

```text
작은 절개
→ 두피 아래·두개골 위 전극 삽입
→ 피부 완전 봉합
→ 장기 EEG 감시
```

장점:

- 젤과 머리카락 문제 제거
- 같은 위치에서 장기 기록
- 두개골을 열지 않음
- 뇌 안에 들어가지 않음

한계:

- 완전 비침습은 아님
- 수술·감염 위험
- 채널 수 제한
- 두개골 장벽은 남음

### 16.5 환자별 최소 채널 공동 최적화

표준 16채널을 항상 쓰기보다:

```text
병원 full EEG
→ 환자별 informative channel 탐색
→ 2–4채널 또는 4–8채널 선택
→ 장기 wearable/피하 장치에 배치
```

핵심 질문:

> **최소 몇 개의 채널을 어느 위치에 배치하면 16채널의 발작 검출 성능을 최대한 유지할 수 있는가?**

### 16.6 부분가발형 외부 장치 + BCP/BCC

```text
[부분가발·외부 헤드패치]
배터리
BCP 송신기
BCC 통신
외부 제어기
        ↓ 인체 결합
[표면 또는 피하 장치]
BCP 수신·정류
에너지 저장
EEG AFE
발작 검출기
자극 드라이버
안전회로
```

- **BCP**: body-coupled powering
- **BCC**: body-coupled communication

### 16.7 평상시 충전 + 발작 시 burst stimulation

자극이 필요한 순간에 전력을 모으기 시작하면 늦을 수 있다.

```text
평상시
→ BCP로 에너지 버퍼 충전
→ 초저전력 EEG 감시

발작 onset 검출
→ 저장된 에너지 즉시 방출
→ biphasic stimulation

termination 검출
→ 자극 중단
→ 재충전
```

이 구조는 낮은 평균전력과 높은 순간 자극전력의 차이를 에너지 버퍼로 해결한다.

---

## 17. 이 확장 아이디어의 연구 공백

단순히 기존 기술을 조합했다는 것만으로는 논문 기여가 약할 수 있다. 신규성은 다음 공동설계 문제에서 찾아야 한다.

### 17.1 BCP와 μV EEG의 공존

> 인체를 통해 전력을 전달하면서 미세한 EEG를 오염 없이 측정할 수 있는가?

### 17.2 자극 후 AFE 초고속 회복

> 자극으로 포화된 AFE가 얼마나 빨리 정상 측정으로 복귀해야 발작 종료를 놓치지 않는가?

### 17.3 전력 불안정 상황의 자극 안전성

> BCP 링크가 끊기거나 전력이 흔들려도 anodic phase를 끝까지 수행해 charge balance를 보장할 수 있는가?

### 17.4 환자별 전극 위치–분류기–자극 위치 공동 최적화

> sensing 위치, classifier feature, stimulation 위치를 하나의 최적화 문제로 만들 수 있는가?

### 17.5 실제 임상효과 검증

검출 정확도가 아니라 다음을 평가해야 한다.

- 자극 후 발작 지속시간
- 임상 증상 강도
- 전신화 여부
- 구조약 사용
- 피부·조직 부작용
- 환자 삶의 질
- 장기 유지관리 부담

### 17.6 간호 workflow 개선

중환자실 및 장기 EEG에서 현장 문제로 제기된 항목:

- 젤 제거
- 전극 재부착
- impedance 재확인
- 피부 발적과 손상
- 신호 중단
- 소모품과 간호시간

후속 연구에서는 이를 정량화해야 한다.

---

## 18. 정제된 최종 시스템 콘셉트

> **환자별로 최적화된 소수의 표면 또는 피하 EEG 전극을 이용해 장기간 발작을 감시하고, 부분가발형 외부 장치가 BCP를 통해 전력을 공급하며, electrical onset 검출 시 저장된 에너지를 이용해 임피던스 적응형·전하균형 자극을 시행하는 최소침습 폐루프 뇌전증 시스템**

```text
부분가발형 외부 장치
├─ 배터리
├─ BCP 송신기
├─ BCC 통신
├─ 데이터 저장·전송
└─ 외관 은폐와 고정
          ↓
표면 또는 피하 장치
├─ 환자 맞춤형 EEG 전극
├─ 저잡음 AFE
├─ 적응형 발작 검출기
├─ 에너지 버퍼
├─ 자극 드라이버
└─ 안전회로
          ↓
electrical onset 검출
→ 자극
→ termination 확인
→ 자극 중단
```

---

## 19. 후속 보고서에서 사용할 핵심 논지

```text
2013년
환자 맞춤형 EEG 측정–분류–기록

2015년
16채널 시작·종료 검출
+ 임피던스 적응형 비침습 자극

남은 공백
실제 치료효과
장기 전극
전원·무선
자극 artifact
온라인 적응
착용성과 간호 workflow

확장 방향
환자별 최소 채널
부분가발형 외부 장치
표면 또는 피하 전극
BCP 전력
에너지 버퍼
안전한 폐루프 자극
실제 임상효과 검증
```

---

## 20. 최종 평가

이 논문의 가장 중요한 기여는 개별 회로 성능보다 **측정–판단–기록–자극을 하나의 저전력 SoC로 통합해 비침습 폐루프 뇌전증 치료 시스템의 하드웨어 기반을 제시했다는 점**이다.

그러나 논문의 치료적 의미는 제한적으로 해석해야 한다.

> **실제 환자 EEG에서 발작 분류 성능은 검증했지만, 실제 뇌전증 환자에게 자극을 가해 발작을 중단시킨 것은 아니다.**

따라서 다음 단계의 핵심은 더 높은 검출 정확도 하나가 아니라:

- 실제 치료효과
- 장기 전극 인터페이스
- 전력 공급
- 자극 artifact
- 안전성
- 환자·간호사 사용성

을 함께 설계하는 것이다.

전민성이 제안한 부분가발, 환자별 최소 전극, 피하 EEG, BCP, 에너지 버퍼의 조합은 이 논문의 시스템을 실제 장기 착용 치료기기로 확장하는 방향이다. 다만 독창성은 각 구성요소의 단순 결합이 아니라 **EEG–전력–자극–안전–임상 workflow를 공동 최적화하는 문제**에서 확보해야 한다.

---

## 21. 기억용 초압축 요약

- **AFE:** 사진기사 한 명이 두 방을 오가도 방별 세팅을 저장해 안정적으로 촬영
- **FTDM:** 느린 EEG 사이의 빈 시간을 이용해 필터 하나를 16채널 × 7대역에 재사용
- **Window:** 2초 사진, 1초 판정
- **D2A:** 민감한 심사위원 + 신중한 심사위원 + 연속 동의 관리자
- **PVTES:** 피부 임피던스에 따라 pulse 수 조절, biphasic charge balance
- **검증:** 실제 환자 저장 EEG 분류 + 모의 부하 자극 + 눈깜빡임 전체 시스템 시험
- **최대 한계:** 실제 뇌전증 발작 억제 효과 미검증
- **확장 아이디어:** 환자별 최소 채널 + 부분가발/피하 전극 + BCP + 에너지 버퍼 + 폐루프 자극

---

### Reference

Altaf, M. A. B., Zhang, C., & Yoo, J. (2015). A 16-Channel Patient-Specific Seizure Onset and Termination Detection SoC With Impedance-Adaptive Transcranial Electrical Stimulator. *IEEE Journal of Solid-State Circuits, 50*(11), 2728–2740. https://doi.org/10.1109/JSSC.2015.2482498
