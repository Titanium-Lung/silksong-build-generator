package main

import (
	"encoding/json"
	"log"
	"math/rand/v2"
	"net/http"
	"os"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

type Crest struct {
	White  int `json:"white"`
	Red    int `json:"red"`
	Blue   int `json:"blue"`
	Yellow int `json:"yellow"`
}

type Tools struct {
	White  []string `json:"white"`
	Red    []string `json:"red"`
	Blue   []string `json:"blue"`
	Yellow []string `json:"yellow"`
}

var crests map[string]Crest
var crestKeys []string
var tools Tools

func RandomBuild(c *gin.Context) {
	randomCrestNum := rand.IntN(len(crests))
	crest := crestKeys[randomCrestNum]

	crestTools := make(map[string][]string)

	blueVesticrests := 1
	yellowVesticrests := 1

	numWhites := crests[crest].White
	numReds := crests[crest].Red
	numBlues := crests[crest].Blue + blueVesticrests
	numYellows := crests[crest].Yellow + yellowVesticrests

	permutation := rand.Perm(len(tools.White))
	whites := make([]string, numWhites)
	for i := range numWhites {
		whites[i] = tools.White[permutation[i]]
	}

	permutation = rand.Perm(len(tools.Red))
	reds := make([]string, numReds)
	for i := range numReds {
		reds[i] = tools.Red[permutation[i]]
	}

	permutation = rand.Perm(len(tools.Blue))
	blues := make([]string, numBlues)
	for i := range numBlues {
		blues[i] = tools.Blue[permutation[i]]
	}

	permutation = rand.Perm(len(tools.Yellow))
	yellows := make([]string, numYellows)
	for i := range numYellows {
		yellows[i] = tools.Yellow[permutation[i]]
	}

	crestTools["whites"] = whites
	crestTools["reds"] = reds
	crestTools["blues"] = blues
	crestTools["yellows"] = yellows

	c.JSON(http.StatusOK, gin.H{"crest": crest, "tools": crestTools})
}

func main() {
	crestdata, err := os.ReadFile("assets/crests.json")
	if err != nil {
		log.Fatal(err)
	}
	tooldata, err := os.ReadFile("assets/tools.json")
	if err != nil {
		log.Fatal(err)
	}

	err = json.Unmarshal(crestdata, &crests)
	if err != nil {
		log.Fatal(err)
	}
	err = json.Unmarshal(tooldata, &tools)
	if err != nil {
		log.Fatal(err)
	}

	crestKeys = make([]string, 0, len(crests))
	for key := range crests {
		crestKeys = append(crestKeys, key)
	}

	router := gin.Default()
	router.SetTrustedProxies(nil)

	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173"},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	router.GET("/api/build", RandomBuild)

	router.Run(":5001")
}
