# Raymin Notes

개인 이력서와 논문 리뷰를 함께 제공하는 GitHub Pages 사이트입니다. GitHub Pages의 Jekyll 빌드를 사용하므로 별도의 프런트엔드 빌드 도구 없이 Markdown을 게시할 수 있습니다.

## Obsidian 논문 리뷰 게시 방법

1. Obsidian에서 원본 노트를 계속 작성합니다.
2. 공개할 준비가 된 파일을 `_reviews` 폴더로 복사합니다.
3. 파일 맨 위에 아래 front matter를 추가합니다.

```yaml
---
title: 화면에 표시할 리뷰 제목
paper_title: 논문 원제
topic: Sign Language 또는 Wearable Bioelectronics
year: 2026
summary: 목록과 글 상단에 표시할 한두 문장 요약
reading_time: 10
order: 5
tags:
  - 첫 번째 태그
  - 두 번째 태그
---
```

파일명은 URL이 되므로 `lowercase-kebab-case.md` 형식을 권장합니다. Obsidian의 `[[위키 링크]]`와 `![[이미지 임베드]]`는 기본 Jekyll에서 변환되지 않으므로 일반 Markdown 링크와 이미지 문법을 사용하세요.

현재 리뷰 파일은 제공받은 Obsidian 노트의 복사본입니다. 원본 Obsidian 파일은 수정하지 않습니다.

## Research 페이지 관리

`/research/` 페이지는 개별 게임의 공략 목록이 아니라 **기만·정보·믿음**을 연결하는 연구 프로그램으로 구성되어 있습니다. 핵심 질문은 사람들이 ‘운’, ‘감’, ‘기세’라고 부르는 판단을 우연성, 사적정보, 전략적 무작위화, 신호, Bayesian 믿음 갱신과 집단행동으로 얼마나 분해할 수 있는가입니다.

연구 내용은 `_data/research.yml`에서 관리합니다.

- `featured`: 인디언 포커, 다빈치코드, 클래식 마피아 등 공개 연구와 보고서
- `arc`: 기만의 빈도 → 정보노출 → 집단의 믿음 → 사회적 구조로 이어지는 연구 흐름
- `method`: 관찰, 분해, 정식화, 계산, 검증, 확장의 공통 연구 절차
- `scope_note_ko/en`: 각 결과가 말할 수 있는 정확한 범위와 미완료 항목
- `reports`: 공개된 버전별·언어별 보고서 링크

5인 마피아 v8은 20개 제한 고정정책쌍의 유한지평 exact 계산을 완료했지만, 전역 common-belief와 Bayesian Nash equilibrium 폐쇄는 미완료입니다. 아직 공개하지 않은 결과, 검증되지 않은 균형 주장이나 실제 사회현상에 대한 적용을 완료된 사실처럼 추가하지 않습니다.
