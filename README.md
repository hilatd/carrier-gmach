# 🤱 גמ״ח מנשאים ירושלים — Baby Carrier Gemach Jerusalem

A full-stack web app for managing a community baby carrier lending library (גמ״ח). Built with React, Firebase, Chakra UI, and Cloudinary.

🌐 **Live site:** [https://carrier-gmach.web.app](https://carrier-gmach.web.app)

---

## ✨ Features

### Public Homepage
- Bilingual Hebrew/English with full RTL/LTR support and language toggle
- Hero section with background image and animated overlay
- Multi-step request form with inline validation, Israeli phone normalization (+972), and mobile-optimized keyboards
- Automatic confirmation email sent to parent on submission (EmailJS)
- Carrier catalog — visual guide to all carrier types with pros/cons in both languages
- About Us section — active volunteers shown with circular photos and expandable personal bio
- Terms & conditions page (content managed via Firestore)
- Dark mode support
- Heebo font (optimized for Hebrew + Latin)

### Volunteer Dashboard
- Google Authentication — only registered volunteers (matched by lowercase email) can access
- Mobile-first design with bottom navigation bar on mobile, horizontal tabs on desktop
- Edit forms open as a **bottom drawer** (mobile sheet pattern) for easy thumb access

#### Requests Tab
- Cards with client name, phone (tappable `tel:` link), baby info, carrier preference, status badge
- Unhandled-only checkbox (default on) to focus on open work
- WhatsApp button with pre-filled Hebrew message including volunteer name and client name
- Mark as handled button
- Search, filter by status / client / handled-by, sort by date

#### Actions Tab
- Manage active and past lending actions with return dates and payment status
- Searchable combobox dropdowns for client and carrier selection in edit form
- Filter by status / client / taken-from volunteer / paid
- Search across all fields

#### Carriers Tab
- Full carrier inventory with type, brand, model, color, state
- Inline current loan status and client name per carrier
- History drawer showing all past actions per carrier
- Soft delete (sets `deletedAt` timestamp, cascades to related actions)
- Filter by type / state / brand / volunteer / availability

#### Clients Tab
- Search across name, phone, email, address
- Tappable phone numbers (`tel:` link) to call directly from mobile

#### Volunteers Tab
- Profile photo upload via Cloudinary
- Personal bio with expandable "read more" on the homepage
- Active / inactive toggle (inactive volunteers hidden from homepage)
- Search across all fields

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + TypeScript + Vite |
| UI | Chakra UI v2 (dark mode + RTL) |
| Font | Heebo (Google Fonts) |
| i18n | react-intl (Hebrew + English) |
| Database | Firebase Firestore |
| Auth | Firebase Authentication (Google) |
| Image hosting | Cloudinary (free tier) |
| Email | EmailJS |
| Hosting | Firebase Hosting |
| CI/CD | GitHub Actions |

---

## 📁 Project Structure

```
src/
├── components/
│   ├── carriers/
│   │   └── CarrierActionInfo.tsx     # Inline loan status + history drawer
│   ├── search/
│   │   ├── SearchBar.tsx
│   │   ├── FilterDrawer.tsx
│   │   ├── FilterSelect.tsx
│   │   ├── FilterRadioButton.tsx
│   │   ├── SearchableSelect.tsx      # Searchable combobox dropdown
│   │   ├── SortControl.tsx
│   │   └── ResultsCount.tsx
│   ├── tabs/
│   │   ├── RequestsTab.tsx
│   │   ├── ActionsTab.tsx
│   │   ├── CarriersTab.tsx
│   │   ├── ClientsTab.tsx
│   │   └── VolunteersTab.tsx
│   ├── AboutUs.tsx                   # Volunteer cards on homepage
│   ├── CarrierCatalog.tsx            # Carrier type guide on homepage
│   ├── EditModal.tsx                 # Bottom drawer (mobile sheet)
│   ├── ImageUpload.tsx               # Cloudinary image upload widget
│   └── Navbar.tsx
├── hooks/
│   ├── useAuthState.ts
│   ├── useCollection.ts              # Firestore real-time listener (filters deletedAt)
│   ├── useCurrentVolunteer.ts
│   └── useFilterSort.ts              # Generic search + filter + sort hook
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
│   ├── deleteCarrier.ts              # Soft delete carrier + cascade to actions
│   ├── uploadImage.ts                # Cloudinary upload helper
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
| `legal` | Terms & conditions text per language (`he`, `en`) |

All collections use **soft delete** — records are never removed, just marked with `deletedAt: timestamp`.

### Firestore Indexes

A `firestore.indexes.json` is included. All collections need a composite index on:

| Field | Order |
|---|---|
| `deletedAt` | Ascending |
| `createdAt` | Descending |

Deploy indexes with:
```bash
firebase deploy --only firestore
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Firebase project (Firestore + Google Auth enabled)
- EmailJS account
- Cloudinary account (free tier is sufficient)

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
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

### Cloudinary Setup
1. Sign up at [cloudinary.com](https://cloudinary.com)
2. Go to Settings → Upload → Upload Presets → Add preset
3. Set signing mode to **Unsigned**
4. Set folder to `volunteers`
5. Copy the preset name into `VITE_CLOUDINARY_UPLOAD_PRESET`

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

Only volunteers registered in the `volunteers` Firestore collection can access the dashboard. Email matching is **case-insensitive** — all emails are stored and queried in lowercase.

To add a volunteer, use the Volunteers tab in the dashboard, or manually add a Firestore document:
```
name:      "Volunteer Name"
email:     "volunteer@gmail.com"   ← must be lowercase
phone:     "972521234567"
address:   ""
bio:       ""
imageUrl:  ""
isActive:  true
deletedAt: null
createdAt: <timestamp>
updatedAt: <timestamp>
```

---

## 🚢 Deployment

Deployment is automated via GitHub Actions on every push to `main`. Both hosting and Firestore indexes/rules are deployed automatically.

### Required GitHub Secrets

| Secret | Description |
|---|---|
| `FIREBASE_SERVICE_ACCOUNT` | Firebase service account JSON |
| `VITE_EMAILJS_SERVICE_ID` | EmailJS service ID |
| `VITE_EMAILJS_TEMPLATE_ID` | EmailJS template ID |
| `VITE_EMAILJS_PUBLIC_KEY` | EmailJS public key |
| `VITE_CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `VITE_CLOUDINARY_UPLOAD_PRESET` | Cloudinary unsigned upload preset |

### Manual deploy
```bash
npm run build
firebase deploy
```

---

## 📱 Mobile-First Design

- Bottom navigation bar (like WhatsApp/Instagram)
- Edit forms open as bottom drawer sheet — save button always reachable by thumb
- Multi-step request form — one topic per screen, no long scroll
- Tappable phone numbers open the dialer directly
- WhatsApp deep links with pre-filled Hebrew messages (emojis preserved)
- Filter drawer slides up from bottom
- Expandable volunteer bios in About Us section
- Responsive card grid: 1 col mobile → 3 col desktop

---
## 📄 License
[CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/) — free to use and adapt for non-commercial purposes with attribution.

## 💜 Built with love for the Jerusalem babywearing community