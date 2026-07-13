---
title: "배터리 없이 피부 위에서 ECG를 읽는 방법"
paper_title: "SkinECG: An Orthogonal Remote Powering Wearable Skin-like Sensor"
topic: Wearable Bioelectronics
year: 2026
summary: "OPV, body-coupled powering, QRST feature extraction을 결합한 SkinECG의 구조를 이해하고 실제 의료 환경에서 검증해야 할 질문을 정리했습니다."
reading_time: 16
order: 3
tags:
  - SkinECG
  - Body-Coupled Power
  - Energy Harvesting
  - Wearable Sensor
---

## 논문 학습노트 및 질문 정리

> Tan, Joanne Si Ying, Zhuoyue Li, Sixing Xiong, Shinyoung Lee, Jia Yi Fong, Tao Tang, Jiamin Li, Zhongqi Li, Kyungsoo Park, Donghan Kim, Junwei Feng, Gwangjin Kim, Lian Zhang, Astrid Rusly, Benjamin Ho Yin Lee, Kian Ann Ng, Kenjiro Fukuda, Takao Someya, and Jerald Yoo.  
> “SkinECG: An orthogonal remote powering wearable skin-like sensor.” *Science Advances* 12, no. 18 (2026): eaec9803.  
> DOI: 10.1126/sciadv.aec9803

---

## 1. 논문 정보

- **제목**: SkinECG: An orthogonal remote powering wearable skin-like sensor
- **저널**: *Science Advances*
- **연도**: 2026
- **논문 번호**: eaec9803
- **DOI**: 10.1126/sciadv.aec9803
- **교신저자**: Jerald Yoo
- **핵심 키워드**  
  - SkinECG  
  - wearable ECG  
  - body-coupled powering, BCP  
  - Orthogonal Energy Harvesting Network, O-EHN  
  - organic photovoltaic, OPV  
  - battery-free wearable sensor  
  - power Tx  
  - PMU  
  - QRST feature extraction  
  - body-coupled communication, BCC

---

## 2. 한 줄 요약

SkinECG 논문은 가슴에 부착되는 얇은 ECG 센서를 배터리 없이 구동하기 위해, 신체 다른 부위에서 수확한 에너지를 O-EHN과 BCP를 통해 SkinECG로 전달하는 **전력 전달 아키텍처 중심의 wearable sensing 연구**이다.

---

## 3. 논문의 핵심 문제의식

웨어러블 센서는 장시간 동작을 위해 안정적인 전원 공급이 필요하다. 그러나 기존 배터리 기반 방식은 다음과 같은 한계를 갖는다.

- 배터리는 소모되며 충전 또는 교체가 필요하다.
- 배터리가 커지면 장치가 두꺼워지고 무거워진다.
- 장치의 관성이나 무게는 motion artifact를 증가시킬 수 있다.
- 피부 부착형 센서의 착용감과 순응도를 떨어뜨릴 수 있다.

이에 대한 대안으로 energy harvesting을 사용할 수 있지만, energy harvesting에도 중요한 문제가 있다. 생체신호를 가장 잘 측정할 수 있는 위치와 에너지를 가장 잘 수확할 수 있는 위치가 다를 수 있다는 점이다. 본 논문에서는 이를 **location mismatch** 문제로 제시한다.

예를 들어 ECG는 심장 전기활동을 측정하기 위해 가슴 부위가 적합하다. 그러나 OPV와 같은 photovoltaic harvester는 빛이 잘 닿는 팔, 손목, 다리 등 노출 부위가 더 유리할 수 있다. 따라서 센서 위치와 energy harvester 위치를 분리하고, 이 둘을 효율적으로 연결하는 전력 전달 구조가 필요하다.

---

## 4. 사전지식 조사

### 4.1 ECG

ECG, 즉 electrocardiogram은 심장의 전기적 활동을 피부 표면에서 측정한 신호이다. 심장은 동방결절(SA node)에서 시작되는 전기 자극이 심방, 방실결절(AV node), His bundle, Purkinje fiber를 거쳐 심실로 전달되면서 수축과 이완을 반복한다.

