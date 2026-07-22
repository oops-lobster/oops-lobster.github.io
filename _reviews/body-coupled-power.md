---
title: "몸을 전력이 흐르는 매질로 바꾸기"
title_en: "Turning the Human Body into a Medium for Power"
title_ja: "人体を電力伝送の媒体に変える"
paper_title: "Body-Coupled Power Transmission and Energy Harvesting"
topic: Wearable Power Systems
year: 2021
summary: "몸을 RF 전파의 장애물이 아니라 전력 전달 매질로 활용하는 발상을 살펴보고, SkinECG와 adaptive hybrid-powered wearable로 이어지는 아이디어를 정리했습니다."
summary_en: "How the body can become a medium for power transmission rather than an RF obstacle, and how that idea extends toward adaptive wearable systems."
summary_ja: "人体をRFの障害物ではなく電力伝送の媒体として捉える発想と、適応型ウェアラブルシステムへの展開を考察しました。"
reading_time: 15
order: 5
tags:
  - Body-Coupled Power
  - Energy Harvesting
  - Wearable Systems
  - SkinECG
---

> 논문: **Body-Coupled Power Transmission and Energy Harvesting**  
> 저자: Jiamin Li, Yilong Dong, Jeong Hoan Park, Jerald Yoo  
> 핵심 연결 논문: **SkinECG: An orthogonal remote powering wearable skin-like sensor**  
> 작성 목적: 유담 교수님 연구 흐름 이해 및 SkinECG 후속 아이디어 정리  
> 작성 방식: 논문 내용 이해 + 생성형 AI 인공지능을 활용한 이해(검토필요)

---

## 1. 오늘의 핵심 한 줄 요약

이 논문은 사람 몸을 전력 전달을 방해하는 장애물이 아니라, **전력 전달과 에너지 수확을 위한 body-area medium**으로 활용할 수 있음을 보여준 기반 논문이다.

조금 더 쉽게 말하면:

> 몸은 원래 RF 전파를 가리는 문제를 일으키지만, 이 논문은 오히려 몸을 전력이 지나가는 길로 사용한다.

---

## 2. 문제의식

웨어러블 센서가 많아질수록 각 센서에 전력을 공급하는 문제가 커진다. 특히 ECG patch, hearing aid, wrist/ankle tracker처럼 몸의 여러 위치에 붙는 기기는 항상 배터리를 넣거나 충전하기 어렵다.

기존 방식에는 다음과 같은 한계가 있다.

| 기존 방식 | 한계 |
|---|---|
| 배터리 | 충전·교체 필요, 무게와 부피 증가 |
| 유선 연결 | 움직임 제한, 착용감 저하 |
| Inductive coupling | 짧은 거리, 정렬 필요 |
| Far-field RF | 몸에 의한 body shadowing effect 문제 |
| Photovoltaic harvesting | 빛 노출 필요 |
| Piezoelectric / triboelectric harvesting | 움직임·마찰이 큰 위치 필요 |
| Thermoelectric harvesting | 충분한 온도 차 필요 |

따라서 이 논문은 특정 위치나 환경 조건에 묶이지 않고, 몸 전체의 저전력 웨어러블 노드에 전력을 공급하는 방법을 찾는다.

---

## 3. Body shadowing effect 이해

**Body shadowing effect**는 사람 몸이 RF 전파를 가리거나 약화시키는 현상이다.

쉽게 말하면:

```text
송신기 →→→ 수신기
```

처럼 송신기와 수신기 사이가 잘 뚫려 있으면 RF 전송이 가능하지만,

```text
송신기 →→→ 사람 몸 →→→ 수신기
```

처럼 몸이 중간에 있으면 전파가 막히거나 약해진다.

이때 필요한 조건이 **line-of-sight**이다.  
Line-of-sight는 송신기와 수신기 사이가 장애물 없이 “잘 보여야 하는 길”이라는 뜻이다.

이 논문은 이 문제를 피하려 하지 않고, 오히려 몸을 전력 전달 경로로 사용한다.

---

## 4. 이 논문의 핵심 발상

기존 관점:

> 몸은 전파를 막는 장애물이다.

이 논문의 관점:

> 몸은 전자기파가 결합될 수 있는 전력 전달 매질이다.

