# 🌍 GeoPulse - Real-time Global Intelligence Platform

> **Advanced geospatial intelligence platform for monitoring global events, geopolitical trends, and real-time location data with AI-powered insights**

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Use Cases](#use-cases)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Architecture](#architecture)
- [AI Intelligence Pipeline](#ai-intelligence-pipeline)
- [Real-time Features](#real-time-features)
- [API Endpoints](#api-endpoints)
- [Configuration](#configuration)
- [Security](#security)
- [Performance & Caching](#performance--caching)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)
- [Support](#support)

---

## 🌍 Overview

**GeoPulse** is a comprehensive geopolitical intelligence dashboard that combines real-time location tracking, AI-powered geospatial analysis, and interactive visualization. It enables organizations to monitor global events, track geopolitical developments, aggregate news from multiple sources, and gain actionable intelligence with an intuitive, responsive interface.

Whether you're tracking international events, monitoring geopolitical risks, aggregating news streams, or analyzing global trends, GeoPulse provides the tools and insights needed for informed decision-making.

### Core Capabilities

- **Real-time Global Monitoring**: Track events and developments as they unfold across the globe
- **Intelligent News Aggregation**: Collect and analyze news from multiple sources with AI-powered categorization
- **Geopolitical Analysis**: Advanced AI analysis to identify trends, risks, and patterns
- **Interactive Visualization**: Dynamic maps and 3D globe views for intuitive data exploration
- **Location Intelligence**: Geospatial data processing and analysis
- **Threat Assessment**: Identify and evaluate emerging risks and developments
- **Custom Alerts**: Real-time notifications for events matching specified criteria

---

## ✨ Features

### Intelligence & Analysis
- 🎯 **Real-time Event Tracking**: Monitor global incidents and developments with live updates
- 📰 **AI-Powered News Aggregation**: Automatically collect and categorize news from multiple sources
- 🧠 **Intelligent Analysis**: Groq and OpenAI integration for geopolitical analysis and pattern recognition
- 📊 **Trend Detection**: Identify emerging trends and interconnections between global events
- 🚨 **Risk Assessment**: Automatic threat level evaluation and risk scoring
- 💡 **Actionable Insights**: AI-generated summaries and recommendations

### Visualization & Mapping
- 🗺️ **Interactive Maps**: Real-time map visualization with Leaflet and React Leaflet for location-based data
- 🌐 **3D Globe Visualization**: Dynamic 3D earth visualization for global perspective with React Globe GL
- 📍 **Location Intelligence**: Geospatial clustering and heatmap analysis
- 🎨 **Custom Layers**: Multi-layer visualization for complex data relationships
- 📈 **Data Visualization**: Comprehensive charts and graphs using Recharts
- 🔗 **Network Graphs**: Force-directed graphs for relationship mapping with D3-force

### Real-time Communication
- ⚡ **WebSocket Support**: Live updates via Socket.IO for instant data synchronization
- 🔔 **Real-time Notifications**: Toast-based alerts for critical events
- 📡 **Collaborative Features**: Multi-user synchronized data viewing
- 💬 **Live Streaming**: Continuous data feeds and updates

### Authentication & Security
- 🔐 **Google OAuth 2.0**: Seamless social authentication
- 🔑 **JWT Authentication**: Secure token-based session management
- 🛡️ **Security Hardening**: Helmet.js for HTTP security headers
- 🔒 **Data Protection**: Encrypted credential storage and transmission
- 👤 **Role-Based Access**: Granular permission controls

### Data Management
- 💾 **MongoDB**: Flexible document storage for complex geopolitical data
- ⚡ **Redis Caching**: High-performance caching layer for instant data retrieval
- 📦 **Data Persistence**: Robust data storage with automatic backups
- 🔄 **Sync Mechanisms**: Seamless data synchronization across clients

### User Experience
- 📱 **Responsive Design**: Works seamlessly across devices (desktop, tablet, mobile)
- ♿ **Accessibility**: Built with Radix UI for WCAG compliance
- 🎨 **Modern UI**: Tailwind CSS for sleek, contemporary design
- 🎬 **Smooth Animations**: Framer Motion for polished user interactions
- 📋 **Form Management**: Robust form handling with React Hook Form and Zod validation

---

## 🎯 Use Cases

### 1. **News Organizations & Media**
- Real-time news aggregation from global sources
- Automated story categorization and tagging
- Geopolitical context and background information
- Multi-source comparison and fact verification

### 2. **Government & Policy Institutions**
- Situational awareness for international developments
- Risk assessment and threat level monitoring
- Policy impact analysis on global events
- Multi-agency information sharing platform

### 3. **Risk Management Firms**
- Geopolitical risk scoring and assessment
- Early warning systems for emerging threats
- Market impact analysis of global events
- Comprehensive event timeline and relationship mapping

### 4. **Financial Institutions**
- Market-moving event detection
- Geopolitical impact on investments
- Risk quantification for portfolio decisions
- Trading signal generation from global intelligence

### 5. **NGOs & Humanitarian Organizations**
- Crisis response coordination
- Real-time situational awareness
- Humanitarian impact assessment
- Aid resource optimization

### 6. **Corporate Security & Risk Teams**
- Enterprise risk monitoring
- Supply chain security
- Employee safety tracking
- Regional stability assessment

### 7. **Academic & Research Institutions**
- Global trend analysis and research
- Geopolitical pattern recognition
- Historical event correlation
- Academic publication sourcing

---

## 🛠️ Tech Stack

### Frontend Technologies
| Category | Technology | Version | Purpose |
|----------|-----------|---------|---------|
| **Core** | React | 19.0.0 | Modern UI framework |
| **Styling** | Tailwind CSS | 3.4.17 | Utility-first CSS framework |
| **UI Components** | Radix UI | 1.x | Accessible, unstyled components |
| **Routing** | React Router DOM | 7.5.1 | Client-side routing |
| **Forms** | React Hook Form + Zod | 7.56.2 + 3.24.4 | Form management & validation |
| **Mapping** | Leaflet + React Leaflet | 1.9.4 + 5.0.0 | Interactive map visualization |
| **3D Visualization** | React Globe GL + Three.js | 2.37.1 + 0.183.2 | 3D globe and graphics |
| **Data Visualization** | Recharts + D3-force | 3.6.0 + 3.0.0 | Charts, graphs, and network viz |
| **Animation** | Framer Motion | 12.38.0 | Smooth animations |
| **HTTP Client** | Axios | 1.8.4 | API communication |
| **Real-time** | Socket.IO Client | 4.8.3 | WebSocket communication |
| **Notifications** | Sonner | 2.0.3 | Toast notifications |
| **UI Utilities** | Lucide React, clsx | - | Icons and class utilities |
| **Build Tool** | Craco | 7.1.0 | Create React App configuration |

### Backend Technologies
| Category | Technology | Version | Purpose |
|----------|-----------|---------|---------|
| **Runtime** | Node.js | 14+ | JavaScript runtime |
| **Framework** | Express | 5.2.1 | Web application framework |
| **Database** | MongoDB + Mongoose | 9.4.1 | Document database & ODM |
| **Cache** | Redis + IORedis | 5.11.0 + 5.10.1 | In-memory caching layer |
| **Real-time** | Socket.IO | 4.6.1 | WebSocket server |
| **Authentication** | Passport + JWT | 0.7.0 + 9.0.3 | Auth middleware |
| **OAuth** | Passport Google OAuth 2.0 | 2.0.0 | Social authentication |
| **AI Services** | Groq SDK + OpenAI | 1.1.2 + 6.34.0 | AI inference & analysis |
| **HTTP Client** | Axios | 1.15.0 | API calls |
| **Security** | Helmet | 8.1.0 | Security headers |
| **CORS** | CORS | 2.8.6 | Cross-origin resource sharing |
| **Task Scheduling** | Node Cron | 4.2.1 | Scheduled background jobs |
| **String Matching** | String Similarity | 4.0.4 | Fuzzy string matching |
| **Parsing** | Cookie Parser | 1.4.7 | Cookie middleware |
| **Logging** | Morgan | 1.10.1 | HTTP request logging |
| **Env Config** | Dotenv | 17.4.2 | Environment variable management |
| **Dev Server** | Nodemon | 3.1.14 | Auto-restart on changes |

---

## 📁 Project Structure

```
GeoPulse/
├── frontend/                          # React-based web application
│   ├── public/                        # Static assets
│   ├── src/
│   │   ├── components/
│   │   │   ├── Map/                   # Map visualization components
│   │   │   ├── Globe/                 # 3D globe components
│   │   │   ├── Dashboard/             # Dashboard layouts
│   │   │   ├── Events/                # Event tracking components
│   │   │   ├── News/                  # News aggregation UI
│   │   │   ├── Analysis/              # Analysis display components
│   │   │   ├── Alerts/                # Alert management UI
│   │   │   └── Common/                # Shared UI components
│   │   ├── pages/
│   │   │   ├── Home.js
│   │   │   ├── Dashboard.js
│   │   │   ├── Intelligence.js
│   │   │   ├── Events.js
│   │   │   ├── Profile.js
│   │   │   └── NotFound.js
│   │   ├── hooks/
│   │   │   ├── useAuth.js
│   │   │   ├── useSocket.js
│   │   │   ├── useLocation.js
│   │   │   └── useIntelligence.js
│   │   ├── utils/
│   │   │   ├── api.js                 # API client configuration
│   │   │   ├── auth.js                # Authentication utilities
│   │   │   └── geospatial.js          # Geospatial calculations
│   │   ├── styles/
│   │   │   └── globals.css
│   │   ├── App.js
│   │   └── index.js
│   ├── .env.example
│   └── package.json
│
├── backend/                           # Node.js/Express server
│   ├── src/
│   │   ├── server.js                  # Application entry point
│   │   ├── config/
│   │   │   ├── database.js            # MongoDB connection
│   │   │   ├── redis.js               # Redis configuration
│   │   │   ├── socket.js              # Socket.IO configuration
│   │   │   └── passport.js            # Authentication strategies
│   │   ├── models/                    # Database schemas
│   │   │   ├── User.js
│   │   │   ├── Event.js
│   │   │   ├── News.js
│   │   │   ├── Alert.js
│   │   │   ├── Location.js
│   │   │   └── Analysis.js
│   │   ├── routes/
│   │   │   ├── auth.js                # Authentication routes
│   │   │   ├── events.js              # Event management
│   │   │   ├── news.js                # News aggregation
│   │   │   ├── analysis.js            # Intelligence analysis
│   │   │   ├── locations.js           # Location tracking
│   │   │   ├── alerts.js              # Alert management
│   │   │   └── intelligence.js        # Intelligence endpoints
│   │   ├── middleware/
│   │   │   ├── auth.js                # JWT verification
│   │   │   ├── errorHandler.js        # Error handling
│   │   │   ├── validation.js          # Input validation
│   │   │   └── rateLimit.js           # Rate limiting
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── eventController.js
│   │   │   ├── newsController.js
│   │   │   ├── analysisController.js
│   │   │   └── locationController.js
│   │   ├── services/
│   │   │   ├── newsAggregation.js     # News gathering & processing
│   │   │   ├── geopoliticalAnalysis.js # AI-powered analysis
│   │   │   ├── eventTracking.js       # Event management logic
│   │   │   ├── alertService.js        # Alert generation
│   │   │   ├── aiIntegration.js       # Groq & OpenAI integration
│   │   │   └── cacheService.js        # Redis caching logic
│   │   ├── utils/
│   │   │   ├── validators.js
│   │   │   ├── constants.js
│   │   │   └── logger.js
│   │   └── tasks/
│   │       ├── newsAggregation.js     # Scheduled news collection
│   │       ├── eventAnalysis.js       # Scheduled analysis tasks
│   │       └── alertCheck.js          # Alert trigger checking
│   │
│   ├── .env.example
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** v14.0.0 or higher ([Download](https://nodejs.org/))
- **npm** v6.0.0 or **yarn** v1.22.0+
- **MongoDB** 4.4+ ([Install](https://docs.mongodb.com/manual/installation/))
- **Redis** 6.0+ ([Install](https://redis.io/download))
- **Git**

### API Keys & Credentials Required

Before running GeoPulse, you'll need to obtain the following credentials:

1. **Google OAuth 2.0**
   - Visit [Google Cloud Console](https://console.cloud.google.com)
   - Create a new project
   - Enable Google+ API
   - Create OAuth 2.0 credentials (Web Application)
   - Save Client ID and Client Secret

2. **OpenAI API Key**
   - Sign up at [OpenAI](https://platform.openai.com)
   - Navigate to API keys section
   - Create and copy your API key

3. **Groq API Key**
   - Sign up at [Groq Console](https://console.groq.com)
   - Create API key for your project

### Installation Steps

#### 1️⃣ Clone the Repository

```bash
git clone https://github.com/Mubashir2611/GeoPulse.git
cd GeoPulse
```

#### 2️⃣ Setup Backend

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/geopulse
MONGODB_COLLECTION_PREFIX=geopulse_

# Cache & Session
REDIS_URL=redis://localhost:6379
REDIS_PORT=6379

# Authentication
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d

# Google OAuth 2.0
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# AI Services
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=mixtral-8x7b-32768

# News Aggregation
NEWS_API_KEY=your_news_api_key_here
NEWS_UPDATE_INTERVAL=3600000

# Socket.IO
SOCKET_CORS=http://localhost:3000

# CORS
CORS_ORIGIN=http://localhost:3000

# Email (Optional - for alerts)
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password

# Logging
LOG_LEVEL=debug

# Rate Limiting
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX_REQUESTS=100
```

#### 3️⃣ Setup Frontend

```bash
cd ../frontend
npm install
```

Create a `.env` file in the `frontend` directory:

```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_SOCKET_URL=http://localhost:5000
REACT_APP_ENVIRONMENT=development
REACT_APP_MAP_TOKEN=your_mapbox_token_optional
REACT_APP_VERSION=1.0.0
```

### Running the Application

#### Start MongoDB (if using local installation)
```bash
mongod
```

#### Start Redis (if using local installation)
```bash
redis-server
```

#### Terminal 1: Start Backend Server
```bash
cd backend
npm run dev
```

Expected output:
```
✓ Backend server running on http://localhost:5000
✓ Connected to MongoDB
✓ Redis cache initialized
✓ Socket.IO server ready
```

#### Terminal 2: Start Frontend Development Server
```bash
cd frontend
npm start
```

Expected output:
```
✓ Frontend running at http://localhost:3000
✓ Compiled successfully
```

### Verify Installation

Visit `http://localhost:3000` in your browser. You should see the GeoPulse dashboard with:
- Interactive map
- 3D globe visualization
- News feed
- Events timeline
- Authentication portal

---

## 🏗️ Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Client Layer (React)                    │
│  ┌──────────────┬──────────────┬──────────────┐             │
│  │ Dashboard    │ Map Viz      │ Intelligence │             │
│  └──────────────┴──────────────┴──────────────┘             │
└────────────────────┬────────────────────────────────────────┘
                     │ HTTP/WebSocket
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                  API Server (Express.js)                    │
│  ┌─────────────┬──────────────┬──────────────┐              │
│  │ Auth Routes │ Event Routes │ News Routes  │              │
│  └─────────────┴──────────────┴──────────────┘              │
│                                                              │
│  ┌──────────────────────────────────────────┐               │
│  │      Middleware Layer                    │               │
│  │  (Auth, Validation, Error Handling)     │               │
│  └──────────────────────────────────────────┘               │
│                                                              │
│  ┌──────────────────────────────────────────┐               │
│  │      Business Logic Layer                │               │
│  │  (Services: News Agg, AI Analysis)      │               │
│  └──────────────��───────────────────────────┘               │
└──────┬──────────────────┬──────────────────┬────────────────┘
       │                  │                  │
       ▼                  ▼                  ▼
   ┌────────┐        ┌────────┐        ┌──────────┐
   │ MongoDB│        │ Redis  │        │AI Services│
   │(Events)│        │(Cache) │        │(Groq, OAI)│
   └────────┘        └────────┘        └──────────┘
```

### Data Flow

1. **User Action** → Frontend captures user interaction
2. **Request** → Sent to backend via HTTP/WebSocket
3. **Authentication** → JWT verification middleware
4. **Processing** → Routes request to appropriate controller
5. **Business Logic** → Services handle core logic
6. **Data Access** → MongoDB for persistence, Redis for caching
7. **AI Processing** → Groq/OpenAI for analysis if needed
8. **Response** → JSON response back to client
9. **Real-time Updates** → Socket.IO broadcasts to connected clients

---

## 🤖 AI Intelligence Pipeline

### News Aggregation & Processing

```
External News Sources
    ↓
NewsAggregation Service
    ├─ Fetch from APIs
    ├─ Parse & Extract
    └─ Normalize Format
    ↓
Content Processing
    ├─ Duplicate Detection (String Similarity)
    ├─ Entity Extraction
    └─ Geographic Tagging
    ↓
AI Analysis (Groq/OpenAI)
    ├─ Categorization
    ├─ Sentiment Analysis
    ├─ Geopolitical Significance
    └─ Risk Scoring
    ↓
MongoDB Storage
    ↓
Cache Layer (Redis)
    ↓
Frontend Display & Analysis
```

### Geopolitical Analysis Engine

```
Raw Data Input
    ├─ News Articles
    ├─ Events
    ├─ Location Data
    └─ User Queries
    ↓
Data Aggregation & Enrichment
    ├─ Historical Context
    ├─ Entity Relationships
    └─ Geographic Context
    ↓
AI Model Processing
    ├─ Groq (Fast Inference)
    │  └─ Trend Detection
    │  └─ Pattern Recognition
    │
    └─ OpenAI (Advanced Analysis)
       └─ Context Synthesis
       └─ Risk Assessment
       └─ Recommendation Generation
    ↓
Intelligence Output
    ├─ Risk Scores (0-100)
    ├─ Trend Summaries
    ├─ Key Insights
    ├─ Geopolitical Impact Analysis
    └─ Recommended Actions
    ↓
Visualization & Alerts
    ├─ Dashboard Updates
    ├─ Real-time Notifications
    └─ Report Generation
```

### Example: News to Intelligence Pipeline

```
News Input:
"Major trade agreement signed between countries"
    ↓
Processing:
├─ Extract: Countries, Date, Type
├─ Classify: Economics, Diplomacy
└─ Locate: Geographic regions
    ↓
AI Analysis:
├─ Groq: Quick pattern matching
│  "Similar events 5 times historically"
└─ OpenAI: Deep analysis
   "Market implications: +2.3% expected"
    ↓
Output:
{
  "event": "Trade Agreement",
  "risk_level": "LOW",
  "economic_impact": "POSITIVE",
  "geopolitical_significance": "MODERATE",
  "summary": "...",
  "recommendations": ["Monitor market movement", "Check regional stability"]
}
```

---

## 🔄 Real-time Features

### WebSocket Events

#### Client → Server Events
```javascript
// Location update
socket.emit('location:update', { lat, lng, timestamp });

// Subscribe to events
socket.emit('events:subscribe', { region: 'Asia', types: ['political'] });

// Set alert preferences
socket.emit('alerts:set', { keywords: ['conflict'], threshold: 0.8 });

// Query intelligence
socket.emit('intelligence:query', { query: 'China relations' });
```

#### Server → Client Events
```javascript
// New event detected
socket.on('event:new', (eventData) => { /* update UI */ });

// Live news update
socket.on('news:update', (newsData) => { /* display news */ });

// Alert triggered
socket.on('alert:triggered', (alertData) => { /* show notification */ });

// Analysis complete
socket.on('analysis:complete', (analysis) => { /* render results */ });

// Location sync
socket.on('location:sync', (locations) => { /* update map */ });
```

### Real-time Synchronization

- **Event Updates**: Instant propagation of new events
- **News Feeds**: Live-streaming of news as it's aggregated
- **Map Data**: Real-time location updates across all clients
- **Alerts**: Immediate notification when conditions are met
- **Analysis Results**: Push updated analysis to subscribed clients
- **Collaborative Features**: Multi-user simultaneous updates

---

## 📡 API Endpoints

### Authentication Endpoints

```
POST   /api/auth/register              Register new user
POST   /api/auth/login                 Login with email/password
POST   /api/auth/logout                Logout current user
POST   /api/auth/refresh               Refresh JWT token
GET    /api/auth/google                Google OAuth redirect
GET    /api/auth/google/callback       Google OAuth callback
GET    /api/auth/verify                Verify current session
GET    /api/auth/profile               Get user profile
PUT    /api/auth/profile               Update user profile
```

### Events Endpoints

```
GET    /api/events                     List all events (paginated)
GET    /api/events/:id                 Get event details
POST   /api/events                     Create new event
PUT    /api/events/:id                 Update event
DELETE /api/events/:id                 Delete event
GET    /api/events/search              Search events
GET    /api/events/region/:region      Get events by region
GET    /api/events/timeline            Get event timeline
GET    /api/events/stats               Get event statistics
```

### News Endpoints

```
GET    /api/news                       List news articles
GET    /api/news/:id                   Get article details
POST   /api/news/search                Search news
GET    /api/news/trending              Get trending news
GET    /api/news/categories/:cat       Get news by category
GET    /api/news/sources               List news sources
POST   /api/news/subscribe             Subscribe to topic
GET    /api/news/feed                  Get personalized feed
```

### Analysis Endpoints

```
POST   /api/analysis/event             Analyze event
POST   /api/analysis/trend             Analyze trend
POST   /api/analysis/risk              Get risk assessment
POST   /api/analysis/compare           Compare entities
GET    /api/analysis/insights          Get key insights
POST   /api/analysis/forecast          Forecast trends
GET    /api/analysis/report            Generate report
```

### Location Endpoints

```
POST   /api/locations/track            Track location
GET    /api/locations/:id              Get location data
GET    /api/locations/regions          Get regional data
GET    /api/locations/heatmap          Get heatmap data
GET    /api/locations/clusters         Get location clusters
```

### Alerts Endpoints

```
GET    /api/alerts                     List user alerts
POST   /api/alerts                     Create alert
PUT    /api/alerts/:id                 Update alert
DELETE /api/alerts/:id                 Delete alert
GET    /api/alerts/active              Get active alerts
GET    /api/alerts/history             Get alert history
POST   /api/alerts/test                Test alert
```

### Intelligence Endpoints

```
POST   /api/intelligence/query         Query intelligence system
GET    /api/intelligence/dashboard     Get intelligence summary
GET    /api/intelligence/topics        Get trending topics
GET    /api/intelligence/relationships Get entity relationships
POST   /api/intelligence/correlate     Find correlations
```

---

## ⚙️ Configuration

### Environment Variables Reference

#### Backend (.env)

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment | `development` |
| `MONGODB_URI` | MongoDB connection | `mongodb://localhost:27017/geopulse` |
| `REDIS_URL` | Redis connection | `redis://localhost:6379` |
| `JWT_SECRET` | JWT signing key | (generate secure key) |
| `GOOGLE_CLIENT_ID` | Google OAuth ID | (from Google Cloud) |
| `OPENAI_API_KEY` | OpenAI API key | (from OpenAI) |
| `GROQ_API_KEY` | Groq API key | (from Groq) |

#### Frontend (.env)

| Variable | Description | Example |
|----------|-------------|---------|
| `REACT_APP_API_URL` | Backend API URL | `http://localhost:5000` |
| `REACT_APP_SOCKET_URL` | Socket.IO server | `http://localhost:5000` |
| `REACT_APP_ENVIRONMENT` | Environment | `development` |

---

## 🛡️ Security

### Implemented Security Measures

#### 1. **Authentication & Authorization**
- ✅ JWT-based session management
- ✅ Google OAuth 2.0 integration
- ✅ Secure password hashing
- ✅ Role-based access control (RBAC)
- ✅ Token expiration and refresh

#### 2. **Network Security**
- ✅ HTTPS/TLS support
- ✅ CORS configuration for frontend
- ✅ Rate limiting on API endpoints
- ✅ DDoS protection measures
- ✅ Security headers via Helmet.js

#### 3. **Data Security**
- ✅ MongoDB connection encryption
- ✅ Redis AUTH requirement
- ✅ Environment variable protection
- ✅ Sensitive data logging prevention
- ✅ Input validation and sanitization

#### 4. **Application Security**
- ✅ XSS (Cross-Site Scripting) prevention
- ✅ CSRF (Cross-Site Request Forgery) protection
- ✅ SQL injection prevention (via MongoDB ODM)
- ✅ Request size limiting
- ✅ HTTP parameter pollution protection

### Security Checklist for Production

```
□ Change all default credentials
□ Set strong JWT_SECRET (min 32 characters)
□ Enable HTTPS/TLS certificates
□ Configure CORS properly
□ Set NODE_ENV=production
□ Enable rate limiting
□ Set up MongoDB authentication
□ Enable Redis AUTH
□ Configure firewall rules
□ Enable API key rotation
□ Set up monitoring and logging
□ Implement backup strategy
□ Enable audit logging
□ Configure security headers
□ Set up Web Application Firewall (WAF)
□ Regular security audits
```

---

## ⚡ Performance & Caching

### Caching Strategy

#### Redis Cache Layers

```
Cache Hierarchy:
1. Session Cache (30 min TTL)
   - User sessions
   - Authentication tokens

2. API Response Cache (5-15 min TTL)
   - Event listings
   - News feeds
   - Analysis results

3. Geographic Cache (30 min TTL)
   - Region data
   - Location clusters
   - Heatmap data

4. AI Model Cache (1 hour TTL)
   - Analysis results
   - Trend calculations
   - Risk scores

5. Static Cache (24 hours TTL)
   - Categories
   - Regions
   - Configurations
```

#### Cache Invalidation

```
On Event Creation/Update:
- Invalidate: event:all, event:region:*, trending:*

On News Update:
- Invalidate: news:feed:*, news:trending, analysis:*

On User Profile Update:
- Invalidate: user:preferences:*, alerts:*
```

### Performance Optimization

- **Database Indexing**: Optimized MongoDB indexes on frequently queried fields
- **Pagination**: Efficient data fetching with cursor-based pagination
- **Lazy Loading**: Load data on demand to reduce initial load
- **CDN Integration**: Serve static assets from CDN
- **Compression**: Gzip compression for HTTP responses
- **Code Splitting**: Frontend bundle optimization
- **Image Optimization**: Lazy load and compress images
- **Query Optimization**: Minimize database queries
- **Connection Pooling**: Reuse database connections

### Monitoring Metrics

```
System Metrics:
- Response time (target: <200ms)
- Cache hit rate (target: >80%)
- Database query time (target: <50ms)
- API throughput (events/sec)
- Memory usage
- CPU usage
- Connection pool stats

Application Metrics:
- Error rate
- User activity
- Event processing time
- AI analysis time
- Real-time message latency
- Cache effectiveness
```

---

## 📦 Build & Deployment

### Production Build

#### Frontend Build
```bash
cd frontend
npm run build
```

Output: `frontend/build/` directory optimized for production

#### Backend Preparation
```bash
cd backend
npm install --production
npm start
```

### Docker Deployment (Optional)

#### Dockerfile for Backend
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY backend/package*.json ./
RUN npm ci --production
COPY backend/src ./src
EXPOSE 5000
CMD ["npm", "start"]
```

#### Docker Compose
```yaml
version: '3.8'
services:
  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - MONGODB_URI=mongodb://mongo:27017/geopulse
      - REDIS_URL=redis://redis:6379
    depends_on:
      - mongo
      - redis
  
  frontend:
    build: ./frontend
    ports:
      - "80:3000"
    environment:
      - REACT_APP_API_URL=http://localhost:5000

  mongo:
    image: mongo:5
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  mongo_data:
```

### Deployment Platforms

#### Recommended Hosting

**Frontend:**
- Vercel
- Netlify
- AWS S3 + CloudFront
- GitHub Pages

**Backend:**
- Railway
- Render
- AWS EC2
- DigitalOcean
- Heroku

**Database:**
- MongoDB Atlas (cloud)
- AWS DocumentDB
- Self-hosted MongoDB

**Cache:**
- Redis Cloud
- AWS ElastiCache
- Self-hosted Redis

### Environment Setup for Production

```env
# Production Backend .env
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/geopulse
REDIS_URL=redis://:password@host:6379
JWT_SECRET=generate_very_secure_key_here_min_32_chars
JWT_EXPIRE=7d
CORS_ORIGIN=https://yourdomain.com
SOCKET_CORS=https://yourdomain.com
```

---

## 🧪 Testing

### Running Tests

#### Frontend Tests
```bash
cd frontend
npm test
```

#### Backend Tests (when implemented)
```bash
cd backend
npm test
```

### Test Coverage

Areas to test:
- Authentication flows
- Event CRUD operations
- News aggregation
- AI analysis accuracy
- Real-time synchronization
- Error handling
- Rate limiting
- Cache functionality

---

## 🤝 Contributing

We welcome contributions from the community! Here's how to contribute:

### Development Workflow

1. **Fork the repository**
   ```bash
   Click "Fork" on GitHub
   ```

2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/GeoPulse.git
   cd GeoPulse
   ```

3. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

4. **Make your changes**
   - Follow existing code style
   - Add comments for complex logic
   - Update relevant documentation

5. **Commit changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```

6. **Push to branch**
   ```bash
   git push origin feature/amazing-feature
   ```

7. **Open Pull Request**
   - Provide clear description
   - Reference related issues
   - Include screenshots if UI changes

### Code Standards

- **JavaScript**: Follow ESLint configuration
- **React**: Use functional components and hooks
- **Node.js**: Use async/await over callbacks
- **Comments**: Document complex logic
- **Variables**: Use meaningful names

### Bug Reports

Include in bug reports:
- Steps to reproduce
- Expected behavior
- Actual behavior
- Error logs/screenshots
- System information

---

## 📄 License

This project is licensed under the **ISC License** - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Mubashir2611**

- GitHub: [@Mubashir2611](https://github.com/Mubashir2611)
- Email: (Contact via GitHub)

---

## 🙏 Acknowledgments

- **React & Node.js Communities** - For incredible frameworks and tools
- **Radix UI** - For accessible, unstyled components
- **Tailwind CSS** - For utility-first CSS framework
- **Leaflet** - For powerful map visualization
- **OpenAI & Groq** - For advanced AI capabilities
- **MongoDB & Redis** - For reliable data storage and caching
- **Socket.IO** - For real-time communication
- **All Contributors** - For helping improve GeoPulse

---

## 📞 Support & Feedback

### Getting Help

1. **GitHub Issues**: [Report bugs or request features](https://github.com/Mubashir2611/GeoPulse/issues)
2. **Documentation**: Check this README and inline code comments
3. **Community**: Engage with other users and contributors

### Feature Requests

Have an idea? [Open a discussion](https://github.com/Mubashir2611/GeoPulse/discussions)

### Security Issues

Please report security vulnerabilities responsibly to: [security contact info to be added]

---

## 🚀 Roadmap

### Planned Features

**Phase 2:**
- [ ] Advanced sentiment analysis
- [ ] Predictive threat modeling
- [ ] Custom report generation
- [ ] API rate limiting dashboard
- [ ] Multi-language support

**Phase 3:**
- [ ] Machine learning models for trend prediction
- [ ] Mobile app (React Native)
- [ ] Advanced data export (PDF, Excel)
- [ ] Integration with external data sources
- [ ] Voice command support

**Phase 4:**
- [ ] Blockchain integration for data verification
- [ ] Advanced collaborative tools
- [ ] Real-time collaboration features
- [ ] Enterprise SSO support
- [ ] Custom theme builder

---

## 📊 Project Stats

- **Languages**: JavaScript (97.3%), HTML (1.4%), CSS (1.3%)
- **Backend**: Node.js + Express
- **Frontend**: React 19
- **Database**: MongoDB + Redis
- **AI Services**: Groq + OpenAI+NVIDIA
- **Status**: Active Development

---

<div align="center">

### ⭐ If you find this project helpful, please consider giving it a star!

**Made with ❤️ by Mubashir2611**

[Report Bug](https://github.com/Mubashir2611/GeoPulse/issues) • [Request Feature](https://github.com/Mubashir2611/GeoPulse/issues) • [View Demo](#)

</div>

---

*Last Updated: May 2026*
*Version: 1.0.0*
