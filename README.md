# GearGuard - Intelligent Asset Maintenance System

**GearGuard** is a modern, full-stack SaaS application designed to streamline equipment tracking and maintenance management. It empowers organizations to manage assets, schedule maintenance, and analyze operational efficiency through a unified, responsive interface.

## 🚀 Features

- **Authentication**: Signup and login feature.
- **Equipment Management**:
    - Categorized inventory (Machinery, Computers, Tools).
    - Detailed asset tracking (Location, Status, purchase history).
    - Status monitoring (Active vs Scrapped).
- **Maintenance Operations**:
    - **Kanban Board**: Drag-and-drop workflow management.
    - **Calendar View**: Visual scheduling of preventive and corrective maintenance.
    - **List View**: Detailed history and audit logs.
- **Analytics & Reporting**:
    - Real-time Dashboard with KPI cards.
    - Status distribution and completion ratio charts.
    - Critical issue tracking.
- **Modern UI/UX**:
    - Built with Shadcn/UI and TailwindCSS.
    - Light/Dark mode ready (Corporate Light theme active).
    - Responsive design for all devices.

## 🛠️ Tech Stack

- **Frontend**: React, Vite, TailwindCSS, Shadcn/UI, Recharts, Framer Motion, DnD-Kit.
- **Backend API**: Cloudflare Workers, Hono (Edge-ready performance).
- **Database**: Drizzle ORM with SQLite (Local) / Cloudflare D1 (Production).
- **Authentication**: Custom Auth with JWT & Secure Password Hashing.

## 📦 Installation & Setup

1. **Clone the Repository**
   ```bash
   git clone https://github.com/Devansh-66/GearGuard.git
   cd GearGuard/gearguard
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Initialize Database**
   Generate the SQLite schema and seed initial data:
   ```bash
   npm run db:generate
   npm run db:setup
   # Optional: Seed demo data via dashboard or SQL
   ```

4. **Start Development Servers**
   Run both the Frontend and Backend simultaneously:
   ```bash
   npm run dev:api   # Starts Backend on port 8787
   npm run dev:web   # Starts Frontend (Vite)
   ```

## 📄 License

This project is licensed under the MIT License.

