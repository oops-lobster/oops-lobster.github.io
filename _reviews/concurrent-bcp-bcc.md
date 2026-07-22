---
title: "몸 하나로 전력과 데이터를 동시에 주고받는 법"
title_en: "Power and Data over One Body-Coupled Electrode"
title_ja: "単一電極で電力とデータを同時に伝送する"
paper_title: "Concurrent Body-Coupled Powering and Communication ICs With a Single Electrode"
topic: Body-Coupled Systems
year: 2024
summary: "하나의 결합 전극을 공유하면서 전력·명령·센서 데이터를 동시에 주고받기 위해, 자기 간섭 제거와 그라운드 도메인 분리를 결합한 회로 구조를 분석했습니다."
summary_en: "A circuit-level analysis of concurrent power, command, and sensor-data transfer over one body-coupled electrode using self-interference cancellation and ground-domain separation."
summary_ja: "単一の人体結合電極で電力・コマンド・センサーデータを同時伝送するため、自己干渉除去とグラウンド領域分離を組み合わせた回路構成を分析しました。"
reading_time: 32
order: 3
math: true
tags:
  - Body-Coupled Power
  - Body-Coupled Communication
  - Self-Interference Cancellation
  - Wearable Circuits
  - SkinECG
---

> **한 문장 요약**
> 인체라는 하나의 결합 경로와 BS·SN 각각 하나의 coupling electrode를 공유하면서, **BS→SN 전력 전달과 명령 통신, SN→BS 센서 데이터 통신을 동시에 수행**하기 위해 BS의 adaptive self-interference cancellation과 SN의 ground-domain separation을 구현한 2024년 JSSC 회로 논문이다.

> **이 논문의 핵심 의미**
> 기존 BCP/BCC 시스템이 간섭을 피하려고 시간분할, 반복 송신, 복수 전극 또는 분리된 장치를 사용한 것과 달리, 이 논문은 **전력 공급을 끊지 않고 양방향 통신을 유지하는 단일전극 body-area infrastructure**를 제시한다. 2021년 BCP와 2026년 SkinECG 사이에서, “전력 전달”을 “전력·명령·센서 데이터가 공존하는 네트워크”로 확장한 연결고리로 볼 수 있다.

> **해석 시 주의**
> 이 논문은 ECG 센서 자체나 SkinECG를 구현한 논문이 아니다. 여기서 **single electrode는 BCP/BCC용 coupling electrode 하나**를 의미하며, ECG의 두 측정 전극을 하나로 줄였다는 뜻이 아니다. 또한 wet electrode와 off-chip LC를 사용한 on-body proof-of-concept이며, 장기 착용·운동·임상 정확도는 검증하지 않았다.

---

## 1. 서지 정보

| 항목 | 내용 |
|---|---|
| 논문 | Concurrent Body-Coupled Powering and Communication ICs With a Single Electrode |
| 저자 | Jiamin Li, Yilong Dong, Longyang Lin, Joanne Si Ying Tan, Jia Yi Fong, Jerald Yoo |
| 교신저자 | Jerald Yoo |
| 학술지 | IEEE Journal of Solid-State Circuits |
| 연도 | 2024 |
| DOI | 10.1109/JSSC.2024.3353386 |
| 공정 | 40-nm 1P8M standard CMOS |
| 검증 단계 | BS·SN ASIC 측정 + wet electrode 기반 on-body proof-of-concept |
| 핵심 키워드 | BCP, BCC, power–data concurrency, single electrode, adaptive SI-C, ground-domain separation |

---

## 2. 이 논문을 왜 읽는가

2021년 BCP 연구는 인체를 전력 전달 매질로 사용할 수 있음을 보여주었다. 2026년 SkinECG는 분산된 에너지 수확 노드에서 가슴의 초저전력 ECG 센서로 전력을 전달했다. 이 논문은 그 사이에서 다음 질문을 다룬다.

> **인체 채널 하나에서 강한 전력 신호를 보내는 동시에, 명령을 내려보내고 센서의 작은 응답을 다시 받을 수 있는가?**

특히 SkinECG를 다음 단계로 확장하려면 단순 QRST/R-R 이벤트 보고를 넘어, 필요할 때 더 많은 ECG 정보를 전송해야 한다. 이때 전력 공급과 uplink 데이터가 서로 방해하지 않는 구조가 필요하므로 본 논문의 회로가 직접적인 선행 기반이 된다.

### 연구 흐름에서의 위치

```text
2021 BCP
몸을 전신 전력 전달 경로로 사용할 수 있는가?
        ↓
2024 Concurrent BCP/BCC
전력·명령·센서 데이터를 한 인체 경로에서 동시에 처리할 수 있는가?
        ↓
2026 SkinECG
분산 에너지 수확으로 실제 초저전력 ECG 센서를 구동할 수 있는가?
        ↓
후속 질문
평상시 저전력 감시 + 필요 시 full-waveform burst 전송이 가능한가?
```

---

## 3. 먼저 구분해야 할 용어

### 3.1 BCP와 BCC

- **BCP, Body-Coupled Powering**  
  인체를 forward transmission path로 사용해 전력을 전달한다.
- **BCC, Body-Coupled Communication**  
  인체를 통해 데이터를 전달한다.
- **Downlink**  
  BS에서 SN으로 향하는 전력 또는 명령.
- **Uplink**  
  SN에서 BS로 향하는 센서 데이터.

### 3.2 Single electrode의 의미

이 논문에서 말하는 single electrode는 다음 세 기능이 **하나의 body-interface electrode를 공유**한다는 뜻이다.

```text
BS → SN : BCP power
BS → SN : BCC command data
SN → BS : BCC sensor data
```

이는 ECG 측정 전극 하나를 의미하지 않는다. Single-lead ECG도 일반적으로 두 위치의 전위차를 측정하므로 두 sensing contact가 필요하다.

---

## 4. 기존 방식의 문제: Fig. 1–4

## 4.1 Fig. 1 — 연구 동기

Body-area network의 노드가 소형화될수록 배터리 용량은 줄어드는데, 동시에 다중 노드 제어를 위한 downlink와 센서 데이터 수집을 위한 uplink가 필요하다. 따라서 지속적인 전력 공급과 통신 연결성을 동시에 유지해야 한다.

