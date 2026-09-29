FROM golang:1.27.1-bookworm

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN CGO_ENABLED=0 go build -o ./backend

EXPOSE 5001

CMD ["./backend"]