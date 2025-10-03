package utils

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
)

func GetArtists() {
	response, err := http.Get("https://groupietrackers.herokuapp.com/api/artists")
	if err != nil {
		log.Fatal("Error: http get request", err)
	}
	defer response.Body.Close()

	if response.StatusCode != 200 {
		log.Fatal("Error: response status code is not ok:", response.StatusCode)
	}

	errJson := json.NewDecoder(response.Body).Decode(&artists)
	if errJson != nil {
		log.Fatalf("Error: json %v", errJson)
	}
}

func GetSubData() {
	urls := []string{
		"https://groupietrackers.herokuapp.com/api/locations",
		"https://groupietrackers.herokuapp.com/api/dates",
		"https://groupietrackers.herokuapp.com/api/relation",
	}

	result := make([]map[string][]map[string]any, 3)
	for i := range urls {
		response, err := http.Get(urls[i])
		if err != nil {
			log.Fatal("Error: http get request")
		}
		defer response.Body.Close()

		if response.StatusCode != 200 {
			log.Fatal("Error: response status code is not ok:", response.StatusCode)
		}

		errJson := json.NewDecoder(response.Body).Decode(&result[i])
		if errJson != nil {
			log.Fatalf("Error: json %v", errJson)
		}
	}

	for i := range artists {
		artists[i].Locations = interfaceToStringSlice(result[0]["index"][i]["locations"])
		artists[i].Dates = interfaceToStringSlice(result[1]["index"][i]["dates"])
		artists[i].Relations = interfaceToMap(result[2]["index"][i]["datesLocations"])
	}
}

func interfaceToMap(input any) map[string][]string {
	// First, try to assert input as map[string]interface{}
	interfaceMap := input.(map[string]any)

	// Create a new map[string]string to hold the converted values
	stringMap := make(map[string][]string)

	// Loop through each element and try to convert it to a string
	for key, value := range interfaceMap {

		slice := value.([]any)

		dates := make([]string, len(slice))

		for i, v := range slice {
			str := v.(string)
			dates[i] = str
		}

		stringMap[key] = dates
	}

	return stringMap
}

func interfaceToStringSlice(input any) []string {
	// First, try to assert input as []any
	interfaceSlice, ok := input.([]any)
	if !ok {
		fmt.Println("input is not a []interface{}")
		return nil
	}

	// Create a new []string slice to hold the converted values
	stringSlice := make([]string, len(interfaceSlice))

	// Loop through each element and try to convert it to a string
	for i, v := range interfaceSlice {
		str := v.(string)
		stringSlice[i] = str
	}

	return stringSlice
}
