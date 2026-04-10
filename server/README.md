# AgriLink — Express + MongoDB Backend

## Stack
- Node.js / Express 4
- MongoDB / Mongoose 8
- JWT authentication
- Nodemailer (OTP emails)
- Multer (file uploads)
- QRCode (QR generation)
- Axios (FastAPI integration)

## Quick Start

```bash
cd server
npm install
cp .env.example .env   # fill in your values
npm run dev            # nodemon hot-reload
```

Server starts on `http://localhost:5000`.

## Environment Variables

See `.env.example` for all required variables.

| Variable | Description |
|---|---|
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Long random secret for signing tokens |
| `SMTP_*` | SMTP credentials for OTP emails |
| `FASTAPI_URL` | Price prediction microservice URL |
| `APP_URL` | Public base URL (used in QR codes) |
| `ALLOWED_ORIGINS` | Comma-separated CORS origins |

## Folder Structure

```
server/
├── src/
│   ├── config/         # DB connection, mailer
│   ├── controllers/    # Route handlers (thin, delegate to services)
│   ├── middleware/     # auth, role, i18n, error, upload
│   ├── models/         # Mongoose schemas
│   ├── routes/         # Express routers
│   ├── services/       # Business logic (OTP, JWT, price, QR, matching, voice)
│   ├── utils/          # asyncHandler helper
│   ├── locales/        # en / hi / mr JSON message files
│   └── app.js          # Entry point
├── uploads/            # Generated at runtime (images + QR codes)
├── .env.example
├── package.json
└── agrilink.postman_collection.json
```

## API Reference

### Auth
| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | — | Register new user |
| POST | `/api/auth/login` | — | Login with email + password |
| POST | `/api/auth/send-otp` | — | Send OTP to email |
| POST | `/api/auth/verify-otp` | — | Verify OTP → returns JWT |
| GET | `/api/auth/me` | ✓ | Get current user |

### Produce
| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/api/produce` | — | All available listings |
| GET | `/api/produce/my` | farmer | My listings |
| GET | `/api/produce/offline-cache` | — | Lightweight cache for offline |
| GET | `/api/produce/:id` | — | Single listing |
| POST | `/api/produce` | farmer | Create listing (multipart) |
| PUT | `/api/produce/:id` | farmer | Update listing |
| DELETE | `/api/produce/:id` | farmer/admin | Delete listing |

### Marketplace
| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/api/marketplace` | — | All available produce |
| POST | `/api/marketplace/filter` | — | Filter + AI-sort |
| GET | `/api/marketplace/qr/:produceId` | — | QR scan → traceability |

### Trace
| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/api/trace/:produceId` | — | Full trace info |
| POST | `/api/trace/log` | farmer/admin | Add trace event |

### Jobs
| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/api/jobs` | — | All jobs |
| GET | `/api/jobs/:id` | — | Single job |
| POST | `/api/jobs` | recruiter/buyer/admin | Create job |
| PUT | `/api/jobs/:id` | recruiter/buyer/admin | Update job |
| DELETE | `/api/jobs/:id` | recruiter/buyer/admin | Delete job |
| POST | `/api/jobs/apply` | farmer | Apply to job |
| GET | `/api/jobs/applications/my` | ✓ | My applications |
| GET | `/api/jobs/applications/job/:jobId` | recruiter | Job's applicants |
| PATCH | `/api/jobs/applications/:id/status` | recruiter | Accept/Reject |

### Analytics
| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/api/analytics/price-trends` | ✓ | Weekly price trends |
| GET | `/api/analytics/crop-demand` | ✓ | Crop demand aggregation |
| GET | `/api/analytics/heatmap` | ✓ | Geographic heatmap data |
| GET | `/api/analytics/income/:farmerId` | ✓ | Farmer monthly income |

### Matching
| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/api/matching/for-buyer/:buyerId` | ✓ | Best produce for buyer |
| GET | `/api/matching/for-farmer/:farmerId` | ✓ | Best buyers for farmer |

### Sync (Offline)
| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/sync/drafts` | farmer | Bulk upload offline drafts |

### Voice
| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/voice/intent` | — | Parse voice text → intent JSON |

### AI
| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/ai/quality-check` | — | Image quality estimation |

## Multilingual Support

Send `x-user-language: en | hi | mr` header on any request.
All error/success messages will be returned in the requested language.

## Postman Collection

Import `agrilink.postman_collection.json` into Postman.
Set the `token` collection variable after login to authenticate all protected requests.

## Connecting the Frontend / Mobile App

- Web (React): set `VITE_API_URL=http://localhost:5000/api` in your `.env`
- Mobile (Expo): set `API_URL=http://<your-local-ip>:5000/api` in your app config
- Store the JWT in `localStorage` (web) or `SecureStore` (Expo)
- Pass it as `Authorization: Bearer <token>` on every protected request
