# Build binary first
FROM golang:1.27.1-bookworm AS build

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN CGO_ENABLED=0 go build -o /out/backend

# Final container is very small
FROM alpine:3.24

WORKDIR /app

COPY --from=build /out/backend ./backend
COPY assets ./assets

EXPOSE 5001

CMD ["./backend"]