## 4.2 Fig. 2 — 기존 BCP/BCC 통합 방식

기존 연구들은 간섭을 피하기 위해 세 가지 방식에 의존했다.

1. **BCP downlink·BCC downlink·BCC uplink를 시간분할로 번갈아 사용**
2. **전력과 uplink를 시간분할하며 경로별 전극을 추가**
3. **BS의 power TX와 data RX를 물리적으로 분리하되 SN은 여전히 번갈아 사용**

### 기존 방식의 공통 한계

- 데이터를 보낼 때 전력 공급이 중단될 수 있음
- 다중 노드 환경에서는 한 노드의 통신 때문에 모든 노드의 powering이 끊길 수 있음
- 스위치 제어와 동기화 필요
- 비동기 반복 패킷 전송은 데이터 중복과 낮은 데이터율을 초래
- 복수 전극·복수 장치는 착용 면적과 시스템 복잡도를 증가

## 4.3 Fig. 3 — 본 논문의 선언

> BS와 SN 각각 하나의 coupling electrode만 사용하면서 BCP와 BCC uplink/downlink를 동시에 수행한다.

## 4.4 Fig. 4 — 하나로 합치면 발생하는 네 가지 문제

### BS 측

1. **Data RX saturation**  
   최대 8.4 Vpp의 강한 power TX 신호가 약한 uplink 수신기에 결합되어 수신단을 포화시킨다.
2. **Uplink leakage**  
   센서의 uplink가 data RX로 가지 않고 저임피던스 power TX 출력단으로 새어 나간다.

### SN 측

3. **Downlink power leakage**  
   수신한 전력이 data TX의 저임피던스 출력 경로로 샌다.
4. **Uplink data backflow**  
   SN이 만든 uplink 데이터가 몸으로 나가지 않고 power RX 쪽으로 역류하여 정류기 동작과 전력 회수를 방해한다.

---

## 5. 전체 시스템 구조: Fig. 5

## 5.1 Base Station

BS는 외부 전원을 가진 강한 노드로서 다음 기능을 담당한다.

- 10/40 MHz FSK 기반 power·command TX
- 1 MHz OOK uplink data RX
- Adaptive self-interference cancellation
- Charge-replenishing high-voltage driver

### BS 송신부

```text
FSK baseband controller
→ DCO
→ pulse generator
→ CR-HV driver
→ single coupling electrode
```

### BS 수신부

```text
single electrode
→ active low-pass filter
→ LNA
→ envelope detector
→ comparator
→ decoder
```

## 5.2 Sensor Node

SN은 인체에서 받은 전력으로 동작하는 초저전력 노드다.

- Power RX: DIB + rectifier + dual-ground-domain DC–DC
- Command RX: passive receiver-based 10/40 MHz FSK demodulation
- Data TX: 1 MHz OOK
- GNDRX와 GNDTX의 ground-domain separation

---

## 6. Base Station 핵심 회로

## 6.1 Fig. 6–7 — Adaptive self-interference cancellation

BS가 전력 신호를 크게 내보내는 동안 동일 전극을 통해 센서의 작은 uplink를 받아야 한다. 수신단에는 대략 다음 신호가 들어온다.

\[
V_{\text{RX,in}}
=
V_{\text{self-interference}}
+
V_{\text{uplink}}
+
V_{\text{noise}}
\]

BS는 자신이 보낸 고전압 신호 \(V_{\mathrm{HV}}\)를 알고 있으므로 내부 replica driver에서 180° 반대 위상인 \(V_{\mathrm{replica}}\)를 만든다.

\[
V_{\mathrm{AVG}}
\approx
V_{\mathrm{HV}}
+
V_{\mathrm{replica}}
+
V_{\mathrm{uplink}}
\]

두 자기신호가 잘 맞으면:

\[
V_{\mathrm{HV}}+V_{\mathrm{replica}}\approx0
\]

이므로 센서 uplink가 남는다.

### 왜 센서의 작은 응답은 함께 지워지지 않는가

- Replica에는 BS가 생성한 downlink 파형만 포함된다.
- 센서 uplink의 데이터는 BS가 미리 알 수 없다.
- Downlink는 10/40 MHz, uplink 경로는 1 MHz로 주파수도 다르다.
- 따라서 cancellation은 모든 신호를 지우는 것이 아니라, **자기 downlink와 닮은 성분을 선택적으로 빼는 구조**다.

### 왜 adaptive tuning이 필요한가

Body coupling interface의 equivalent loading capacitance \(C_{\mathrm{ENV}}\)는 자세·전극·환경 결합에 따라 달라진다. 그러면 실제 \(V_{\mathrm{HV}}\)의 slew rate가 바뀌어 고정 replica와 맞지 않는다.

Replica 쪽의 capacitor bank \(C_{\mathrm{SI-C}}\)를 조절하면:

\[
\frac{dV}{dt}\approx\frac{I}{C}
\]

관계에 따라 replica의 상승·하강 속도를 바꿀 수 있다.

- \(C_{\mathrm{SI-C}}>C_{\mathrm{ENV}}\): replica가 너무 느려져 negative peak 발생
- \(C_{\mathrm{SI-C}}<C_{\mathrm{ENV}}\): replica가 너무 빨라져 positive peak 발생
- Peak가 허용범위 내: 현재 값을 유지

Adaptive logic은 \(C_{\mathrm{ENV}}\)를 직접 재는 것이 아니라, **상쇄 후 남은 \(V_{\mathrm{AVG}}\)의 peak를 feedback으로 보고 capacitor bank를 증감**한다.

### Falling edge에서만 평가하는 이유

Rising edge와 falling edge에서는 같은 속도 오차가 반대 부호의 peak로 나타날 수 있다. 평가 시점을 falling edge로 고정해야:

- positive peak → capacitor 증가
- negative peak → capacitor 감소

라는 제어 규칙을 일관되게 적용할 수 있다.

> **공부 메모**
> 외부 환경의 capacitance를 직접 재는 feedforward가 아니라, 두 파형을 실제로 합친 뒤 남은 출렁임을 보며 조절하는 closed-loop feedback이다.

---