ECG의 기본 파형은 다음과 같이 구성된다.

- **P wave**: 심방 탈분극
- **PR interval**: 심방에서 심실로 전기신호가 전달되는 시간. AV node 지연 포함
- **QRS complex**: 심실 탈분극
- **ST segment**: 심실이 탈분극된 상태를 유지하는 구간
- **T wave**: 심실 재분극

ECG는 단순히 심박수만 보는 신호가 아니라, 파형의 모양, 시간 간격, 분절 변화, lead별 차이 등을 함께 해석하는 생체전기 신호이다.

---

### 4.2 QRST와 R peak

QRST는 ECG 파형에서 Q, R, S, T wave와 관련된 특징점을 의미한다. 특히 R peak는 ECG에서 크고 뾰족하게 나타나는 경우가 많아 검출이 비교적 쉽다. R peak 사이의 시간 간격인 R-R interval을 이용하면 heart rate와 rhythm regularity를 평가할 수 있다.

그러나 ECG 해석은 R peak만으로 충분하지 않다. 병원용 ECG 해석에서는 P wave, PR interval, QRS duration, ST segment, T wave morphology, QT interval 등이 모두 중요한 정보를 제공한다.

---

### 4.3 OPV

OPV는 **Organic Photovoltaic**, 즉 유기 태양전지를 의미한다. 탄소 기반 유기 반도체 재료를 사용하여 빛을 전기 에너지로 변환하는 photovoltaic harvester이다.

OPV의 장점은 다음과 같다.

- 얇고 가볍다.
- 유연하게 만들 수 있다.
- 피부나 곡면에 부착하기 쉽다.
- 웨어러블 시스템에 적합하다.

본 논문에서 OPV는 가슴의 SkinECG 자체에 직접 붙는 전원이라기보다, 팔, 손목, 다리 등 빛에 노출되기 쉬운 부위에 부착된 **power Tx node의 energy harvester** 역할을 한다.

---

### 4.4 EH

EH는 **Energy Harvester**의 약자이다. 주변 환경 또는 인체 주변에서 얻을 수 있는 에너지를 전기 에너지로 변환하는 장치를 의미한다.

대표적인 EH는 다음과 같다.

| EH 종류 | 에너지원 | 적합한 위치 또는 조건 |
|---|---|---|
| OPV / PV | 빛 | 팔, 손목, 다리, 머리 등 빛 노출 부위 |
| Thermoelectric generator, TEG | 체온과 외부 온도 차 | 외부 환경과 온도 차가 생기는 부위 |
| Piezoelectric harvester | 압력, 진동 | 무릎, 팔꿈치 등 관절 |
| Triboelectric harvester | 마찰, 접촉-분리 | 관절, 발 등 움직임이 큰 부위 |
| RF energy harvester | 주변 전파 | RF 신호가 수신 가능한 위치 |

OPV는 EH의 한 종류이다.

---

### 4.5 BCP

BCP는 **Body-coupled powering**의 약자이다. 인체를 전력 전달 매질로 사용하여 전력을 전달하는 방식이다.

BCP는 인체를 단순한 전선처럼 사용하는 것이 아니라, 피부와 전극, 인체 조직의 전기적 특성을 이용해 전기장을 capacitively coupling하는 방식으로 이해할 수 있다. 즉, power Tx가 만든 AC 성격의 전력 신호가 피부/인체 채널에 결합되고, SkinECG의 power Rx electrode가 이를 수신한다.

---

### 4.6 Capacitive coupling

Capacitive coupling은 두 도체가 직접 연결되어 있지 않더라도, 한쪽 도체의 전압 변화가 전기장을 통해 반대쪽 도체의 전하 분포에 영향을 주는 현상이다.

