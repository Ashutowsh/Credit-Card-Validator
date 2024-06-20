# Credit Card Validator

Welcome to the Credit Card Validator project. This application validates credit card numbers using the **Luhn algorithm**.

## Project Overview

This project consists of a Go-based API server that validates credit card numbers and a React frontend for user interaction. The API checks whether the provided credit card number is valid based on the Luhn algorithm.

## Features

- **API Server**: Built with Go, it handles validation requests and provides responses indicating whether the credit card number is valid.
- **React Frontend**: A simple and intuitive user interface for users to input and validate their credit card numbers.

## Tech Stack

- Backend: Go
- Frontend: React
- Router: Gorilla Mux
- CORS: rs/cors

## Installation - Commands

Clone the repo or download the zip folder and install all dependencies.

#### Backend

    cd validator/main.go
    go mod tidy
    go run main.go

The above commands will start the server. 

#### Frontend

    cd frontend/ccValidator
    npm install
    npm run dev

The above command will run the client application for you where you can validate the algorithm.
