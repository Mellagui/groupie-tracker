package utils

import (
	"html/template"
	"net/http"
)

func ShowError(w http.ResponseWriter, message string, status int) {

	// Set the HTTP status code
	w.WriteHeader(status)

	// Parse the error template
	tmpl, err := template.ParseFiles("template/ErrPage.html")
	if err != nil {
		// If template parsing fails, fallback to a generic error response
		http.Error(w, "Could not load error page", http.StatusInternalServerError)
		return
	}

	httpError := Error{
		Status:  status,
		Message: message,
	}
	// Execute the template with the error message
	err = tmpl.Execute(w, httpError)
	if err != nil {
		// If template execution fails, respond with a generic error
		http.Error(w, "Could not render error page", http.StatusInternalServerError)
	}
}
