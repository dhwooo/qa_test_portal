---
version: alpha
name: Suprema Test Portal
description: Jira의 정보 밀도 + Toss의 부드러운 카드 UI + 애플 타이포그래피를 합친 QA 자동화 플랫폼 디자인 시스템. 뜨는 UI(상단바/모달/로그인)는 유리(glass), 데이터 밀집 영역(카드/리스트)은 솔리드 — 하이브리드 엘리베이션 전략을 쓴다.
colors:
  primary: "#0070F3"
  primary-hover: "#0060D1"
  secondary: "#3291FF"
  secondary-container: "#EBF5FF"
  tertiary: "#00B884"
  tertiary-container: "#E6F8F2"
  error: "#EE4444"
  error-container: "#FEEFEF"
  warning: "#F5A623"
  warning-container: "#FFF5E5"
  surface: "#FAFAFA"
  surface-container: "#FFFFFF"
  surface-container-high: "#F2F2F2"
  on-surface: "#171717"
  on-surface-variant: "#525252"
  outline: "#EBEBEB"
  outline-strong: "#D9D9D9"
  outline-variant: "#A3A3A3"
typography:
  headline-lg:
    fontFamily: Pretendard Variable
    fontSize: 21px
    fontWeight: 800
    lineHeight: 1.3
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Pretendard Variable
    fontSize: 16px
    fontWeight: 800
    lineHeight: 1.3
    letterSpacing: -0.02em
  display-stat:
    fontFamily: Pretendard Variable
    fontSize: 28px
    fontWeight: 800
    lineHeight: 1.2
    letterSpacing: -0.02em
  body-md:
    fontFamily: Pretendard Variable
    fontSize: 14px
    fontWeight: 600
    lineHeight: 1.5
    letterSpacing: -0.01em
  body-sm:
    fontFamily: Pretendard Variable
    fontSize: 12.5px
    fontWeight: 500
    lineHeight: 1.5
  label-sm:
    fontFamily: Pretendard Variable
    fontSize: 11.5px
    fontWeight: 700
    letterSpacing: 0.02em
  mono-data:
    fontFamily: SF Mono
    fontSize: 12px
    fontWeight: 500
    lineHeight: 1.65
rounded:
  sm: 8px
  md: 10px
  lg: 12px
  full: 9999px
spacing:
  unit: 8px
  card-padding: 22px
  card-gap: 16px
  sidebar-width: 256px
  content-margin: 36px
components:
  card-solid:
    backgroundColor: "{colors.surface-container}"
    rounded: "{rounded.lg}"
    padding: "{spacing.card-padding}"
  chip-glass:
    backgroundColor: rgba(249, 250, 251, 0.82)
    rounded: "{rounded.full}"
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "#FFFFFF"
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    padding: 11px
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
  pill-status:
    typography: "{typography.label-sm}"
    rounded: "{rounded.full}"
    padding: 5px 10px
  nav-item-active:
    backgroundColor: "{colors.secondary-container}"
    textColor: "{colors.primary}"
    rounded: "{rounded.md}"
---

## Brand & Style

Suprema Test Portal은 QA 엔지니어가 매일 들어와서 실행 결과를 확인하는 **엔터프라이즈 SaaS 대시보드**다. 기준점은 **Vercel/Linear류의 절제된 고급스러움**: 그림자 대신 1px 보더로 구획하고, 타이포 위계는 타이트하게, 색은 최소한으로.

폐기된 방향 두 가지 (되돌아가지 말 것):
1. "보안 콘솔" 컨셉(다크 테마, teal 악센트) — Test Portal은 QA 툴이지 관제 센터가 아니다.
2. Toss식 큰 라운드(20px) + 부드러운 그림자 카드 — "직접 만든 느낌"이라는 피드백을 받고 Vercel식 보더 카드로 전환했다.