## 6.2 Band-stop LC filter

Band-stop filter는 “uplink 데이터를 제거하는 필터”가 아니다. **Uplink가 송신기 출력단으로 새는 경로에 세운 높은 임피던스 벽**이다.

논문의 off-chip LC 값:

- \(L=47\,\mu H\)
- \(C=560\,pF\)
- 1 MHz uplink 부근에서 공진

동작:

```text
1 MHz uplink 관점
→ TX driver 방향 임피던스가 높음
→ uplink가 TX 출력단으로 새지 않고 data RX로 향함

10/40 MHz downlink 관점
→ 상대적으로 낮은 임피던스
→ 정상적인 power/command TX 가능
```

> **물 비유**
> 1 MHz 물결만 막는 특수 방파제다. 작은 센서 응답이 스피커 쪽 배수구로 빠지지 못하고 마이크 쪽으로 향하게 한다.

---

## 6.3 Fig. 8 — Standard CMOS에서 8.4 Vpp를 견디는 HV switch

표준 CMOS의 thick-oxide device nominal voltage는 2.5 V 수준이므로, 단일 MOSFET이 8.4 Vpp를 직접 견디면 overstress 위험이 있다.

해결법은 **네 개의 NMOS를 직렬로 stacking**하는 것이다.

```text
고전압 VSW
 │
MN4
 │
MN3
 │
MN2
 │
MN1
 │
GND
```

Off 상태에서 전체 전압을 여러 소자가 나눠 받아 각 \(V_{\mathrm{DS}}\)를 nominal range 안으로 유지한다. MP1–MP6는 별도의 복잡한 level shifter 없이 nominal control signal \(V_{\mathrm{CTR}}\)로 stacked switch를 안전하게 제어하도록 돕는다.

### 기초 용어 정리

- **MOSFET**: Gate 전압으로 Source–Drain 사이 전류 통로를 여닫는 전자식 밸브
- **NMOS**: Gate가 Source보다 충분히 높을 때 켜짐
- **PMOS**: Gate가 Source보다 충분히 낮을 때 켜짐
- **CMOS**: NMOS와 PMOS를 상보적으로 조합해 회로를 만드는 방식·공정
- **Source/Drain**: MOSFET 전류 경로의 양 끝
- **Gate**: 통로를 제어하는 단자
- **PN junction**: P형·N형 반도체 경계에서 형성되는 장벽. MOSFET 내부 body diode와 isolation에 관련되지만, MOSFET의 주된 on/off는 Gate 전기장이 만드는 채널로 제어된다.

---

## 6.4 Fig. 9 — Charge-replenishing high-voltage driver

CR-HV는 **Charge-Replenishing High-Voltage driver**다. BS의 10/40 MHz 고전압 power·command 파형을 만드는 최종 송신 드라이버다.

### 왜 전하가 남아 있는가

출력과 중간 노드에는 부하·배선·MOSFET·전극·환경에 의한 capacitance가 존재한다. 전압을 높이면 capacitance에 전하와 에너지가 저장된다.

\[
Q=CV
\]

\[
E=\frac12CV^2
\]

일반 드라이버는 출력 전압을 낮출 때 이 에너지를 GND로 버려 열로 소모한다.

### CR-HV의 동작

#### Pull-down 단계: charge recycling

Nodes 1–3의 parasitic capacitance에 있던 전하를 \(C_{\mathrm{CP1}}\)–\(C_{\mathrm{CP3}}\)에 옮겨 저장한다.

#### Pull-up 단계: charge replenishing

저장해 둔 전하를 nodes 4–6의 전압을 끌어올리는 데 재사용한다.

### 장점

1. 외부 전원에서 새로 가져오는 에너지 감소
2. 중간 노드 전환 속도 증가
3. 더 높은 switching frequency 가능
4. PMOS·NMOS가 동시에 반쯤 켜지는 crowbar current 감소
5. 발열과 순간 전원 부담 감소

측정 결과, 8.4 Vpp 출력에서 주파수가 높아질수록 이점이 커졌으며 **80 MHz에서 전체 BS 전력소비를 31% 감소**시켰다.

> **물 비유**
> 높은 물탱크를 비울 때 물을 하수구에 버리지 않고 1·2·3층 보조 물통에 받아 둔다. 다음에 탱크를 올릴 때 그 물을 먼저 사용하므로 펌프가 할 일이 줄고 더 빨리 채울 수 있다.

---

## 7. Sensor Node 핵심 회로

## 7.1 Fig. 10 — Ground-domain separation

SN의 power RX와 data TX는 모두 저임피던스 경로가 될 수 있어 전력 누설과 uplink 역류를 일으킨다. 저자들은 전극을 추가하는 대신, 회로 내부의 ground를 나눈다.

- **GNDRX**: power RX, command RX, data preparation
- **GNDTX**: 최종 uplink output driver

CMOS 구현:

- GNDRX: p-substrate
- GNDTX: deep n-well 내부의 분리 영역
- Post-layout coupling: \(<0.4\,pF\)

Ground domain을 크게 만들수록 parasitic coupling이 증가하므로 **최종 driver만 GNDTX에 두고**, baseband data preparation은 GNDRX에 유지한다.

## 7.2 Unbalanced comparator — Ground 언어 번역

GNDRX 기준의 논리 0·1을 GNDTX 회로가 그대로 이해할 수 없으므로, GNDTX domain에서 동작하는 comparator가 신호 의미를 읽고 GNDTX/VDDTX 기준의 출력으로 재생성한다.

입력 차이는 대략 0 또는 VDD이므로, intentional offset을 갖는 asymmetrical comparator를 사용해 oscillation을 줄이고 settling을 빠르게 한다.

> **물 비유**
> 두 방의 “바닥 높이”가 다르므로 같은 수위 숫자도 의미가 다르다. 통역사가 RX 방의 수위 명령을 읽고 TX 방 기준으로 다시 말해준다.

## 7.3 SN의 band-stop filter와 tri-state buffer

### Band-stop filter

Power RX 입구에서 1 MHz에 높은 임피던스를 만들어 uplink data가 power RX로 역류하지 못하게 한다.

### Tri-state buffer