즉, 이 논문은 인체와 전자기파의 coupling 특성을 이용해 몸 전체의 여러 위치로 전력을 전달하거나, 주변 전자기파를 수확하는 방식을 제안한다.

---

## 5. 이 기술의 성격: 저전력 대신 전신 커버리지

이 기술은 큰 전력을 공급하는 기술은 아니다.  
대신 몸 어디에 붙은 저전력 센서에도 비교적 전력을 공급할 수 있도록 **위치 제한을 줄이는 기술**이다.

짧게 정리하면:

> **저전력 대신 전신 커버리지.**

또는:

> 전력은 작지만, 위치 자유도가 크다.

---

## 6. dB 이해

dB는 신호나 전력 차이를 로그 단위로 표현한 것이다.  
전력 기준으로는 다음처럼 이해하면 된다.

| dB 차이 | 전력 차이 |
|---:|---:|
| 10 dB | 10배 |
| 20 dB | 100배 |
| 30 dB | 1,000배 |
| 40 dB | 10,000배 |
| 50 dB | 100,000배 |
| 60 dB | 1,000,000배 |
| 70 dB | 10,000,000배 |

이 논문에서 body-coupled power transmission이 far-field RF보다 **30–70 dB 낮은 path loss**를 보였다는 것은, 몸에 가려지는 상황에서 전력 손실이 기존 RF 방식보다 매우 크게 줄었다는 뜻이다.

---

## 7. 저주파를 쓰는 이유

이 논문에서는 body-coupled power transmission이 **30–90 MHz** 범위에서 낮은 path loss를 보였다.

저주파를 쓰면 몸에 전자기장이 더 잘 결합될 수 있고, body shadowing 영향을 줄일 수 있다.  
다만 일반 RF 방식에서 저주파를 쓰려면 안테나가 커져 웨어러블에 불리하다.

이 논문의 핵심은:

> 낮은 주파수의 장점을 살리면서, 큰 안테나 대신 작은 전극으로 몸에 결합시킨다.

즉, **저주파 + 작은 전극 + 인체 coupling**이 핵심 조합이다.

---

## 8. Fig. 2c–d 이해: 몸에 잘 넣고, 몸에서 잘 건지기

Fig. 2c와 Fig. 2d는 각각 역할이 다르다.

| 그림 | 위치 | 의미 |
|---|---|---|
| Fig. 2c | 송신기 TX 쪽 | 전력을 몸에 잘 넣기 위한 impedance matching |
| Fig. 2d | 수신기 RX 쪽 | 몸에서 온 작은 신호를 잘 회수하기 위한 LC impedance boosting |

### 비유로 이해하기

이 시스템을 물 주고받기로 비유하면, TX는 물을 보내는 쪽, 몸은 물이 지나가는 특이한 길, RX는 물을 받는 쪽이다.

- **Fig. 2c**는 보내는 쪽 호스 입구를 잘 맞춰서 물이 몸이라는 길로 잘 들어가게 하는 것이다.
- **Fig. 2d**는 받는 쪽 컵이나 깔때기를 잘 설계해서 약하게 온 물도 최대한 잘 받아내는 것이다.

따라서 Fig. 2c–d는 한 문장으로:

> **몸에 잘 넣고, 몸에서 잘 건지는 회로 설계**

로 이해할 수 있다.

---

## 9. Active transmitter와 ambient harvesting

이 논문에는 두 가지 전력 공급 방식이 나온다.

### 9.1 Active transmitter

Active transmitter는 전력을 일부러 만들어서 몸에 넣는 방식이다.

```text
작은 송신기 TX
→ 전극을 통해 몸에 전자기장 결합
→ 몸을 따라 전력 전달
→ 다른 위치의 RX/harvester가 전력 회수
```

논문에서는 약 **1.2 mW, 3 Vpp** 송신 조건에서:

- 15 cm 거리: 약 53 µW 회수
- 손목-손목 120 cm 거리: 약 1.1 µW 회수
- 발목-이마 160 cm 거리: 약 2 µW 회수

를 보여준다.

### 9.2 Ambient EM harvesting

Ambient harvesting은 전용 송신기 없이, 주변 환경에 원래 존재하는 전자기파를 몸을 통해 주워 쓰는 방식이다.

하지만 이 방식은 환경 의존성이 매우 크다.  
사무실처럼 전자기파가 많은 곳에서는 µW급 전력을 얻을 수 있지만, 조건이 나쁘면 nW 수준으로 떨어질 수 있다.