톤은 진지하되 차갑지 않게: 색은 절제하고(브랜드 블루 하나 + 검정 primary 버튼), 애니메이션은 화려함보다 담백한 stagger reveal과 미세한 hover 반응으로.

## Colors

팔레트는 Jira 블루(#0052CC)를 유일한 브랜드 색으로 두고, 상태색(pass/fail/warning)은 절대 타협하지 않는 관습색을 쓴다.

- **Primary (#0052CC):** 사이드바 활성 상태, primary 버튼, 링크. 화면당 가장 중요한 액션에만 쓴다.
- **Secondary (#3182F6):** Toss 특유의 부드러운 보조 액센트 — hover, 은은한 배경 블롭.
- **Tertiary (#00C9A7) / Error (#F04452) / Warning (#FF9F1C):** PASS / FAIL / BROKEN·SKIP를 나타내는 상태색. 사람이 즉시 인식하는 관습색이라 절대 바꾸지 않는다.
- **Surface (#F9FAFB):** 캔버스 배경. 그 위에 항상 흰색(`surface-container`) 카드가 올라간다 — 하드 보더 대신 그림자로 구분.

## Typography

한글 우선 폰트로 **Pretendard**(Apple SF Pro와 조화되도록 설계됨)를 쓰고, `-apple-system` 폴백으로 맥에서는 실제 SF Pro가 렌더링되게 한다. 데이터/타임스탬프/테스트 이름 같은 "정확해야 하는" 텍스트는 모노스페이스(`mono-data`)로 분리한다.

- **Headline:** Pretendard 800(Extra Bold), 자간 `-0.02em` — 살짝 조인 자간이 Toss/애플 느낌의 핵심이다.
- **Display stat:** 대시보드 큰 숫자(Pass Rate %, 통계 카드)에 쓰는 가장 굵고 큰 사이즈.
- **Body/Label:** 본문은 600 weight로 살짝 무겁게 잡아 밀도 있는 정보 화면에서도 눌리지 않게 한다.
- Inter, Roboto, Arial 사용 금지 — Pretendard/시스템 폰트 조합에서 벗어나지 않는다.

## Layout

8px 기준 그리드. 좌측 고정 사이드바(240px, 페이지 배경과 같은 색 + 우측 1px 보더) + 메인 콘텐츠 2단 구조.

### 정보 구조 (IA)
- **개요**: 대시보드 (최신 실행 요약 + 실행 추이 + 스위트별 현황 + 테스트 목록)
- **테스트**: 테스트 스위트(카테고리별 타일, 클릭 시 해당 스위트 필터로 점프) · 실행 기록(이력 목록 + 새 실행) · Flaky 관리(예정)
- **연동**: 테스트 케이스(Jira) · 설정(**페이지가 아니라 모달** — 연동 상태를 보여주는 read-only 목록)

### 규칙
- 카드 사이 간격 12px, 카드 내부 패딩 18-20px.
- 대시보드 중단은 2열 그리드(실행 추이 1.4fr | 스위트별 현황 1fr) — 벤토식 영역 구분.
- 리스트(테스트, 실행 기록)는 전부 검색 + 상태 필터 + 페이지네이션 — 실제 규모(카테고리 190개, 테스트 1,000+개) 전제.
- 상단바에 요약 정보를 칩 여러 개로 늘어놓지 않는다 — 요약은 제목 아래 한 줄, 상태는 뱃지 하나. 우측엔 사용자 칩 + 설정 + 로그아웃.

## Elevation & Depth

**보더 우선 + 유리는 크롬에만** — 이게 이 디자인 시스템에서 가장 중요한 결정이다.

- **데이터 영역(카드, 테스트/실행 리스트, 모달 시트)은 1px 보더로 구획**: `border: 1px solid {outline}` + 흰 배경, 기본 그림자 없음. 호버 시에만 보더가 진해지고(`outline-strong`) 아주 옅은 그림자(`0 2px 8px rgba(0,0,0,.05)`)가 생긴다. Vercel 대시보드 방식 — 1,000+ 행을 스캔하는 화면에서 가장 깔끔하다.
- **떠 있는 크롬(상단바, 모달 backdrop)만 유리**: 상단바는 콘텐츠에서 분리된 둥근 플로팅 바(`sticky top:12px`, 인셋 마진, `blur(18px) saturate(1.5)` + 반투명 흰색 + 1px 보더). 모달 backdrop은 `blur(5px)` 검정 반투명.
- **배경 장식 금지**: 사이드바/메인의 그라디언트 블롭은 제거했다. 로그인 게이트 배경의 아주 옅은 radial 두 개만 예외.
- **호버**: 카드는 보더 진해짐 + `translateY(-1px)` 수준으로 미세하게.

## Shapes

- 카드/패널: `20px` 라운드.
- 버튼/입력/작은 칩: `10-14px` 라운드.
- 상태 뱃지/태그: `full`(pill) 라운드.
- 한 화면 안에서 각진 모서리와 완전 pill을 섞어 쓰지 않는다 — 카드류는 20px 계열, 인터랙션 요소는 pill 계열로 일관되게 나눈다.

## Components

### 사이드바 내비게이션
활성 항목은 `secondary-container` 배경의 pill + 흰 아이콘 칩(작은 원형 배경 + shadow)으로 아이콘이 "떠 보이게" 한다.

### 상태 뱃지(pill)
작은 dot + glow ring(`box-shadow: 0 0 0 3px rgba(색상,.2)`) + 텍스트. 색상은 위 상태색 그대로, 절대 커스텀 색을 쓰지 않는다.

### 모달
중앙 정렬, backdrop `blur(5px)`, 시트는 `14px` 라운드 + 1px 보더. ESC/backdrop 클릭으로 닫히고 body 스크롤이 잠긴다(`openModal()` 헬퍼 필수 사용). 이지선다(Mock/실장비)에는 segmented control.

### 토스트
**흰색 카드**(1px 보더 + 그림자) + 타입별 컬러 아이콘(success/error/warning/info) + 닫기 버튼, 우하단 스택. 검정 토스트는 쓰지 않는다(밝은 테마와 이질적이라는 피드백으로 폐기).

### 버튼
Primary 액션은 **검정**(`on-surface`) 배경 + 흰 텍스트(Vercel 방식) — 블루는 활성/선택 상태와 링크에만. Ghost는 흰 배경 + 1px 보더, hover 시 보더 진해짐.

## Do's and Don'ts

- Do: 상태색(pass/fail/warning)은 항상 관습색 그대로 유지한다.
- Do: 리스트류 화면은 반드시 검색/필터/페이지네이션을 갖춘다(대규모 데이터 전제).
- Do: 새 화면은 `dashboard/js/data.js`를 거쳐서만 데이터를 가져온다 — 컴포넌트에서 직접 fetch 금지(ReportPortal 연동 시 이 레이어만 교체하면 되도록).
- Don't: 상단바에 요약 정보를 칩 여러 개로 늘어놓지 않는다 — 한 줄 텍스트 + 뱃지 하나로.
- Don't: 데이터 밀집 리스트/카드에 유리 효과(반투명+blur)를 쓰지 않는다 — 유리는 뜨는 크롬(상단바/모달/로그인)에만.
- Don't: Inter/Roboto/Arial을 쓰지 않는다 — Pretendard/시스템 폰트 조합을 유지한다.
- Don't: 한 화면에 두 가지 이상의 라운드 스케일 언어를 섞지 않는다(카드=20px류, 인터랙션=pill류로 고정).

---

_이 문서는 [Google Stitch의 오픈소스 DESIGN.md 스펙](https://github.com/google-labs-code/design.md)을 따른다(YAML frontmatter 토큰 + 8개 순서 섹션). Claude Code, Cursor 등 이 포맷을 읽는 도구는 이 파일을 컨텍스트로 자동 활용할 수 있다._