커패시터에서 한쪽 판의 전하가 AC에 의해 계속 변하면, 반대쪽 판의 전하 분포도 전기장 변화에 의해 유도된다. 이때 전자가 절연체를 직접 통과하는 것이 아니라, 전기장 변화가 반대편 전하를 흔드는 것이다.

SkinECG의 BCP에서는 power Tx가 만든 MHz 대역의 전기장이 피부/인체에 결합되고, 이를 SkinECG power Rx가 수신한다.

---

### 4.7 AC, DC, Rectifier, PMU

- **AC**: alternating current, 교류. 전압과 전류의 방향이 시간에 따라 주기적으로 바뀐다.
- **DC**: direct current, 직류. 전압과 전류 방향이 일정하다.
- **Rectifier**: 정류기. AC 신호를 DC 신호로 변환한다.
- **PMU**: Power Management Unit. 수신되거나 수확된 전력을 센서 회로가 사용할 수 있는 안정적인 전원으로 변환하고 관리하는 회로 블록이다.

SkinECG에서는 BCP로 수신된 AC 성격의 전력 신호를 rectifier와 DC-DC boost converter를 포함한 PMU가 처리하여, ECG sensor가 사용할 수 있는 DC 전원으로 변환한다.

---

## 5. 시스템 구조

본 논문의 SkinECG 시스템은 다음과 같은 흐름으로 이해할 수 있다.

```text
Energy harvester / OPV
→ Power Tx
→ Orthogonal Energy Harvesting Network, O-EHN
→ Body-coupled powering, BCP
→ SkinECG power Rx
→ PMU
→ ECG sensor
→ QRST feature extraction
→ Body-coupled communication, BCC
```

Figure 1은 전체 개념도를 보여주고, Figure 2는 실제 system architecture를 제시한다.

---

## 6. Figure별 핵심 정리

### 6.1 Figure 1: SkinECG concept

Figure 1은 SkinECG의 전체 개념을 보여준다. 에너지 하베스터는 신체 여러 위치에 분산 배치되고, 수확한 에너지는 power Tx를 통해 BCP 방식으로 가슴의 SkinECG로 전달된다.

핵심 구조는 다음과 같다.

```text
팔/손목/다리의 OPV 또는 EH
→ power Tx
→ BCP
→ 가슴의 SkinECG
→ ECG 측정
```

가슴은 ECG sensing에 적합한 위치이고, 팔/손목/다리는 OPV 기반 energy harvesting에 적합한 위치이다. 이 둘의 불일치를 해결하기 위해 BCP 기반 remote powering이 사용된다.

---

### 6.2 Figure 2: Energy-autonomous SkinECG system

Figure 2는 SkinECG 시스템의 하드웨어 흐름을 보여준다. 본 시스템은 크게 O-EHN과 SkinECG로 구성된다.

- **O-EHN**
  - 여러 신체 부위의 EH와 power Tx로 구성
  - 서로 다른 orthogonal frequency를 사용하여 전력을 동시에 전달

- **SkinECG**
  - 가슴에 부착되는 ECG sensor patch
  - PMU와 ultralow-power ECG sensor 포함
  - QRST extractor와 BCC transmission 포함

SkinECG는 ECG 전체 waveform을 계속 digitizing하고 전송하는 대신, QRST extractor를 통해 useful QRST points 또는 edge 정보를 추출하고, 이를 BCC로 전송한다.

---

### 6.3 Figure 3: O-EHN과 power Tx

Figure 3은 본 논문의 공학적 핵심인 O-EHN과 power Tx 구조를 보여준다.

여러 power Tx가 같은 주파수로 전력을 전달하면, 각 신호가 수신부에 도달하는 위상 차이에 따라 destructive interference가 발생할 수 있다. 이 경우 Tx 수를 늘려도 recovered power가 증가하지 않거나 오히려 감소할 수 있다.

이를 해결하기 위해 본 논문은 각 Tx에 orthogonal frequency를 할당한다.

주파수는 다음과 같이 설정된다.

