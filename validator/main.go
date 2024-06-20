package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"unicode"

	"github.com/gorilla/mux"
	"github.com/rs/cors"
)

func main() {
	fmt.Println("Welcome to Credit Card Validator...")

	r := mux.NewRouter()
	r.HandleFunc("/", serveHome)
	r.HandleFunc("/validate", validate).Methods("POST")

	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"*"}, // Allow all origins
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Content-Type", "Authorization"},
		AllowCredentials: true,
	})

	// Wrap the router with the CORS middleware
	handler := c.Handler(r)

	log.Fatal(http.ListenAndServe(":4000", handler))
}

// helpers

func parseCreditCardNumber(ccNumber string) ([]int, error) {
	var numbers []int
	for _, char := range ccNumber {
		if unicode.IsDigit(char) {
			num := int(char - '0')
			numbers = append(numbers, num)
		}
	}
	if len(numbers) == 0 {
		return nil, fmt.Errorf("No digits found in the input string")
	}
	return numbers, nil
}

func luhnAlgorithm(ccNumbers []int) bool {
	n := len(ccNumbers)
	sum := 0
	flag := false

	for i := n - 1; i >= 0; i-- {
		num := ccNumbers[i]
		if flag {
			num *= 2
			if num > 9 {
				num -= 9
			}
		}
		sum += num
		flag = !flag
	}

	return sum%10 == 0
}

// model

type CardNumber struct {
	Number string `json:"number"`
}

// controllers

func serveHome(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("<h1>Welcome to Credit Card Validator.</h1>"))
}

func validate(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	if r.Body == nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"success": "false", "message": "Please send some data."})
		return
	}

	var number CardNumber
	err := json.NewDecoder(r.Body).Decode(&number)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"success": "false", "message": "Error decoding JSON."})
		return
	}

	if number.Number == "" {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"success": "false", "message": "Provide the card number."})
		return
	}

	numSlice, err := parseCreditCardNumber(number.Number)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"success": "false", "message": fmt.Sprintf("Error: %v", err)})
		return
	}

	if luhnAlgorithm(numSlice) {
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(map[string]string{"success": "true", "message": "The credit card number is valid."})
	} else {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"success": "false", "message": "The credit card number is invalid."})
	}
}
