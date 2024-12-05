# Roommate Expense Splitter

A web application built with React and Firebase to help roommates track and split expenses. Features include expense tracking, receipt management, monthly settlements, and expense analytics.

## Features

- 💰 Track individual expenses
- 📊 View spending analytics and trends
- 📷 Upload and manage receipts
- 🌓 Dark/Light mode support
- 🌍 Multilingual support (English/Turkish)
- 📱 Responsive design
- 📅 Monthly expense archiving
- 💳 Automatic settlement calculations
- 📊 Export expense reports to CSV

## Tech Stack

- React 18
- Firebase (Firestore, Storage)
- Tailwind CSS
- Recharts for analytics
- shadcn/ui components
- Vite
- Lucide React icons

## Live Demo

Visit [Roommate Expense Splitter](https://roommate-expense-splitte-31775.web.app)

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Firebase account

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/roommate-expense-splitter.git
cd roommate-expense-splitter
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env` file in the root directory with your Firebase configuration
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

4. Start the development server
```bash
npm run dev
```

### Building for Production

```bash
npm run build
```

### Deployment

Deploy to Firebase Hosting:
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

## Project Structure

```
src/
  ├─ components/
  │   ├─ RoommateExpenses.jsx    # Main expense management component
  │   ├─ ExpenseAnalytics.jsx    # Analytics and charts
  │   ├─ ReceiptManagement.jsx   # Receipt upload and viewing
  │   ├─ LanguageThemeControls.jsx # Language and theme switcher
  │   └─ ui/                     # UI components
  ├─ contexts/
  │   ├─ theme-context.jsx       # Dark/light mode management
  │   └─ language-context.jsx    # Internationalization
  ├─ services/
  │   └─ database.js            # Firebase service methods
  └─ config/
      └─ firebase.js            # Firebase configuration
```

## Features in Detail

### Expense Management
- Add, view, and delete expenses
- Upload receipts for each expense
- View expense details with receipt images

### Analytics
- Monthly spending trends
- Individual roommate spending analysis
- Comparative spending charts

### Settlements
- Automatic calculation of who owes whom
- Monthly settlement summaries
- Export settlement details

### Internationalization
- Support for English and Turkish
- Easy to add more languages
- Persistent language selection

### Theme Support
- Light and dark mode
- System theme detection
- Persistent theme selection

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for the beautiful UI components
- [Recharts](https://recharts.org/) for the analytics charts
- [Firebase](https://firebase.google.com/) for the backend services
- [Tailwind CSS](https://tailwindcss.com/) for styling