```text
f_Tx,ChN = 2^(N−1) · f_Tx
```

즉, 기본 주파수 f를 기준으로 f, 2f, 4f와 같은 형태의 채널을 구성한다. 예를 들어 8 MHz, 16 MHz, 32 MHz와 같은 조합을 사용할 수 있다.

Power Tx는 다음과 같은 블록으로 구성된다.

```text
MPPT-assisted boost converter
→ oscillator
→ high-voltage Tx driver
```

- **MPPT-assisted boost converter**: OPV/EH에서 최대 전력을 추출하고 회로 구동에 필요한 전압을 공급한다.
- **Oscillator**: 설정된 orthogonal frequency의 신호를 생성한다.
- **High-voltage Tx driver**: 출력 신호를 3.3 Vpp 수준으로 키워 BCP 전송 효율을 높인다.

Figure 3의 결과는 orthogonal frequency를 사용할 경우 여러 Tx의 recovered power가 더 안정적으로 합산됨을 보여준다.

---

### 6.4 Figure 4: SkinECG patch structure

Figure 4는 실제 SkinECG patch의 구조를 보여준다. SkinECG patch는 0.71 mm 두께의 hydrocolloid patch 위에 flexible PCB, conductive trace, electrodes를 통합한 형태이다.

패치에는 다음 전극들이 포함된다.

1. **ECG signal electrode**: ECG 신호 측정
2. **Reference electrode**: ECG 측정 기준 전극
3. **Power Rx electrode**: BCP로 전달된 전력 수신
4. **BCC output electrode**: QRST 정보를 body channel로 전송

논문은 power Rx electrode와 reference electrode 사이 거리가 중요하다고 설명한다. 두 전극이 너무 가까우면 parasitic capacitance가 leakage path로 작동하여 recovered voltage가 감소할 수 있다. 본 논문에서는 두 전극 사이가 10 cm 이상일 때 충분한 recovered voltage와 clear ECG reading을 얻을 수 있다고 제시한다.

또한 SkinECG 시스템의 소비전력은 약 522 nW이고, PMU 입력 전압이 0.4 Vpp 이상일 때 약 628 nW의 recovered power를 확보할 수 있다고 제시된다. 이는 제한된 실험 조건에서 SkinECG 동작에 충분한 전력으로 해석된다.

---

### 6.5 Figure 5: In vivo ECG monitoring

Figure 5는 실제 인체에서 SkinECG가 ECG를 측정하고 QRST 정보를 추출하는 결과를 보여준다.

Figure 5B는 다음 세 가지를 함께 제시한다.

1. in vivo ECG waveform
2. QRST feature extraction output
3. edge-encoded BCC output

SkinECG는 ECG waveform을 측정한 뒤, QRST extractor를 통해 useful QRST points 또는 edge 정보를 추출하고, 이를 edge encoding하여 BCC로 전송한다.

Figure 5C에서는 standing, dumbbell shoulder press, jumping, running 조건에서도 ECG가 측정됨을 보여준다. 논문은 움직임 중 baseline variation이 관찰되지만 QRS complex가 식별 가능하며, heart-rate extraction과 basic morphology analysis에는 충분하다고 설명한다.

Figure 5D에서는 24시간 ECG monitoring 결과를 제시한다. 4, 8, 12, 16, 24시간 시점에서 대표 ECG waveform이 유지되었다고 보고한다.

다만 이 결과는 병원용 diagnostic ECG 대체를 입증한다기보다, 제한된 조건에서 battery-free wearable ECG monitoring의 가능성을 보여주는 proof-of-concept 결과로 해석하는 것이 적절하다.

---

## 7. Discussion 핵심 정리

Discussion에서 저자들은 O-EHN 구조가 OPV뿐 아니라 thermoelectric generator, biofuel cell 등 다양한 energy harvester와 통합될 수 있다고 주장한다. 또한 ECG 단일 센서를 넘어 EMG, EEG 등 multisensor physiological monitoring으로 확장될 수 있다고 설명한다.

