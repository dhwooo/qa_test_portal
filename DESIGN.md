---
version: alpha
name: Suprema Test Portal
description: Jira의 정보 밀도 + Toss의 부드러운 카드 UI + 애플 타이포그래피를 합친 QA 자동화 플랫폼 디자인 시스템. 뜨는 UI(상단바/모달/로그인)는 유리(glass), 데이터 밀집 영역(카드/리스트)은 솔리드 — 하이브리드 엘리베이션 전략을 쓴다.
colors:
  primary: "#0052CC"
  primary-hover: "#0047B3"
  secondary: "#3182F6"
  secondary-container: "#E8F3FF"
  tertiary: "#00C9A7"
  tertiary-container: "#E3FCF7"
  error: "#F04452"
  error-container: "#FFEEEF"
  warning: "#FF9F1C"
  warning-container: "#FFF6E5"
  surface: "#F9FAFB"
  surface-container: "#FFFFFF"
  surface-container-high: "#F2F4F6"
  on-surface: "#191F28"
  on-surface-variant: "#4E5968"
  outline: "#E5E8EB"
  outline-variant: "#B0B8C1"
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
  sm: 10px
  md: 14px
  lg: 20px
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

Suprema Test Portal은 QA 엔지니어가 매일 들어와서 실행 결과를 확인하는 **엔터프라이즈 SaaS 대시보드**다. "Jira처럼 정보 밀도 있고 신뢰감 있지만, Toss처럼 부드럽고 친근하며, 애플처럼 타이포가 정갈한" 느낌을 목표로 한다.

이전에 "보안 콘솔" 컨셉(다크 테마, 모노스페이스, teal 악센트)을 시도했지만, Suprema가 보안 회사라고 해서 제품 UI까지 보안 장비처럼 보일 필요는 없다는 피드백을 받고 폐기했다. **Test Portal은 QA 툴이지 관제 센터가 아니다** — 밝고 깔끔한 SaaS 톤이 맞다.

톤은 진지하되 차갑지 않게: 색은 절제하고(브랜드 블루 하나), 여백은 넉넉하게, 애니메이션은 화려함보다 담백한 stagger reveal로.

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

8px 기준 그리드. 좌측 고정 사이드바(256px) + 메인 콘텐츠 2단 구조.

- 카드 사이 간격은 16px, 카드 내부 패딩은 22px로 통일.
- 리스트(테스트 실행 결과, 실행 기록)는 전부 검색 + 상태 필터 + 페이지네이션을 갖춘다 — 실제 규모(카테고리 190개, 테스트 1,000+개, 메서드 2,000-3,000개)를 전제로 설계됐다. 스크롤로 다 보여주는 방식은 이 규모에서 쓰지 않는다.
- 상단바에 요약 정보를 박스(칩) 여러 개로 늘어놓지 않는다 — 과거에 "Project / Framework / Mode" 3개 칩을 나열했다가 "UI가 이상하다"는 피드백을 받았다. 요약은 제목 아래 한 줄 텍스트(`·` 구분)로, 상태는 뱃지 하나로.

## Elevation & Depth

**하이브리드 전략**을 쓴다 — 이게 이 디자인 시스템에서 가장 중요한 결정이다.

- **데이터 밀집 영역(통계 카드, 테스트/실행 리스트, 모달 내부 폼)은 솔리드**: 흰 배경 + 부드러운 그림자(`0 1px 2px rgba(25,31,40,.04), 0 4px 14px rgba(25,31,40,.05)`)로 구분한다. 1,000+ 행을 스캔해야 하는 화면에서 반투명 배경은 가독성을 해치므로 여기서는 유리 효과를 쓰지 않는다.
- **떠 있는 UI 크롬(상단바, 모달 backdrop, 로그인 카드가 얹히는 배경)은 유리**: `backdrop-filter: blur(8px)` + `rgba(249,250,251,.82)` 반투명 배경. 사이드바/메인 상단에는 아주 옅은(`opacity` 낮은) radial-gradient 블루 블롭 하나로 깊이감만 준다 — Google Stitch의 `atmospheric-glass` 예제처럼 화려한 그라디언트 배경 전체를 쓰지는 않는다(우리 배경은 대부분 데이터라 시선을 뺏으면 안 된다).
- **호버**: 카드는 `translateY(-2px)` + 그림자 강화 정도로 미세하게. 화려한 인터랙션보다 절제된 반응이 이 톤에 맞는다.

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
중앙 정렬, `backdrop-filter: blur`, `20px` 라운드. 이지선다(Mock/실장비 같은) 선택에는 segmented control을 쓴다.

### 버튼
Primary는 `{colors.primary}` 솔리드 배경 + 흰 텍스트. Ghost/Secondary는 `surface-container-high` 배경. hover는 배경색을 한 단계 진하게(`primary-hover`) + `translateY(-1px)`.

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