따라서 ambient EM harvesting은 주 전력원이라기보다:

> active body-coupled power transmission 또는 O-EHN을 보완하는 보조 전력원

으로 이해하는 것이 현실적이다.

---

## 10. Vpp 이해

**Vpp**는 **peak-to-peak voltage**의 약자이다.  
AC 전압 파형의 최고점과 최저점 사이의 전압 차이를 의미한다.

예를 들어 신호가 +1.5 V에서 -1.5 V까지 흔들리면:

```text
+1.5 V - (-1.5 V) = 3 Vpp
```

이다.

논문에서 3 Vpp, 10 Vpp는 송신기가 몸에 결합시키는 AC 신호의 흔들림 크기이다.  
Vpp가 커질수록 몸에 주입되는 전력이 증가하고, 수신기에서 회수되는 전력도 증가한다.

---

## 11. Fig. 3의 핵심 이해

Fig. 3은 실제 제작한 송신기와 수신기/하베스터를 이용해, 몸에서 얼마나 전력을 회수할 수 있는지 보여준다.

핵심은 다음과 같다.

1. 송신 전력이 커질수록 회수 전력도 증가한다.
2. 거리가 멀어질수록 회수 전력은 감소한다.
3. 하지만 전신 거리에서도 µW급 회수가 가능하다.
4. 여러 수신 노드가 동시에 전력을 받아도, 일정 범위에서는 크게 무너지지 않는다.
5. 전극 크기를 줄여도 회수 전력이 비교적 유지된다.
6. Ambient harvesting은 가능하지만 환경 의존성이 크다.

여기서 중요한 점은 이 논문이 “모든 웨어러블을 충분히 구동할 수 있다”고 주장하는 것이 아니라는 점이다.

이 논문은 다음 정도를 보여준다.

> 몸을 통해 전력을 보낼 수 있다.  
> 전신 커버리지가 가능하다.  
> 저전력 웨어러블에는 의미 있는 전력 예산을 줄 수 있다.

---

## 12. SkinECG와의 관계

이 논문은 기반 논문이고, SkinECG는 응용 논문으로 볼 수 있다.

```text
Body-coupled power transmission 논문:
몸을 통해 전력을 보낼 수 있음을 보여줌

SkinECG 논문:
그 원리를 실제 ECG 패치 시스템으로 구현함
```

SkinECG 논문에서는 OPV 같은 energy harvester가 팔, 손목, 다리 등 에너지를 얻기 좋은 위치에서 전력을 수확하고, 이를 BCP로 가슴의 SkinECG에 전달한다.

또한 여러 power Tx가 동시에 하나의 SkinECG에 전력을 보낼 때 생기는 간섭/상쇄 문제를 해결하기 위해 **orthogonal frequency 기반 O-EHN**을 사용한다.

즉:

> 이 논문은 가능성을 열었고, SkinECG는 그 가능성을 orthogonal 구조로 ECG 시스템에 적용했다.

---

## 13. 보청기 적용 가능성

논문에서 hearing aid는 두 맥락으로 등장한다.

첫째, 기존 에너지 하베스팅 방식으로 전력 공급이 까다로운 위치의 예시이다.  
귀 주변 기기는 빛, 움직임, 마찰, 열 흐름 등 특정 하베스팅 조건을 안정적으로 만족하기 어렵다.

둘째, ECG sensor보다 전력 요구량이 큰 기기의 예시이다.  
Hearing aid나 multi-sensor ExG SoC처럼 수십~수백 µW가 필요한 기기는 ambient harvesting만으로는 부족할 수 있고, active body-coupled power transmission이나 더 높은 송신 전력이 필요할 수 있다.

따라서 보청기는 불가능한 대상이 아니라:

> ECG 센서보다 전력 요구량이 커서 보조/active 전력 공급이 필요한 응용

으로 이해할 수 있다.

---

## 14. Safety 이해

저자들은 body-coupled power transmission의 인체 안전성을 SAR와 electric field 기준으로 평가한다.

핵심은 이 시스템이 몸에 강한 DC 전류를 직접 흘리는 구조가 아니라는 점이다.  
AC 신호가 몸에 결합되고, return path는 주변 환경과의 parasitic capacitance를 통해 형성된다.