그러나 본 논문의 주요 실험은 OPV 기반 power Tx와 SkinECG 데모에 집중되어 있다. 따라서 다양한 EH 및 multisensor 환경에서 동일하게 안정적으로 동작하는지는 추가 검증이 필요하다.

본 논문은 병원용 diagnostic ECG 장비를 직접 대체하는 연구라기보다, battery-free wearable sensor를 위한 distributed body-area power network를 제안하고, 이를 SkinECG로 입증한 engineering proof-of-concept 연구로 해석하는 것이 적절하다.

---

## 8. 생성형 AI 인공지능을 활용한 이해(검토필요)

### 8.1 논문의 핵심 기여에 대한 해석

본 논문의 제목은 SkinECG이지만, 기술적 중심은 ECG sensing 자체보다 O-EHN/BCP 기반 distributed power transmission architecture에 있다. SkinECG는 해당 전력 구조의 대표 응용으로 사용되며, 논문의 핵심 기여는 여러 energy-harvesting node에서 하나의 sensor node로 전력을 안정적으로 전달하는 구조를 제안하고 검증한 데 있다.

---

### 8.2 병원용 ECG 대체 가능성

SkinECG는 ECG waveform을 측정하지만, 전체 ECG waveform을 지속적으로 digitizing하고 전송하는 방식이 아니라 QRST feature 기반 저전력 모니터링 구조를 사용한다. 따라서 병원용 diagnostic ECG 장비를 직접 대체한다고 보기 어렵다.

병원용 ECG 해석에서는 P wave, PR interval, QRS duration, ST segment, T wave morphology, QT interval, lead별 공간 정보 등이 중요하다. SkinECG가 이러한 정보를 어느 정도 보존할 수 있는지는 추가 확인이 필요하다.

---

### 8.3 QRST feature extraction의 정보 손실

SkinECG가 QRST point/edge 기반으로 정보를 전송한다면, 실제로 얻을 수 있는 주요 정보는 ECG 파형 전체가 아니라 Q/R/S/T 지점의 시간적 위치와 그 사이 간격이다. R-R interval, Q-R interval, R-S interval, Q-S interval, Q-T interval 등의 시간 정보는 추정 가능할 수 있다.

그러나 Q, S, T point는 R peak에 비해 진폭이 작거나 형태가 완만하고, motion artifact, baseline wander, skin-electrode impedance 변화, muscle noise 등에 더 민감하다. 따라서 실제 wearable 환경에서 안정적으로 신뢰할 수 있는 정보는 R peak 또는 QRS complex 중심일 가능성이 크며, Q/S/T point까지 임상적으로 충분히 정확하게 검출되는지는 추가 검증이 필요하다.

---

### 8.4 OPV 기반 energy autonomy의 실제 환경 적용성

논문은 OPV가 power Tx를 구동하기에 충분한 전력을 제공한다고 설명한다. 그러나 실제 착용 환경에서는 조도, 빛의 각도, 옷이나 이불에 의한 가림, 실내/야간 환경 등이 크게 달라질 수 있다.

따라서 24시간 ECG monitoring 결과가 실제 생활환경에서의 완전한 energy-autonomous operation을 의미하는지는 확인이 필요하다. 특히 저조도, 부분 가림, 야간, 병원 환경에서 OPV 기반 power Tx가 충분히 동작하는지 추가 검증이 필요하다.

---

### 8.5 대상자 수와 일반화 가능성

BCP는 인체의 전기적 특성을 전력 전달 채널로 사용하므로, 피부 두께, 피하지방, 근육량, 수분 함량, 피부-전극 접촉 상태, 자세 등에 영향을 받을 수 있다. 본 논문에서는 제한된 수의 대상자에서 recovered power variation을 평가하였으나, 일반 인구 또는 임상 대상자에게 결과를 일반화하기에는 한계가 있다.

