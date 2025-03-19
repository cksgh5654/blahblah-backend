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
### ✅ 인증 (로그인, 회원가입, Oauth, nodemailer)
- [**Google OAuth인가를 활용한 사용자 인증 구현**](https://github.com/DonggunLim/Blahblah_front/wiki/Google-OAuth%EB%A5%BC-%ED%99%9C%EC%9A%A9%ED%95%9C-%EC%82%AC%EC%9A%A9%EC%9E%90-%EC%9D%B8%EC%A6%9D-%EA%B5%AC%ED%98%84)
- [**JWT와 쿠키 기반 로그인 및 API 인증 구현**](https://github.com/DonggunLim/Blahblah_front/wiki/JWT%EC%99%80-%EC%BF%A0%ED%82%A4-%EA%B8%B0%EB%B0%98-%EB%A1%9C%EA%B7%B8%EC%9D%B8-%EB%B0%8F-API-%EC%9D%B8%EC%A6%9D-%EA%B5%AC%ED%98%84)
- [**Nodemailer를 이용한 로컬 회원가입 및 이메일 인증 기능 구현**](https://github.com/DonggunLim/Blahblah_front/wiki/Nodemailer%EB%A5%BC-%EC%9D%B4%EC%9A%A9%ED%95%9C-%EC%9D%B4%EB%A9%94%EC%9D%BC-%EC%9D%B8%EC%A6%9D-%EA%B8%B0%EB%8A%A5-%EA%B5%AC%ED%98%84-%EB%B0%8F--%EC%9D%B4%EB%A9%94%EC%9D%BC-%ED%9A%8C%EC%9B%90%EA%B0%80%EC%9E%85-%EA%B5%AC%ED%98%84)

### ✅ 프로필 페이지 (사용자 정보 조회 수정 기능)
- [사용자 프로필 정보 표시](https://github.com/DonggunLim/Blahblah_front/blob/main/src/pages/ProfilePage.tsx) 
- [프로필 이미지 변경 및 닉네임 수정 기능](https://github.com/DonggunLim/Blahblah_front/blob/main/src/pages/ProfileUpdatePage.tsx)
- 사용자 활동 내역 표시 (게시물 조회, 댓글 조회, 개설한 게시판 조회)
- 직접 개발한 UI 컴포넌트(Tabs, Avatar)로 UI 구성

### ✅ 게시판 기능 [(어드민 대시보드 및 게시판 관리 기능 구현)](https://github.com/DonggunLim/Blahblah_front/wiki/%EC%96%B4%EB%93%9C%EB%AF%BC-%EB%8C%80%EC%8B%9C%EB%B3%B4%EB%93%9C-%EB%B0%8F-%EA%B2%8C%EC%8B%9C%ED%8C%90-%EA%B4%80%EB%A6%AC-%EA%B8%B0%EB%8A%A5-%EA%B5%AC%ED%98%84)
- 어드민 대시보드 페이지: 가입한 모든 유저 관리 기능, 개설된 게시판 관리 기능
- 게시판 관리기능 페이지: 게시판 가입한 사용자 및 게시글 관리, 공지사항 등록
- ProtectedRoute를 활용하여 역할(Role) 기반 접근 제어


## 📌 링크
- **Frontend Repository**: [Blahblah Frontend](https://github.com/DonggunLim/Blahblah_front)
- **Backend Repository**: [Blahblah Backend](https://github.com/DonggunLim/Blahblah_back)
- **Figma**: [Blahblah Figma](https://www.figma.com/design/o7aSugrh85nW04kXW5SFyz/Untitled?node-id=0-1&p=f)
- **WebSite**: [Blahblah](https://blahblah-front.vercel.app)

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

## 📌 ERD
![image](https://github.com/user-attachments/assets/1480918f-492d-4015-a44f-881bed17b689)
