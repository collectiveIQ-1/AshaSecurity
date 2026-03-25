# SmartPortal (React + Node/Express + MongoDB)

A modern, wizard-style online application portal with:
- React (Vite) frontend + Tailwind UI
- Node/Express backend
- MongoDB (Mongoose) for storing submissions
- File uploads (signature, ID docs) stored on server disk (./server/uploads)
- Email notifications via Nodemailer (SMTP)

## Prerequisites
- Node.js LTS
- MongoDB (local) OR MongoDB Atlas
- (Optional) Gmail/SMTP credentials for sending emails

## 1) Setup
From the project root:

```bash
# install dependencies
npm install

# copy env files
cp server/.env.example server/.env
cp client/.env.example client/.env

# start dev (runs client + server)
npm run dev
```

Client: http://localhost:5173  
Server: http://localhost:5000/health

## 2) MongoDB
Put your MongoDB connection string in `server/.env`:

- Local example: `mongodb://127.0.0.1:27017/smartportal`
- Atlas example: `mongodb+srv://<user>:<pass>@<cluster>/<db>?retryWrites=true&w=majority`

## 3) Email
Fill SMTP settings in `server/.env`.  
If you don't want email for now, set `EMAIL_ENABLED=false`.

## 4) Production build
```bash
npm run build
npm start
```

This builds the client and serves it from the server.

## Project structure
- `client/` React UI
- `server/` Express API + MongoDB + uploads + email