따라서 고령자, 부종이 있는 환자, BMI가 높은 사람, 피부가 약한 환자, 거동이 제한된 환자 등 다양한 대상자군에서 성능을 검증할 필요가 있다.

---

### 8.6 10 cm 전극 간격의 일반화 가능성

본 논문은 SkinECG patch에서 power Rx electrode와 reference electrode 사이의 거리를 10 cm 이상 확보할 경우 sufficient recovered voltage와 clear ECG reading을 얻을 수 있다고 제시한다. 이는 전극 간 거리가 너무 가까울 때 발생할 수 있는 leakage path와 ECG 간섭 문제를 완화하기 위한 설계로 이해할 수 있다.

그러나 해당 10 cm 조건은 제한된 실험 조건에서 제시된 값이므로, 실제 착용 환경에서도 항상 충분한지는 추가 검증이 필요하다. 땀, 피부 전해질 변화, 피부-전극 접촉 상태, 부종, 체형, 움직임, 장시간 착용에 따른 접착력 변화는 skin-electrode impedance와 parasitic coupling을 변화시킬 수 있다.

---

### 8.7 중환자 및 거동 제한 환자 적용성

본 시스템은 신체 여러 위치에서 에너지를 수확하고, 이를 SkinECG로 전달하는 구조이다. 하지만 중환자나 침상 안정 환자의 경우 움직임이 적고, 피부가 이불이나 환의로 가려져 있으며, 여러 의료기기와 간섭 가능성도 있을 수 있다.

이러한 대상자에게는 OPV나 움직임 기반 energy harvester보다 thermoelectric generator처럼 움직임에 덜 의존하는 방식이 더 적합할 수 있다. 그러나 실제 전력 출력과 장시간 착용 안정성은 추가 검증이 필요하다.

---

## 9. 의료진 의견 수렴 배경

SkinECG 논문을 읽으며, 본 기술이 병원용 ECG 장비를 직접 대체하는 것이 아니라, battery-free long-term wearable ECG monitoring을 위한 전력 전달 아키텍처에 가깝다는 이해가 형성되었다.

그러나 실제 임상 현장에서 이러한 기술이 어떤 의미를 가질 수 있는지는 공학 논문만으로 판단하기 어렵다. 따라서 중환자실 간호사, 의사, 심전도 관련 의료진에게 비공식적으로 의견을 물어보는 것이 논문 이해에 도움이 될 수 있다.

의료진에게 물어볼 핵심 질문은 다음과 같다.

1. 심전도 파형 전체가 아니라 R peak, QRS complex, R-R interval 같은 주요 특징만 안정적으로 얻는 장치도 임상 모니터링에서 의미가 있는가?
2. 이런 장치가 기존 병원 심전도 모니터나 Holter보다 실제로 나을 수 있는 지점은 무엇인가?
3. 병원에서 ECG를 볼 때 반드시 필요한 정보는 무엇인가?
4. 중환자나 병동 환자에게 24시간 이상 피부 부착형 ECG 패치를 붙인다면 어떤 문제가 가장 클 것인가?
5. 이 기술은 중환자실 환자에게 현실성이 있는가, 아니면 퇴원 후 모니터링이나 부정맥 의심 환자에게 더 적합한가?

https://forms.gle/E9UFUyPnym9Cmwho6 설문조사 링크다. 
---

## 10. 저자에게 질문할 내용

아래 질문들은 논문을 더 정확히 이해하고, 향후 연구 방향을 배우기 위해 정리한 것이다. 질문은 비판을 위한 것이 아니라, 논문에서 제시한 기술의 적용 범위와 한계를 더 명확히 이해하기 위한 목적이다.

### 10.1 SkinECG가 제공할 수 있는 ECG 정보의 범위

논문에서는 SkinECG가 전체 ECG waveform을 지속적으로 digitizing하고 전송하는 대신, QRST extractor를 통해 useful QRST points를 추출한다고 설명한다.

