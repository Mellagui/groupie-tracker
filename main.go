package main

import (
	"fmt"
	"log"
	"net/http"
	h "groupie_tracker/utils"
)

func init() {
	fmt.Println("Curling data...")
	h.GetArtists()
	h.GetSubData()
	fmt.Println("data obtained successfully")
}

func main() {
	http.Handle("/static/", http.StripPrefix("/static", http.HandlerFunc(h.HandleStatic)))

	http.HandleFunc("/", h.Handler)
	http.HandleFunc("/Artists", h.HandlerCard)

	log.Println("Server start in : http://localhost:8080/")
	err := http.ListenAndServe(":8080", nil)
	if err != nil {
		log.Fatal("Error:", err)
	}
}