Data TX가 꺼져 있을 때 출력단을 high-Z로 만들어 downlink power가 data TX로 새지 않게 한다.

Tri-state의 세 상태:

```text
0
1
Z = 전기적으로 연결되지 않은 것에 가까운 high impedance
```

---

## 7.4 Fig. 11–12 — Dual-ground-domain DC–DC converter

Ground를 분리하면 GNDTX domain도 별도의 안정된 전원을 받아야 한다.

### 1단계: Dual-input boost converter

- DIB/rectifier의 두 입력에서 전력을 받음
- DCM 동작
- Hill-climbing MPPT로 inductor charging time \(T_1\) 조절
- ZCS로 discharging time \(T_2\) 결정
- VDDRX 생성

### 2단계: Cross-ground-domain regulation

VDDRX의 에너지를 GNDTX 기준 VDDTX로 넘기되 ground isolation을 유지한다.

직접 GNDRX와 GNDTX를 연결하면 역류 경로가 생기므로 **GNDITM이라는 intermediate domain과 capacitor**를 둔다.

```text
GNDRX 방
→ intermediate capacitor에 charge
→ 양쪽 switch를 모두 끄는 dead time
→ GNDTX 방으로 discharge
```

### 세 양동이·갑문 비유

- RX 물통: VDDRX–GNDRX
- 중간 물통: VDDITM–GNDITM 및 flying capacitor
- TX 물통: VDDTX–GNDTX
- MOSFET switch: 빨대·갑문
- 제어신호 \(\Phi_3\): 어느 쪽 갑문을 열지 정하는 명령

Allowed state:

```text
(RX path, TX path)
(1,0) : RX에서 intermediate로 charge
(0,0) : 양쪽 모두 차단, dead time
(0,1) : intermediate에서 TX로 discharge
```

Forbidden state:

```text
(1,1) : 두 ground domain이 동시에 연결되어 isolation 붕괴
```

즉:

\[
RX+TX\le1
\]

이고 항상 \(RX+TX=1\)인 것은 아니다.

### Comparator와 \(\Phi_{3EN}\)

Comparator는 VDDTX와 reference voltage를 비교해 VDDTX가 부족한지 판단한다.

- VDDTX 낮음 → \(\Phi_{3EN}\)이 transfer를 명령
- VDDTX 충분함 → transfer 중지

\(\Phi\)는 Greek letter phi이며, \(\Phi_{3EN}\)은 보통 “파이 쓰리 이엔”이라고 읽는다.

### Negative-edge delay

Switch transition이 겹치지 않도록 한쪽을 먼저 닫고 짧은 dead time 후 다른 쪽을 연다. Break-before-make 동작이다.

### Cold start

- VDDTX가 0.8 V 미만이면 cold-start mode
- 이때 2단계 power switches는 startup sequence에 따라 동작
- Data TX는 cold-start 동안 비활성화해야 함
- 일반적으로 VDDRX → VDDITM → VDDTX 순으로 rise

### 측정 효율

- 1단계: 수 µW–100 µW 이상에서 90% 초과, 500 nW 이상에서 70% 초과
- 2단계 cross-ground converter: 최대 **89.1%**, 약 5–500 kΩ 부하에서 70% 초과

---

## 7.5 Fig. 13 — Passive receiver-based command data RX

Downlink는 10 MHz와 40 MHz 두 FSK 주파수를 사용한다.

각 주파수에 맞춘 off-chip parallel LC:

- 40 MHz: 1.2 µH + 12 pF
- 10 MHz: 8.2 µH + 22 pF

동작:

```text
10/40 MHz 입력
→ 각 주파수 전용 LC가 선택적으로 filtering/boosting
→ 3-stage rectifier가 수신 세기에 해당하는 baseband voltage 생성
→ comparator가 두 경로를 비교
→ clock/data recovery
```

동일 FSK 신호는 rectifier와 power-management 경로를 통해 전력으로도 회수된다.

인체 채널 loss가 주파수마다 다르므로 external biases \(V_{B1}\), \(V_{B2}\)로 comparator sensitivity를 보정한다.

> **Fig. 13의 핵심**
> 하나의 downlink FSK 신호가 **주파수 선택으로 명령을 전달하면서 동시에 실제 에너지를 공급**한다.

---

## 8. Figure-by-Figure 요약

| Figure | 핵심 내용 | 읽을 때 잡아야 할 한 문장 |
|---|---|---|
| Fig. 1 | BAN에서 지속 전력과 양방향 통신 필요 | 미니어처 노드에는 power sustainability와 connectivity가 동시에 필요 |
| Fig. 2 | 기존 TDM·복수 전극 구조 | 기존에는 시간·전극·장치를 나눠 간섭을 피함 |
| Fig. 3 | 단일 전극 동시 BCP/BCC 제안 | BS와 SN 각각 electrode 하나로 세 기능 동시 수행 |
| Fig. 4 | BS·SN의 간섭·누설·역류 문제 | 그냥 합치면 네 종류의 실패가 발생 |
| Fig. 5 | 전체 시스템 아키텍처 | BS는 강한 송신·상쇄, SN은 초저전력 수신·분리 |
| Fig. 6 | BS concurrency 구조 | Band-stop + replica cancellation |
| Fig. 7 | Adaptive SI-C feedback | 남은 positive/negative peak로 capacitor bank 조절 |
| Fig. 8 | HV switch | MOSFET stacking으로 8.4 Vpp 견딤 |
| Fig. 9 | CR-HV driver | 버리던 전하를 회수해 다음 transition에 재사용 |
| Fig. 10 | SN leakage/backflow suppression | Ground separation + band-stop + tri-state |
| Fig. 11 | Dual-ground DC–DC | Intermediate domain으로 isolation을 유지하며 전력 전달 |
| Fig. 12 | Normal/cold-start timing | Break-before-make와 0.8 V cold-start logic |
| Fig. 13 | Passive command RX | 10/40 MHz FSK를 명령과 전력으로 동시 활용 |
| Fig. 14 | Chip micrograph·전력·면적 | BS는 TX가, SN은 data TX가 주요 전력 소비원 |
| Fig. 15 | SI-C 측정 | Adaptive cancellation로 약 40 dB interference suppression |
| Fig. 16 | CR-HV 절전 | 80 MHz에서 BS power 31% 감소 |
| Fig. 17 | DC–DC 효율 | Cross-ground conversion 최대 89.1% |
| Fig. 18 | On-body setup | Wet electrode, 계측 ground isolation 주의 |
| Fig. 19 | Uplink 수신강도 | Wrist-to-wrist에서 제안기술 적용 시 유효 uplink 확보 |
| Fig. 20 | BER | 작은 입력에서는 concurrent HV로 BER 악화 가능 |
| Fig. 21 | TX off power recovery | Ground separation + tri-state로 leakage 억제 |
| Fig. 22 | TX on power recovery | Uplink 송신 중에도 120 cm에서 12.5 µW 회수 |
| Fig. 23 | Transient system demo | Downlink로 SN cold-start 후 uplink를 동시에 복구 |