이때 SkinECG를 통해 안정적으로 얻을 수 있는 ECG 정보가 구체적으로 어디까지인지 궁금하다. 예를 들어 R-R interval과 heart rate 중심의 monitoring이 주된 목적일까? 아니면 QRS duration, QT interval, T-wave 관련 정보까지 신뢰성 있게 추출할 수 있는 구조일까?

---

### 10.2 병원용 ECG 장비와의 관계

SkinECG는 배터리 없는 장시간 ECG monitoring 가능성을 보여준다는 점에서 매우 흥미롭다. 다만 병원에서 사용하는 diagnostic ECG 장비는 전체 ECG waveform, lead별 정보, ST segment, T wave morphology, QT interval 등을 함께 해석한다.

따라서 SkinECG는 병원용 diagnostic ECG를 대체하기보다는, 장시간 wearable ECG monitoring 또는 screening에 더 적합한 시스템으로 이해하는 것이 맞는지 궁금하다.

---

### 10.3 Q, S, T point 검출의 안정성

R peak는 ECG 파형에서 크고 뾰족하기 때문에 비교적 안정적으로 검출될 수 있다고 이해했다. 반면 Q, S, T point는 R peak보다 진폭이 작거나 형태가 완만해서 motion artifact, baseline wander, skin-electrode impedance 변화에 더 민감할 수 있다고 생각된다.

논문에서 제안한 QRST extractor가 실제 움직임, 땀, 피부 접촉 변화가 있는 조건에서도 Q, S, T point를 얼마나 안정적으로 검출할 수 있는지 궁금하다.

---

### 10.4 QRST feature 기반 전송의 정보 손실 문제

SkinECG는 ECG 전체 파형을 그대로 전송하는 대신 QRST point 또는 edge 정보를 추출해 전송하는 구조로 이해했다. 이는 저전력 동작에는 매우 유리하지만, ECG waveform의 세부 형태 정보는 일부 손실될 수 있을 것 같다.

이 방식에서 보존되는 정보와 손실되는 정보의 경계가 궁금하다. 예를 들어 R-R interval, Q-R interval, R-S interval, Q-S interval과 같은 시간 정보는 얻을 수 있지만, ST segment 변화나 T wave morphology처럼 연속 파형의 세부 형태가 중요한 정보는 제한될 수 있는지 궁금하다.

---

### 10.5 BCP 전력 신호와 ECG 측정 신호 간 간섭 가능성

SkinECG는 같은 패치 안에서 BCP를 통해 MHz 대역의 전력 신호를 수신하면서 동시에 ECG와 같은 미세 생체신호를 측정한다. 이때 전력 전달 신호가 ECG sensing front-end에 간섭으로 유입될 가능성이 있을 것 같다.

논문에서는 전극 간 거리와 배치를 통해 clear ECG reading과 충분한 power recovery를 얻었다고 설명하지만, 땀, 전해질 변화, 장시간 착용, 피부 접촉 변화가 있을 때도 이러한 간섭 억제가 안정적으로 유지되는지 궁금하다.

---

### 10.6 10 cm 전극 간격의 일반화 가능성

논문에서는 power Rx electrode와 reference electrode 사이의 거리가 10 cm 이상일 때 충분한 recovered voltage와 clear ECG reading을 얻을 수 있다고 설명한다.

이 10 cm라는 조건이 다양한 체형, 피부 두께, 피하지방, 부종, 땀, 전해질 변화, 장시간 착용 조건에서도 충분한지 궁금하다. 특히 임상 환경에서는 피부 상태나 접착 상태가 개인마다 다르기 때문에, 전극 간격이 더 넓어져야 하는 상황도 있을 수 있는지 궁금하다.

---

### 10.7 OPV 기반 power Tx의 실제 환경 적용성

논문에서는 OPV가 power Tx를 구동하기에 충분한 전력을 제공한다고 설명한다. 하지만 실제 착용 환경에서는 조도, 빛의 각도, 옷이나 이불에 의한 가림, 실내/야간 환경 등이 크게 달라질 수 있다.

