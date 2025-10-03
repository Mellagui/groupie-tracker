package utils

import (
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
		return
	}
	tmpl.Execute(w, artists)
}

func HandlerCard(w http.ResponseWriter, r *http.Request) {
	if r.URL.Path != "/Artists" {
		ShowError(w, "404 - Page Not Found", http.StatusNotFound)
		return
	}

	tmpl, err := template.ParseFiles("template/Artist.html")
	if err != nil {
		ShowError(w, "500 Internal sever error - error parsing html template", 500)
		return
	}

	id, err := strconv.Atoi(r.FormValue("id"))
	if err != nil || id > len(artists) {
		ShowError(w, "404 - Not Found", 404)
		return
	}
	tmpl.Execute(w, artists[id-1])
}