따라서 논문에서 사용한 송신 전력 수준에서는 안전 기준보다 훨씬 낮은 SAR와 electric field를 보였다고 설명한다.

---

# SkinECG 관련 후속 아이디어 정리

아래는 오늘 논문을 읽으며 나온 SkinECG 개선 아이디어를 따로 정리한 것이다.

---

## A. 기존 SkinECG의 핵심 한계

SkinECG는 배터리 없는 피부형 ECG 센서로, 매우 작은 전력 예산 안에서 작동해야 한다.  
그래서 continuous ECG waveform 전체를 디지털화하거나 계속 전송하지 않고, QRST point만 추출해 BCC로 전송한다.

이 방식은 저전력에는 매우 유리하다.

하지만 임상적/사용자 요구에 따라 다음과 같은 상황이 있을 수 있다.

- QRST 이벤트만으로는 부족한 경우
- ECG morphology 전체가 필요한 경우
- ST segment 변화나 파형 모양을 보고 싶은 경우
- 퇴원 후 외래 환자 스크리닝에서 짧은 구간의 자세한 ECG가 필요한 경우

따라서 SkinECG 후속 아이디어는:

> 평소에는 QRST 중심 저전력 모드, 필요할 때만 더 자세한 ECG waveform segment 전송

으로 발전할 수 있다.

---

## B. 기본 모드: OPV 기반 O-EHN

기본 구동은 SkinECG 논문처럼 OPV 기반 O-EHN을 사용한다.

```text
OPV / energy harvester
→ power Tx
→ BCP로 SkinECG에 전력 공급
→ SkinECG가 ECG 측정
→ QRST 추출
→ BCC로 data hub에 전송
```

이 모드에서는 저전력, 장시간, 지속 모니터링이 중요하다.  
따라서 QRST 이벤트 중심 전송이 합리적이다.

---

## C. 데이터 허브와 전력 송신부의 분리

SkinECG에서 가슴 패치는 ECG를 측정하고, QRST 정보를 BCC로 data hub에 보낸다.  
따라서 전력 공급 위치와 데이터 수신 위치는 반드시 같을 필요가 없다.

예시 구조:

```text
오른손/팔:
OPV + power Tx
→ 빛을 잘 받아 전력 생성
→ BCP로 가슴 SkinECG에 전력 공급

가슴:
SkinECG patch
→ ECG 측정
→ QRST 또는 ECG 정보 생성
→ BCC로 데이터 전송

왼손/근처:
Data hub / BCC receiver
→ SkinECG가 보낸 데이터 수신
→ 외래 장비 또는 스마트폰으로 전달
```

이 구조는 각 신체 부위가 가장 잘할 수 있는 역할을 맡는다는 장점이 있다.

```text
오른손/팔 = 에너지 수확 및 전력 송신
가슴 = ECG 측정
왼손/손목 = 데이터 수신 허브
```

특히 퇴원 후 외래 스크리닝처럼 짧은 시간 동안 자세와 장치 위치를 어느 정도 통제할 수 있는 상황에서 현실적일 수 있다.

---

## D. 보조 고전력 모드: 발목 밴드 또는 신발 깔창 power Tx

오늘의 핵심 아이디어는 발목 power Tx를 항상 쓰자는 것이 아니다.

기본은 OPV 기반 O-EHN으로 SkinECG를 구동하고, QRST 중심 정보를 전송한다.  
하지만 더 자세한 ECG 정보가 필요할 때만 보조 power Tx를 활성화한다.

예시:

```text
평상시:
OPV 기반 O-EHN
→ QRST 중심 저전력 전송

필요 시:
발목 밴드형 power Tx 또는 신발 깔창형 power Tx 활성화
→ 더 높은 전력 공급
→ 짧은 ECG waveform segment 또는 자세한 morphology 정보 전송
```

발목은 body-coupled power 논문에서 ground coupling 측면에서 유리할 가능성이 보였다.  
또한 신발 깔창 형태로 만들 경우 piezoelectric 또는 triboelectric energy harvester와 결합할 수 있다.

즉, 발/발목은 다음 두 가지 장점을 가질 수 있다.

1. 지면과 가까워 BCP coupling에 유리할 수 있음
2. 보행 기반 압전/마찰전기 에너지 수확과 결합 가능

---

