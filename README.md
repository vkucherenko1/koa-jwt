# koa-jwt

Run `npm start` for a dev server

# Routes:

`http://localhost:3000/auth/login/` body: `{login, password}`, Method: `POST` //Login to server and get tokens (Access, Refresh)

`http://localhost:3000/auth/refresh/` body: `{refreshToken}`, Method: `POST` //Only for authorized users refresh Access Token

`http://localhost:3000/auth/logout/` Method: `POST` //Only for authorized users

`http://localhost:3000/auth/manual/:id` Method: `GET` //Get pair of tokens like a login method