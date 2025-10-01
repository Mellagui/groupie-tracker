package utils

import (
	"fmt"
	"html/template"
	"net/http"
	"strconv"
	"strings"
)

func HandleStatic(w http.ResponseWriter, r *http.Request) {
	if r.URL.Path == "/" || strings.Contains("/static/", r.URL.Path) {
		ShowError(w, "404 - Page Not Found", 404)
		return
	}
	fs := http.FileServer(http.Dir("static"))
	fs.ServeHTTP(w, r)
}

func Handler(w http.ResponseWriter, r *http.Request) {
	if r.URL.Path != "/" {
		ShowError(w, "404 - Page Not Found", http.StatusNotFound)
		return
	}

	tmpl, err := template.ParseFiles("template/Home.html")
	if err != nil {
		ShowError(w, "500 Internal sever error - error parsing html template", 500)
		fmt.Println(err)
		return
	}
	data1 := artists
	//fmt.Println(data1)

	tmpl.Execute(w, data1)
}

func HandlerCard(w http.ResponseWriter, r *http.Request) {
	if r.URL.Path != "/Artists" {
		ShowError(w, "404 - Page Not Found", http.StatusNotFound)
		return
	}

	tmpl, err := template.ParseFiles("template/Artist.html")
	if err != nil {
		ShowError(w, "500 Internal sever error - error parsing html template", 500)
		fmt.Println(err)
		return
	}

	idString := r.FormValue("id")
	id, err := strconv.Atoi(idString)

	if err != nil || id >= len(artists) {
		ShowError(w, "404 - Not Found", 404)
		fmt.Println("error getting id")
		return
	}

	data1 := artists[id-1]
	tmpl.Execute(w, data1)
}