24시간 ECG monitoring 실험이 어떤 조도 조건에서 수행되었는지, 그리고 저조도·부분 가림·야간 조건에서도 energy-autonomous operation이 가능한지 궁금하다.

---

### 10.8 대상자 수와 일반화 가능성

BCP는 인체의 전기적 특성을 전력 전달 채널로 사용하기 때문에, 피부 두께, 피하지방, 근육량, 수분 함량, 피부-전극 접촉 상태 등에 따라 recovered power가 달라질 수 있다고 이해했다.

논문에서는 제한된 수의 대상자에서 recovered power variation을 제시한 것으로 보이는데, 향후 더 다양한 대상자군에서 성능을 검증할 계획이 있는지 궁금하다. 예를 들어 고령자, 부종이 있는 환자, BMI가 높은 사람, 피부가 약한 환자, 거동이 제한된 환자에서도 유사한 성능이 유지될 수 있을지 궁금하다.

---

### 10.9 중환자나 거동 제한 환자에게의 적용 가능성

이 시스템은 신체 여러 위치에서 에너지를 수확하고, 이를 SkinECG로 전달하는 구조이다. 하지만 중환자나 침상 안정 환자의 경우 움직임이 적고, 피부가 이불이나 환의로 가려져 있으며, 여러 의료기기와 간섭 가능성도 있을 수 있다.

이러한 대상자에게는 OPV나 움직임 기반 energy harvester보다 thermoelectric generator처럼 움직임에 덜 의존하는 방식이 더 적합할 수 있는지 궁금하다.

---

### 10.10 OPV 외 energy harvester로의 확장성

Discussion에서는 O-EHN 구조가 OPV뿐 아니라 thermoelectric generator, biofuel cell 등 다양한 energy harvester와 통합될 수 있다고 설명한다.

이 확장성이 실제로 실험적으로 검증된 것인지, 아니면 현재 단계에서는 platform-level 가능성으로 제시된 것인지 궁금하다. 특히 OPV 외의 energy harvester가 power Tx를 구동하기에 충분한 전력을 안정적으로 제공할 수 있는지 궁금하다.

---

### 10.11 이 논문의 핵심 기여에 대한 이해

논문을 읽으면서, SkinECG 자체도 중요하지만 이 연구의 핵심 기여는 ECG sensing 성능보다는 O-EHN/BCP 기반 distributed power transmission architecture에 있다는 생각이 들었다.

즉, SkinECG는 이 전력 전달 구조를 보여주기 위한 대표 응용이고, 더 큰 기여는 battery-free wearable sensor를 가능하게 하는 body-area power network를 제안하고 검증한 데 있다고 이해해도 되는지 궁금하다.

---

## 11. 최종 정리

SkinECG는 병원 ECG를 대체하는 완성형 진단기라기보다, 신체 여러 위치에서 수확한 에너지를 가슴의 wearable ECG sensor로 전달해 배터리 없는 장시간 생체신호 모니터링이 가능함을 보인 전력 전달 아키텍처 중심의 proof-of-concept 연구로 해석하는 것이 적절하다.

이 논문의 가장 중요한 의의는 ECG 센서 자체보다, 센서가 위치해야 하는 곳과 energy harvester가 위치해야 하는 곳이 다를 수 있다는 location mismatch 문제를 시스템 수준에서 해결하려 했다는 점이다. O-EHN과 BCP는 이 문제를 해결하기 위한 핵심 기술이며, SkinECG는 그 대표적인 응용 사례로 제시된다.

다만 실제 임상 적용을 위해서는 ECG 정보의 보존 범위, Q/S/T point 검출 안정성, OPV 기반 power Tx의 실제 환경 적용성, 다양한 대상자에서의 BCP 성능, 장시간 착용 안정성, 피부 안전성, 중환자 및 거동 제한 환자 적용성에 대한 추가 검증이 필요하다.
