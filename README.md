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
