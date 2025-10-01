package utils

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
)

func GetArtists() {
	// api url
	artistsURL := "https://groupietrackers.herokuapp.com/api/artists"

	// http get request
	getResp, err := http.Get(artistsURL)
	if err != nil {
		log.Fatal("Error: http get request", err)
	}
	defer getResp.Body.Close()

	// check status is OK
	if getResp.StatusCode != 200 {
		log.Fatal("Error: statu code is not 200", getResp.StatusCode)
	}

	// decode the JSON response into a stract
	errj := json.NewDecoder(getResp.Body).Decode(&artists)
	if errj != nil {
		log.Fatalf("Error: json %v", errj)
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
		// http get request
		getResp, errG := http.Get(urls[i])
		if errG != nil {
			log.Fatal("Error: http get request")
		}
		defer getResp.Body.Close()

		// check status is OK
		if getResp.StatusCode != 200 {
			log.Fatal("Error: status code is not 200", getResp.StatusCode)
		}

		// decode the JSON response into a stract
		errj := json.NewDecoder(getResp.Body).Decode(&result[i])
		if errj != nil {
			log.Fatalf("Error: json %v", errj)
		}
	}

	for i := range artists {
		// Assigning dates :
		artists[i].Locations = interfaceToStringSlice(result[0]["index"][i]["locations"])

		// Assigning dates :
		artists[i].Dates = interfaceToStringSlice(result[1]["index"][i]["dates"])

		// Assigning relations :
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
