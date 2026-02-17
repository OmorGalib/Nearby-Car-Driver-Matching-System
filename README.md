# Nearby Car & Driver Matching System

A production-ready backend system for finding nearby available drivers within a specified radius.

## Features

- 🚗 Find nearby available drivers using Haversine formula
- 🔐 JWT-based authentication
- 📊 PostgreSQL database with geo-spatial indexing
- 📝 Swagger API documentation
- 🚀 Deployed on Vercel + Neon.tech

## Tech Stack

- Node.js + Express.js
- PostgreSQL + Sequelize ORM
- JWT Authentication
- Swagger/OpenAPI 3.0

## Local Development Setup

### Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### Installation Steps

1. Clone the repository
```bash
git clone https://github.com/yourusername/nearby-driver-matching.git
cd nearby-driver-matching

npm install

# Create PostgreSQL database
createdb nearby_drivers

# Configure environment variables
cp .env.example .env
# Edit .env with your database credentials

# Run database migrations and seed data
npm run seed

# Start development server
npm run dev