---

## 9. 주요 측정 결과

## 9.1 Chip·Power breakdown

### BS IC

- Die: 1.5 mm × 2 mm
- Power & command TX: 56 mW, 97.9%
- Data RX: 약 0.9 mW, 1.6%
- Adaptive SI-C: 약 0.3 mW, 0.5%
- 면적:
  - Power & command TX: 0.76 mm², 71%
  - Data RX: 0.10 mm², 9%
  - Adaptive SI-C: 0.21 mm², 20%

### SN IC

- Die: 1 mm × 1.5 mm
- Sensor data TX: 18 µW, 96%
- Command data RX: 0.8 µW, 4%
- 면적:
  - Power RX: 0.25 mm², 48%
  - Command data RX: 0.16 mm², 31%
  - Sensor data TX: 0.11 mm², 21%

> **해석**
> Adaptive SI-C는 전력은 적게 소비하지만 capacitor bank와 sensing logic 때문에 면적은 비교적 많이 차지한다. BS는 강한 pump station, SN은 수십 µW급 응답 노드로 설계된 비대칭 시스템이다.

## 9.2 핵심 성능

| 항목 | 결과 |
|---|---:|
| BS HV output | 8.4 Vpp |
| Downlink | 10/40 MHz FSK power + command |
| Uplink | 1 MHz OOK, 최대 100 kb/s |
| Adaptive SI suppression | 약 40 dB |
| CR-HV power reduction | 80 MHz에서 31% |
| Cross-ground DC–DC peak efficiency | 89.1% |
| On-body received uplink | > −45 dBV |
| SN power recovery, TX off | 15 cm 약 1 mW, 120 cm 약 15 µW with tri-state |
| SN power recovery, TX on | 30 cm 165 µW, 120 cm 12.5 µW |
| Demonstrated on-body span | 최대 120 cm wrist-to-wrist |

## 9.3 BER 해석

Concurrent 8.4 Vpp HV TX가 켜져 있을 때도 uplink recovery가 가능하지만, uplink 입력이 매우 낮을 때—논문 예시로 20 mVpp 미만—BER가 HV output off 조건보다 약 1–2 orders 악화될 수 있다.

따라서:

- 동시 동작 가능: 입증
- 자기 간섭 완전 제거: 아님
- uplink amplitude·data rate·환경 조건에 따른 margin 설계: 필요

---

## 10. 이 논문의 핵심 기여

## 10.1 시스템 기여

- BS와 SN 각각 하나의 coupling electrode
- BCP power downlink
- BCC command downlink
- BCC sensor-data uplink
- 세 기능의 동시 동작

## 10.2 BS 회로 기여

- Adaptive SI-C로 strong TX self-interference 억제
- Band-stop LC로 1 MHz uplink leakage 차단
- CR-HV driver로 8.4 Vpp·최대 80 MHz 동작과 power reduction 양립
- Standard CMOS에서 stacked HV switch 구현

## 10.3 SN 회로 기여

- GNDRX/GNDTX ground-domain separation
- Band-stop LC + tri-state buffer로 leakage/backflow 억제
- Unbalanced comparator 기반 cross-domain data translation
- Intermediate ground domain을 포함한 89.1% 효율 power converter
- Passive receiver-based FSK command recovery

## 10.4 연구 흐름에서의 기여

이 논문은 “몸으로 전력을 보낸다”에서 한 단계 나아가:

> **몸을 하나의 양방향 power-and-data bus로 사용할 수 있음을 보인 기반 회로 연구**

라고 해석할 수 있다.

---

## 11. 한계와 비판적 평가

## 11.1 Wet electrode 기반 검증

실제 장기 wearable에서 중요한 dry electrode, 땀, 움직임, 접촉 변화와 피부 안전성을 직접 검증하지 않았다.

## 11.2 Off-chip passive components

Band-stop LC와 command RX의 parallel LC가 off-chip이므로 완전 집적과 form factor 관점에서 추가 연구가 필요하다.

## 11.3 BS 전력소비

BS power & command TX가 56 mW를 소비한다. SN은 초저전력이지만 시스템 전체가 battery-free 또는 초저전력이라는 뜻은 아니다.

## 11.4 제한된 uplink margin

Adaptive SI-C 후에도 residual interference가 남는다. Uplink 입력이 작으면 BER가 악화되며, 실제 착용 환경의 channel variation에 대한 충분한 margin이 필요하다.

## 11.5 계측 장비의 추가 coupling

BS와 SN 양쪽에 oscilloscope와 wiring을 연결한 system validation은 equipment-induced capacitive coupling으로 실제 path loss보다 낙관적인 결과를 보일 수 있다고 저자들이 직접 인정한다.

## 11.6 Human validation 범위 부족

논문 본문에서 피험자 수, 체형·성별·피부상태 다양성, 반복 측정 분산이 충분히 제시되지 않는다. On-body electrical proof-of-concept이지 일반화 가능한 인체 channel study는 아니다.

## 11.7 의료 생체신호의 동시 측정은 검증하지 않음

이 논문은 전력·통신 concurrency를 검증했지만, mV 수준 ECG AFE나 EEG AFE를 동시에 연결해 생체신호 morphology가 유지되는지는 보여주지 않았다.

---

## 12. 2021 BCP·2026 SkinECG와의 연결

## 12.1 2021 → 2024

2021 단계의 질문:

