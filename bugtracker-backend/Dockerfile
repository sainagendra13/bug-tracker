
FROM golang:1.21-alpine

WORKDIR /app

RUN mkdir -p /app/data

RUN apk add --no-cache wget

COPY go.mod go.sum ./

RUN go mod download

COPY . .

RUN go build -o main cmd/bugtracker/main.go

EXPOSE 8080

CMD ["./main"]
