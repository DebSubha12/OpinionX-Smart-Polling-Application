# OpinionX — Smart Polling Application

OpinionX is a full-stack real-time polling application. Anyone can create a poll with multiple options, share it, and let people vote. Results update live with percentage-based bar charts. Built as a two-part project: a **Spring Boot REST API** backend and an **Angular** single-page frontend that consumes it.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Backend Setup](#backend-setup)
- [Frontend Setup](#frontend-setup)
- [API Reference](#api-reference)
- [Data Models](#data-models)
- [How It Works](#how-it-works)
- [Troubleshooting](#troubleshooting)
- [Roadmap](#roadmap)
- [License](#license)

---

## Features

- 🗳️ **Create polls** — ask a question with 2 to 8 custom options
- 📊 **Vote instantly** — single-click voting on any open poll
- 📈 **Live results** — animated bar charts with vote counts and percentages right after voting
- 🎯 **Vote validation** — server-side checks prevent invalid option indexes
- 💾 **Persistent storage** — all polls and vote counts saved in MySQL
- 🎨 **Custom UI theme** — a distinctive "ballot paper" design (serif headings, ink/gold/teal palette, wax-seal "Counted" stamp on voted polls)
- 📱 **Responsive layout** — works on desktop and mobile screens

---

## Tech Stack

### Backend
| Component        | Technology              |
|-------------------|--------------------------|
| Language          | Java 21                  |
| Framework         | Spring Boot 4.1.0        |
| Persistence       | Spring Data JPA + Hibernate |
| Database          | MySQL 8                  |
| Build tool        | Maven (via `mvnw` wrapper) |
| Boilerplate       | Lombok                   |

### Frontend
| Component        | Technology              |
|-------------------|--------------------------|
| Framework         | Angular 18 (standalone components) |
| Language          | TypeScript                |
| HTTP client       | Angular `HttpClient`      |
| Routing           | Angular Router            |
| Forms             | Angular `FormsModule` (ngModel) |
| Styling           | Plain CSS with design tokens (no external UI kit) |

---

## Project Structure
