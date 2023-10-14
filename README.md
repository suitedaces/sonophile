# Sonophile 👨🏽‍🎤

Sonophile is your gateway to dive deep into your Spotify listening habits and discover **mood-based recommendations** tailored just for you 🎶.

**NOTE:** You won't be able to access the app thru sonophile.xyz unless whitelisted, please email ishan@gosurf.ai for access. 

https://github.com/suitedaces/sonophile/assets/50865782/04a9d637-ce29-40c9-bdd9-c43d2df669ff

## 🛠️ Tech Stack:
- **MongoDB 🍃**: User data storage.
- **Express.js 🚂**: Backend framework.
- **React ⚛️**: UI development.
- **Docker 🐳**: Containerization and deployment.
- **Docker Compose 📦**: Multi-container Docker applications.
- **Nginx 🌐**: Web server and reverse proxy.
- **AWS EC2 ☁️**: Cloud computing instance for deployment.
- **Node.js 🟢**: Backend runtime.
- **TailwindCSS 🌬️**: UI styling.
- **Vite ⚡**: Development & build tool.

## 🌟 Features:
- 🎭 **Mood-based Song Recommendation**: Get Spotify tracks recommendations based on your current mood and preferred genre.
- 🎧 **Top Artists & Tracks**: Dive into your top artists and tracks segmented by 4 weeks, 6 months, and all-time favorites.
- 🔒 **OAuth 2.0**: Securely log in and access your data with peace of mind.

## 🚀 Setup:
1. Ensure you have Docker and Docker Compose installed on your machine.
2. Clone the repository:
```
git clone https://github.com/suitedaces/sonophile.git
```
3. Set up the following environment variables in a `.env` file:

- `CLIENT_ID`: Your Spotify Client ID.
- `CLIENT_SECRET`: Your Spotify Client Secret.
- `REDIRECT_URI`: Your Spotify Redirect URI.
- `FRONTEND_URI`: Frontend URI for the application.
- `MONGO_URI`: MongoDB connection string.
4. Run the following commands:
```
cd sonophile
docker-compose up -d --build
```
5. Navigate to `http://localhost/`

## 🤝 Contribute:
Open an issue or submit a PR.

## 📜 License:
MIT

---

