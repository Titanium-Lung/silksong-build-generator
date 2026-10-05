package main_test

import (
	"encoding/json"
	"log"
	"net/http"
	"net/http/httptest"
	"os"
	"strings"
	"testing"

	main "github.com/Titanium-Lung/silksong-build-generator"
	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
)

func TestGetEverything(t *testing.T) {
	router := gin.Default()
	router.GET("/api/list", main.GetEverything)

	w := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/api/list", nil)
	router.ServeHTTP(w, req)

	var result strings.Builder
	result.WriteString(`{"crests": ["`)

	crestsStr := strings.Join(main.CrestKeys, `", "`)
	result.WriteString(crestsStr)
	result.WriteString(`"], "whiteTools": ["`)

	whiteStr := strings.Join(main.Tools.White, `", "`)
	result.WriteString(whiteStr)
	result.WriteString(`"], "redTools": ["`)

	redStr := strings.Join(main.Tools.Red, `", "`)
	result.WriteString(redStr)
	result.WriteString(`"], "blueTools": ["`)

	blueStr := strings.Join(main.Tools.Blue, `", "`)
	result.WriteString(blueStr)
	result.WriteString(`"], "yellowTools": ["`)

	yellowStr := strings.Join(main.Tools.Yellow, `", "`)
	result.WriteString(yellowStr)
	result.WriteString(`"]}`)

	assert.Equal(t, 200, w.Code)
	assert.JSONEq(t, result.String(), w.Body.String())
}

func TestMain(m *testing.M) {
	crestdata, err := os.ReadFile("assets/crests.json")
	if err != nil {
		log.Fatal(err)
	}
	tooldata, err := os.ReadFile("assets/tools.json")
	if err != nil {
		log.Fatal(err)
	}

	err = json.Unmarshal(crestdata, &main.Crests)
	if err != nil {
		log.Fatal(err)
	}
	err = json.Unmarshal(tooldata, &main.Tools)
	if err != nil {
		log.Fatal(err)
	}

	main.CrestKeys = make([]string, 0, len(main.Crests))
	for key := range main.Crests {
		main.CrestKeys = append(main.CrestKeys, key)
	}

	gin.SetMode(gin.TestMode)
	os.Exit(m.Run())
}