> 인체를 전신 전력 전달 채널로 쓸 수 있는가?

2024 단계의 질문:

> 그 전력 채널을 끊지 않으면서 명령과 센서 데이터까지 동시에 주고받을 수 있는가?

## 12.2 2024 → 2026

SkinECG의 핵심은 분산 에너지 수확 위치와 가슴 ECG sensing 위치의 location mismatch 해결이다. 2024년 회로는 그 네트워크에서 다음 기능을 제공할 가능성이 있다.

- Power를 계속 공급하며 uplink data 전송
- Hub에서 downlink command 제공
- 강한 power carrier와 약한 data uplink의 분리
- 필요할 때 전송량을 늘리는 adaptive data mode의 기반

> **주의**
> 2026 SkinECG가 이 2024 ASIC을 그대로 사용했다고 단정할 수 없다. 연결은 **회로 부품의 직접 계승**이 아니라 **연구 질문과 네트워크 기능의 계승**으로 이해하는 것이 안전하다.

---

## 13. 후속 연구 가설: Event-Triggered Full-Waveform SkinECG

## 13.1 아이디어 수정 기록

초기 오해:

```text
Power를 burst로 받아두고 power-off window에서 ECG 측정
```

최종 아이디어:

```text
ECG sensing은 지속
평상시 QRST/R-R 기반 초저전력 감시
Raw ECG는 ADC + circular buffer에 최근 구간 저장
위험신호 또는 외부 요청 발생
→ 저장된 full ECG waveform을 짧은 data burst로 전송
```

즉 **power burst가 아니라 event-triggered waveform burst**다.

## 13.2 제안 구조

```text
[가슴 SkinECG node]

ECG electrode pair
→ analog front-end
→ 두 병렬 경로

경로 A: QRST/R-peak extractor
→ 평상시 초저전력 감시·짧은 event report

경로 B: ADC
→ circular buffer
→ 최근 10–30초 full waveform 저장

위험 trigger
→ buffer freeze
→ BCC full-waveform burst
```

## 13.3 예비 데이터율 계산 — 논문 외 설계 가정

가정:

- Single-lead ECG
- 250 sample/s
- 12 bit/sample
- Packet·coding overhead 50%

\[
250\times12\times1.5
=
4500\;bit/s
=
4.5\;kb/s
\]

이는 본 논문의 100 kb/s uplink보다 작으므로, **대역폭 오더상 full-waveform burst는 가능권**에 있다.

### 데이터량

| 파형 길이 | Raw data | 50% overhead 포함 |
|---|---:|---:|
| 10초 | 30 kbit = 3.75 kB | 45 kbit = 5.625 kB |
| 30초 | 90 kbit = 11.25 kB | 135 kbit = 16.875 kB |

16-bit word로 저장하면:

- 10초: 약 5 kB
- 30초: 약 15 kB

따라서 16–32 kB급 circular buffer는 1차 prototype의 후보가 될 수 있다.

> **생성형 AI 인공지능을 활용한 이해(검토필요)**
> 위 계산은 단순 데이터율·메모리 오더 추정이다. 실제 ADC resolution, timestamp, error correction, packet framing, retransmission, compression, memory leakage를 반영하지 않았다.

## 13.4 2024 회로가 답한 부분과 답하지 않은 부분

### 이미 답한 부분

- Power를 받으며 uplink data를 보낼 수 있음
- 한 coupling electrode에서 downlink와 uplink를 공존시킬 수 있음
- Uplink data rate가 single-lead ECG raw rate보다 충분히 클 가능성

### 아직 답하지 않은 부분

- Strong BCP carrier가 ECG AFE를 포화시키지 않는가
- Full-waveform TX 중 ECG morphology가 유지되는가
- ADC와 rolling memory의 always-on power를 감당할 수 있는가
- Event 전후 파형을 얼마나 오래 보존할 것인가
- 운동 중 motion artifact와 실제 arrhythmia를 어떻게 구분할 것인가

## 13.5 에너지 허브 후보 — 후속 검토 항목

운동용 시스템에서는 단일 하베스터보다 hybrid energy hub가 자연스럽다.

- Optimized piezoelectric insole: 보행 중 pulse charging
- Ankle TEG: 체열–외기 온도차 기반 trickle charging
- OPV: 야외 활동 중 비교적 큰 보조전력
- Sweat biofuel cell: 운동·발한 조건의 보조전력
- Triboelectric/textile harvester: 의류 움직임 수확
- Supercapacitor 또는 capacitor bank: event burst용 저장소

이 부분은 본 논문의 검증 결과가 아니라 후속 시스템 가설이다. 실제 순저장전력, 착화감, 압력 분산, TEG \(\Delta T\), 다중 입력 PMIC 효율을 별도 실험해야 한다.

---

## 14. 구현 관점 메모

## 14.1 가장 먼저 만들 수 있는 검증 단계

1. ECG simulator를 이용한 analog front-end + circular buffer 구현
2. 250 Hz, 12/16-bit 기준 10–30초 저장
3. 1 MHz OOK 또는 동등한 body-channel uplink로 waveform burst
4. Power carrier on/off 조건에서 AFE saturation·recovery·morphology 비교
5. Piezo/TEG 대신 programmable power source로 energy budget 검증
6. 이후 실제 harvesting source 연결

## 14.2 성공 기준 예시

- Power carrier on 상태에서 ECG amplitude·interval distortion 허용범위 설정
- Event 전 10–20초, 후 10초 waveform 보존
- Burst transmission completion rate
- ADC + memory + TX의 measured energy
- 30–120 cm body path에서 BER
- Motion condition별 signal quality index

---

## 15. 물 비유로 다시 이해하기

| 전기 개념 | 물 비유 |
|---|---|
| 전압 | 수압·수위차 |
| 전류 | 시간당 흐르는 물의 양 |
| 전하 | 물의 양 |
| Capacitor | 물통 |
| MOSFET | 전압으로 여닫는 수도 밸브 |
| Impedance | 특정 주파수 물결이 지나가기 어려운 정도 |
| Ground | 각 방의 기준 바닥 |
| Band-stop filter | 특정 주파수 물결만 막는 방파제 |
| SI cancellation | 펌프 소음의 반대 물결을 내부에서 더해 제거 |
| Ground separation | 취수장·방류장의 배수 바닥 분리 |
| Cross-ground converter | 중간 물통을 이용한 갑문 |
| Charge recycling | 버릴 물을 보조 물통에 받아 재사용 |
| Tri-state high-Z | 수도꼭지를 닫는 것을 넘어 배관 자체를 끊은 상태 |

