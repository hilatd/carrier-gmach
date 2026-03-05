# 🤱 גמ״ח מנשאים ירושלים — Baby Carrier Gemach Jerusalem

A full-stack web app for managing a community baby carrier lending library (גמ״ח). Built with React, Firebase, and Chakra UI.

---

## ✨ Features

### Public
- Bilingual Hebrew/English with RTL/LTR support
- Request form for parents to borrow a carrier
- Terms & conditions page (content managed via Firestore)
- Automatic confirmation email sent to parent on submission (EmailJS)
- Dark mode support

### Volunteer Dashboard
- Google Authentication — only registered volunteers can log in
- Mobile-first design with bottom navigation bar on mobile, tabs on desktop
- **Requests tab** — view and manage incoming requests, send WhatsApp message to client
- **Actions tab** — manage active and past loans with return dates, payment status
- **Carriers tab** — full carrier inventory with current loan status, history drawer per carrier
- **Clients tab** — manage client records
- **Volunteers tab** — manage volunteer records
- Search, filter and sort on all tabs
- Real-time updates via Firestore listeners
- Offline support via Firestore IndexedDB persistence

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + TypeScript + Vite |
| UI | Chakra UI v2 (dark mode + RTL) |
| i18n | react-intl (Hebrew + English) |
| Database | Firebase Firestore |
| Auth | Firebase Authentication (Google) |
| Email | EmailJS |
| Hosting | Firebase Hosting |
| CI/CD | GitHub Actions |

---

## 📁 Project Structure

```
src/
├── components/
│   ├── carriers/
│   │   └── CarrierActionInfo.tsx   # Inline current action + history drawer
│   ├── search/
│   │   ├── SearchBar.tsx
│   │   ├── FilterDrawer.tsx
│   │   ├── FilterSelect.tsx
│   │   ├── SortControl.tsx
│   │   └── ResultsCount.tsx
│   ├── tabs/
│   │   ├── RequestsTab.tsx
│   │   ├── ActionsTab.tsx
│   │   ├── CarriersTab.tsx
│   │   ├── ClientsTab.tsx
│   │   └── VolunteersTab.tsx
│   ├── EditModal.tsx
│   └── Navbar.tsx
├── hooks/
│   ├── useAuthState.ts
│   ├── useCollection.ts
│   ├── useCurrentVolunteer.ts
│   └── useFilterSort.ts
├── i18n/
│   ├── context.ts
│   ├── LangProvider.tsx
│   ├── useLang.ts
│   ├── en.ts
│   └── he.ts
├── pages/
│   ├── Home.tsx
│   ├── Dashboard.tsx
│   ├── Legal.tsx
│   └── VolunteerLogin.tsx
├── utils/
│   ├── actionOptions.ts
│   ├── carrierOptions.ts
│   └── sendConfirmationEmail.ts
├── firebase.ts
├── theme.ts
└── types.ts
```

---

## 🗄 Firestore Collections

| Collection | Description |
|---|---|
| `clients` | Parents who submitted requests |
| `volunteers` | Registered volunteers (controls dashboard access) |
| `requests` | Carrier borrow requests from parents |
| `actions` | Active and past lending actions |
| `carriers` | Carrier inventory |
| `carrier_volunteer` | Carrier ↔ volunteer assignments |
| `legal` | Terms & conditions text per language (`he`, `en`) |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Firebase project
- EmailJS account

### Install
```bash
git clone https://github.com/hilatd/carrier-gmach.git
cd carrier-gmach
npm install
```

### Environment Variables
Create a `.env.local` file in the project root:
```
VITE_EMAILJS_SERVICE_ID=service_xxxxxx
VITE_EMAILJS_TEMPLATE_ID=template_xxxxxx
VITE_EMAILJS_PUBLIC_KEY=xxxxxxxxxxxxxx
```

### Run locally
```bash
npm run dev
```

### Build
```bash
npm run build
```

### Format code
```bash
npm run format
```

---

## 🔐 Access Control

Only volunteers registered in the `volunteers` Firestore collection can access the dashboard. To add a volunteer:

1. Go to Firebase Console → Firestore → `volunteers` collection
2. Add a document with:
```
name: "Volunteer Name"
email: "volunteer@gmail.com"
phone: "05x-xxxxxxx"
address: ""
createdAt: <timestamp>
updatedAt: <timestamp>
```

---

## 🚢 Deployment

Deployment is automated via GitHub Actions on every push to `main`.

### Required GitHub Secrets

| Secret | Description |
|---|---|
| `FIREBASE_SERVICE_ACCOUNT` | Firebase service account JSON |
| `VITE_EMAILJS_SERVICE_ID` | EmailJS service ID |
| `VITE_EMAILJS_TEMPLATE_ID` | EmailJS template ID |
| `VITE_EMAILJS_PUBLIC_KEY` | EmailJS public key |

### Manual deploy
```bash
npm run build && firebase deploy --only hosting
```

---

## 📱 Mobile Support

- Bottom navigation bar on mobile (like WhatsApp/Instagram)
- Filter drawer slides up from bottom
- History drawer slides from the side
- Responsive card grid (1 col mobile → 3 col desktop)

---

## 🌐 Live Site

[https://carrier-gmach.web.app](https://carrier-gmach.web.app)

---

## 💜 Built with love for the Jerusalem babywearing community