## E. Adaptive hybrid-powered SkinECG 개념

오늘 아이디어를 하나의 시스템 개념으로 정리하면 다음과 같다.

> **Adaptive hybrid-powered SkinECG**  
> 평소에는 OPV 기반 O-EHN으로 저전력 QRST 모니터링을 수행하고, 자세한 ECG 정보가 필요한 순간에는 발목 밴드 또는 신발 깔창형 보조 power Tx를 활성화하여 짧은 ECG waveform segment를 전송하는 시스템.

동작 모드는 다음과 같다.

| 모드 | 전력원 | 전송 정보 | 목적 |
|---|---|---|---|
| 기본 모드 | OPV 기반 O-EHN | QRST 이벤트 | 장시간 저전력 모니터링 |
| 확인 모드 | OPV + 보조 Tx | 짧은 ECG waveform segment | 자세한 파형 확인 |
| 외래 스크리닝 모드 | 통제된 자세 + 보조 Tx 가능 | QRST + 필요한 파형 구간 | 퇴원 후 외래 환자 평가 |

---

## F. 퇴원 후 외래 환자 스크리닝 시나리오

설문조사 추이상 SkinECG는 퇴원 후 외래 환자의 간단한 ECG 스크리닝에 효과적일 가능성이 있다.

이 경우 24시간 완전 자유 착용보다, 다음과 같은 사용 시나리오가 더 현실적일 수 있다.

```text
1. 환자가 외래에 방문한다.
2. 가슴에 SkinECG patch를 부착한다.
3. 팔/손 또는 발목/깔창의 power Tx가 SkinECG에 전력을 공급한다.
4. SkinECG는 기본 QRST 정보를 전송한다.
5. 필요 시 보조 power Tx를 활성화해 짧은 ECG waveform segment를 전송한다.
6. Data hub가 BCC로 정보를 수신해 의료진에게 보여준다.
```

이 시나리오는 “항상 raw ECG를 보내는 장치”가 아니라:

> 짧은 시간 동안 충분한 전력을 공급받아, 필요한 ECG 정보를 선택적으로 제공하는 screening device

로 이해할 수 있다.

---

## G. 교수님께 질문할 만한 포인트

1. SkinECG의 QRST 중심 전송은 전력 효율 측면에서는 매우 합리적이지만, 임상적으로 waveform morphology가 필요한 상황에서는 어떤 정보 손실이 문제가 될 수 있을까?

2. 평소에는 QRST 이벤트만 전송하고, 이상 상황 또는 요청 시 짧은 ECG waveform segment를 전송하는 adaptive mode가 가능한가?

3. OPV 기반 O-EHN을 기본 전력원으로 사용하되, 발목 밴드 또는 신발 깔창형 piezo/triboelectric 보조 power Tx를 필요 시 활성화하는 hybrid powering 구조는 가능한가?

4. BCP power Tx와 BCC data transmission이 같은 인체 채널을 사용할 때, 전력 전송과 데이터 통신의 간섭은 어떻게 분리할 수 있을까?

5. 퇴원 후 외래 환자 스크리닝처럼 측정 시간과 자세를 통제할 수 있는 상황에서는, SkinECG의 전력/데이터 전송 설계를 더 적극적으로 바꿀 수 있을까?

---

## 생성형 AI 인공지능을 활용한 이해(검토필요)

오늘 읽은 body-coupled power transmission 논문은 SkinECG의 기반 원리를 이해하는 데 중요하다. 이 논문은 인체를 전력 전달의 장애물이 아니라 전력 전달 매질로 재해석했고, SkinECG는 이 개념을 ECG 패치 시스템에 적용했다.

후속 아이디어의 핵심은 기존 SkinECG의 저전력 장점을 유지하면서도, 필요한 순간에는 더 많은 ECG 정보를 보낼 수 있도록 전력 모드를 적응적으로 바꾸는 것이다. 이를 위해 OPV 기반 O-EHN을 기본 전력원으로 사용하고, 발목 밴드 또는 신발 깔창형 보조 power Tx를 필요 시 활성화하는 adaptive hybrid-powered SkinECG 구조를 생각할 수 있다.

이 아이디어는 특히 퇴원 후 외래 환자 스크리닝처럼 짧은 시간 동안 자세와 장치 배치를 통제할 수 있는 상황에서 현실적일 수 있다.