> **민성식 전체 요약**
> 몸이라는 수도관 하나로 BS가 전력과 명령을 내려보내고 SN이 데이터를 올려보낸다. BS는 역파형으로 자기 펌프 소음을 지우고, 1 MHz 방파제로 작은 대답이 송신기 쪽으로 새는 것을 막는다. SN은 취수장과 방류장의 바닥을 분리하고, 세 물통 갑문으로 분리된 TX 방에 전력을 넘긴다. 고전압 펌프는 버리던 물을 회수해 다음 파동을 만드는 데 다시 쓴다.

---

## 16. 생성형 AI 인공지능을 활용한 학습 및 검토 기록

## 16.1 논문을 읽으며 제기한 질문

### Q1. Fig. 2는 결국 기존에는 전극을 여러 개 쓰고, 이 논문은 하나로 줄였다는 뜻인가?

일부 기존 연구는 하나의 전극을 시간분할로 공유했고, 일부는 경로별 전극 또는 분리된 장치를 사용했다. Fig. 2의 공통점은 **완전한 단일전극 동시동작이 아니었다**는 것이다.

### Q2. SkinECG의 10 cm 두 부분도 sensor node 두 개인가?

아니다. 약 10 cm 떨어진 것은 ECG differential sensing을 위한 두 측정 지점이다. 본 논문의 single electrode는 BCP/BCC interface electrode를 뜻한다.

### Q3. Band-stop filter가 작은 uplink를 없애는 것 아닌가?

아니다. Filter는 data RX 앞에서 uplink를 제거하는 것이 아니라, uplink가 low-impedance TX/RX power path로 새는 경로에 높은 임피던스를 만든다.

### Q4. Reverse waveform이 작은 센서 응답까지 지우지 않는가?

Replica는 BS 자신이 만든 downlink만 복제한다. 센서의 미지 uplink는 replica에 없으며 주파수도 다르므로 직접 상쇄 대상이 아니다. 다만 residual interference와 noise 때문에 작은 uplink의 BER는 악화될 수 있다.

### Q5. Variable capacitor가 어떻게 reverse waveform을 맞추는가?

반대 위상은 replica driver가 만들고, capacitor bank는 replica의 slew rate를 조절한다. 상쇄 후 남은 positive/negative peak를 feedback으로 보고 capacitor를 증감한다.

### Q6. CR-HV는 무엇인가?

Charge-Replenishing High-Voltage driver. 실제 외부 전원을 소비해 10/40 MHz 고전압 power·command waveform을 만들되, intermediate-node charge를 회수·재사용해 전력소비와 crowbar current를 줄인다.

### Q7. CMOS·MOSFET·NMOS·PMOS는 무엇인가?

- MOSFET: Gate voltage로 Source–Drain path를 제어하는 transistor
- NMOS: Gate가 Source보다 높을 때 켜지는 쪽
- PMOS: Gate가 Source보다 낮을 때 켜지는 쪽
- CMOS: NMOS와 PMOS를 함께 쓰는 회로 방식

### Q8. Capacitor에 왜 전하가 남는가?

전압을 올리면 capacitor 양단에 전하가 분리되고 전기장 에너지로 저장된다. 전압을 내리려면 전하를 다른 곳으로 이동시켜야 한다. 일반 회로는 GND로 버리지만 CR-HV는 intermediate capacitor에 옮겨 재사용한다.

### Q9. \(\Phi_3\)는 어떻게 읽는가?

Greek letter phi를 사용하므로 \(\Phi_{3EN}\)은 “파이 쓰리 이엔”이라고 읽는다. 기능적으로는 phase-3 enable signal이다.

### Q10. ECG full waveform 전송에 이 논문을 사용할 수 있는가?

전력과 data uplink의 동시성 및 데이터율 관점에서는 가능성을 뒷받침한다. 그러나 ECG AFE quality, continuous ADC·memory power, motion artifact는 별도 검증이 필요하다.

---

## 16.2 생성형 AI 인공지능을 활용한 이해(검토필요)

### 설명 1 — Self-interference cancellation

BS 내부에서 actual output signal과 반대 위상의 replica를 수신단 앞에서 합산한다. Cancellation residual의 부호를 이용해 replica loading capacitor를 조절하는 closed-loop adaptive cancellation으로 이해하였다.

**검토가 필요한 부분**
- \(C_{\mathrm{SI-C}}\) tuning step·resolution
- convergence time
- PVT variation과 motion에 대한 adaptation bandwidth
- 실제 electrode motion 중 tracking 성능

### 설명 2 — Ground-domain converter

GNDITM은 단순 timing state가 아니라 intermediate voltage-reference domain이다. Flying capacitor가 GNDRX와 GNDTX에 번갈아 연결되며, dead time으로 두 domain이 동시에 연결되지 않게 한다.

**검토가 필요한 부분**
- exact switch polarity와 PMOS/NMOS active level
- charge transfer loss 모델
- parasitic diode가 ground potential을 제한하는 세부 메커니즘

### 설명 3 — Event-triggered waveform burst

2024년의 100 kb/s uplink가 250 Hz·12-bit single-lead ECG의 단순 4.5 kb/s transmission estimate보다 크므로 bandwidth는 가능권으로 추정하였다.

**검토가 필요한 부분**
- 실제 encoder·FEC·packet overhead
- ADC·memory always-on power
- BCP carrier coupling to ECG AFE
- event trigger의 false positive/negative
- full waveform의 임상적 최소 duration

---

## 17. 공부 메모: 내 이해가 바뀐 지점

