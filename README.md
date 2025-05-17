# <img src="https://github.com/user-attachments/assets/3067ce67-7023-4968-b818-43a0e355e4ff" width="28" height="28"> Blahblah

**Blahblah**는 사용자가 직접 원하는 주제로 게시판을 만들고 커뮤니티를 제공해주는 웹 애플리케이션입니다.

## 🚀 기술 스택

### Frontend

- React, TypeScript, Axios, React-Router-Dom

### Backend

- Node.js, Express, MongoDB, JWT, Nodemailer

### DevOps

- GCP, Nginx

## 📌 담당 기능

### [메인페이지](https://blahblah.chanhoportfolio.com)

- IntersectionObserver로 무한 스크롤을 구현해 데이터 로딩 속도를 최적화하고 사용자 경험을 개선
- 카테고리 별 url 분할로 새로고침 시에도 동일한 카테고리 유지

[메인페이지](https://github.com/cksgh5654/blahblah-front/blob/main/src/pages/MainPage.tsx)
[무한스크롤 훅](https://github.com/cksgh5654/blahblah-ui-kit/blob/main/src/hooks/useInfinite.ts)

---

### 헤더 검색창

- 검색결과 미리보기에 디바운스를 사용하여 API 호출을 최적화해 서버 부하를 감소

[헤더](https://github.com/cksgh5654/blahblah-front/blob/main/src/components/Header.tsx)
[디바운스 훅](https://github.com/cksgh5654/blahblah-ui-kit/blob/main/src/hooks/useDebounce.ts)

---

### [검색 결과 페이지](https://blahblah.chanhoportfolio.com/search/%EA%B2%8C%EC%8B%9C%ED%8C%90)

- useParams으로 검색결과에 대한 게시판 데이터 불러오기

[검색 결과 페이지](https://github.com/cksgh5654/blahblah-front/blob/main/src/pages/SearchPage.tsx)

---

### [게시판 상세 페이지](https://blahblah.chanhoportfolio.com/board/NewJeans)

- 페이지네이션으로 게시글을 페이지로 분할하여 데이터 로드

[게시판 상세 페이지](https://github.com/cksgh5654/blahblah-front/blob/main/src/pages/BoardPage.tsx)
[페이지네이션](https://github.com/cksgh5654/blahblah-ui-kit/tree/main/src/components/Pagination)

---

### [게시판 생성 페이지](https://blahblah.chanhoportfolio.com/create-board)

- 게시판 생성 시 사용자 정의 URL을 설정 가능하게 하여 검색 엔진 크롤링 최적화

[게시판 생성 페이지](https://github.com/cksgh5654/blahblah-front/blob/main/src/pages/CreateBoardPage.tsx)

## 📌 링크

- **Frontend Repository**: [Blahblah Frontend](https://github.com/cksgh5654/Blahblah-front)
- **Backend Repository**: [Blahblah Backend](https://github.com/cksgh5654/blahblah-backend)
- **Figma**: [Blahblah Figma](https://www.figma.com/design/o7aSugrh85nW04kXW5SFyz/Untitled?node-id=0-1&p=f)
- **WebSite**: [Blahblah](https://blahblah.chanhoportfolio.com)
- **My Resume**: [My Resume](https://www.chanhoportfolio.com)

## 📌 설치 및 실행 방법

### 프론트엔드 실행

```bash
npm install
npm run dev
```

### 백엔드 실행

```bash
npm install
node index.js
```
