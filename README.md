# Silksong Build Generator

A website to randomly generate a crest+tool build in Silksong. The frontend is written in React using Typescript, and the backend is written in Go using Gin. 

## How to run

In the `frontend` folder, create a `.env` file with: `VITE_BACKEND_URL=http://localhost:5001/api`. 

This URL can be changed if you prefer, but the backend Dockerfile and docker-compose.yml have port 5001 exposed. 

Also create an empty `.env` in the `backend` folder. 

### Run with Docker

In the root of the project, run:

```
docker-compose up --build
```

Then visit http://localhost:5173 to view the website.

### Run without Docker

In the `backend` folder, run: 

```
go mod download
go build -o ./backend
./backend
```

In the `frontend` folder, run:

```
npm install
npm run dev
```

Then visit http://localhost:5173 to view the website.

## Contributing

To contribute to this project, first create a fork of this repo and clone it on your computer. Make changes and test locally, then create a Pull Request. 

## Adding new Crests and Tools

Crests and tools are stored in `crests.json` and `tools.json` in `backend/assets`. 