1. “Single electrode”는 ECG 전극 수가 아니라 **power/data interface 공유** 문제다.
2. 주파수를 다르게 쓰는 것만으로는 충분하지 않다. 강한 8.4 Vpp downlink가 front-end를 포화시키기 전에 analog cancellation이 필요하다.
3. Band-stop filter는 신호를 없애는 장치라기보다, **원하지 않는 도주 경로의 임피던스를 높이는 장치**다.
4. Ground는 단순히 “0 V”가 아니라 각 회로가 전압을 해석하는 기준이다.
5. Ground를 분리하면 data signal과 power도 domain 사이를 번역·전달해야 한다.
6. Capacitor는 파형을 단순히 저장하는 부품이 아니라, slew rate·energy recycling·switched-capacitor power transfer까지 여러 기능을 수행한다.
7. 회로 논문은 “성공했다”는 결과보다, **어떤 failure path를 어떤 block이 제거했는가**를 읽어야 한다.
8. 논문의 진짜 의미는 body channel 통신 그 자체가 아니라, **강한 powering과 약한 sensing data가 공존하는 infrastructure**다.

---

## 18. 유담 교수님께 확인할 질문

1. Adaptive SI-C가 실제 wearable motion에서 변하는 \(C_{\mathrm{ENV}}\)를 추적하기에 충분한 adaptation speed를 갖는가?
2. 2024 architecture를 SkinECG에 적용할 때, strong BCP carrier가 ECG analog front-end를 포화시키지 않도록 어떤 isolation·filtering이 추가로 필요한가?
3. 평상시 QRST/R-R 초저전력 모드와 event-triggered full-waveform mode를 함께 구현한다면, ADC·rolling SRAM의 always-on power가 실제 bottleneck이 되는가?
4. 100 kb/s uplink를 full ECG waveform burst에 사용할 경우, SN의 18 µW data TX와 120 cm에서 회수되는 12.5 µW 사이의 power mismatch를 어떻게 설계해야 하는가?
5. SkinECG의 data hub를 발목/깔창 energy hub와 통합하는 구조가 body-channel return path와 electrode placement 관점에서 가능한가?
6. Single-electrode concurrency를 dry electrode·textile electrode 환경으로 옮길 때 가장 먼저 무너질 가능성이 큰 block은 SI-C, band-stop matching, rectifier 중 무엇인가?
7. Off-chip LC를 줄이기 위한 integrated or active filtering이 power·area 측면에서 타당한가?
8. Event-triggered waveform burst의 첫 검증은 실제 ECG보다 ECG simulator + programmable body-channel emulator에서 시작하는 것이 적절한가?

---

## 19. 논문에서 바로 가져갈 수 있는 연구 논리

### 문제

Body-coupled powering과 communication을 같은 interface에서 합치면 strong TX interference, leakage, backflow가 발생한다.

### 해결

- BS: adaptive analog SI cancellation + band-stop filter
- SN: ground-domain separation + band-stop filter + tri-state buffer
- Cross-domain power: intermediate-domain switched-capacitor converter
- HV efficiency: charge recycling/replenishing

### 검증

- 40-nm CMOS BS·SN ASIC
- 8.4 Vpp downlink
- 100 kb/s concurrent uplink
- 120 cm on-body path
- Uplink 송신 중 12.5 µW power recovery
- Cross-ground conversion 89.1%
- SI suppression 약 40 dB

### 한계

Wet electrode, off-chip LC, limited BER margin, equipment coupling, non-clinical validation.

---

## 20. 최종 평가

> **최종 판단**
> 이 논문은 body-coupled powering과 communication을 단순히 한 시스템에 넣은 것이 아니라, **한 coupling electrode와 동일 인체 채널에서 전력·명령·센서 데이터가 동시에 흐르도록 만든 회로적 기반기술**을 제시했다. 핵심은 주파수 분리만이 아니라, BS의 adaptive analog cancellation과 SN의 ground-domain isolation을 함께 사용한 것이다.

> **후속 연구의 핵심**
> 2026 SkinECG가 평상시 QRST/R-R 기반 초저전력 감시를 유지하면서, 최근 ECG를 circular buffer에 저장하고 이상 시 full waveform을 burst 전송하도록 확장할 수 있는가? 본 논문은 power/data concurrency와 uplink capacity의 가능성을 지지하지만, ECG AFE 간섭과 always-on ADC·memory power는 아직 열린 문제다.

---

## 21. 관련 리뷰

- [몸을 전력이 흐르는 매질로 바꾸기]({{ '/reviews/body-coupled-power/' | relative_url }})
- [배터리 없이 피부 위에서 ECG를 읽는 방법]({{ '/reviews/skinecg/' | relative_url }})
- Body-Coupled Communication
- Self-Interference Cancellation
- Switched-Capacitor Converter
- ECG Analog Front-End와 Circular Buffer

---

## 22. 전체 질문 요약

1. Fig. 2의 기존 방식은 모두 전극 두 개를 썼는가?
2. SkinECG의 10 cm 구조는 센서 노드 두 개인가, ECG 전극 두 개인가?
3. ECG를 물리적 전극 하나로 측정할 수 있는가?
4. Band-stop filter는 정확히 어떤 경로를 막는가?
5. Reverse waveform cancellation이 작은 uplink까지 지우지 않는 이유는 무엇인가?
6. 주파수 분리가 왜 중요한가?
7. CR-HV는 무엇이며 실제 에너지를 어떻게 waveform으로 만드는가?
8. Variable capacitor가 어떻게 replica의 slew rate를 맞추는가?
9. Feedback은 \(C_{\mathrm{ENV}}\)를 직접 측정하는가, residual을 보는가?
10. CMOS, MOSFET, NMOS, PMOS, PN junction, Source, Drain은 무엇인가?
11. 왜 high-voltage switch에 MOSFET을 네 개 stacking하는가?
12. Capacitor에는 왜 전하가 남으며 charge recycling이 어떤 이점을 주는가?
13. 본 논문의 전력·통신 구조로 SkinECG full waveform을 보낼 수 있는가?
14. 평상시 QRST 감시와 continuous raw ECG buffering을 병렬로 구현할 수 있는가?
15. Full waveform을 저장하려면 ADC와 memory를 어떻게 추가해야 하는가?
16. 발목·깔창 energy hub는 waveform burst의 에너지원을 제공할 수 있는가?
17. 이 구조에서 실제 bottleneck은 대역폭, 전력, ECG AFE 간섭, motion artifact 중 무엇인가?
