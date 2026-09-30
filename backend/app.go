package main

import (
	"encoding/json"
	"log"
	"math/rand/v2"
	"net/http"
	"os"
	"strings"
	"time"

	mapset "github.com/deckarep/golang-set/v3"
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

type BuildConfig struct {
	BlueVesticrests   int    `json:"blueVests"`
	YellowVesticrests int    `json:"yellowVests"`
	Blacklist         string `json:"blacklist"`
}

var crests map[string]Crest
var crestKeys []string
var tools Tools

func RandomBuild(c *gin.Context) {
	var buildConfig BuildConfig
	if err := c.ShouldBindJSON(&buildConfig); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	blacklistStrs := strings.FieldsFunc(buildConfig.Blacklist, func(r rune) bool {
		return r == ',' || r == ';' || r == '\n'
	})
	blacklist := mapset.NewSet[string]()
	for _, str := range blacklistStrs {
		blacklist.Add(strings.TrimSpace(strings.ToLower(str)))
	}

	filteredCrests := make(map[string]Crest)
	for crest, info := range crests {
		if !blacklist.Contains(strings.ToLower(crest)) {
			filteredCrests[crest] = info
		}
	}

	filteredCrestKeys := make([]string, 0)
	for key := range filteredCrests {
		filteredCrestKeys = append(filteredCrestKeys, key)
	}

	var filteredTools Tools
	filteredTools.White = make([]string, 0)
	filteredTools.Red = make([]string, 0)
	filteredTools.Blue = make([]string, 0)
	filteredTools.Yellow = make([]string, 0)
	for _, tool := range tools.White {
		if !blacklist.Contains(strings.ToLower(tool)) {
			filteredTools.White = append(filteredTools.White, tool)
		}
	}
	for _, tool := range tools.Red {
		if !blacklist.Contains(strings.ToLower(tool)) {
			filteredTools.Red = append(filteredTools.Red, tool)
		}
	}
	for _, tool := range tools.Blue {
		if !blacklist.Contains(strings.ToLower(tool)) {
			filteredTools.Blue = append(filteredTools.Blue, tool)
		}
	}
	for _, tool := range tools.Yellow {
		if !blacklist.Contains(strings.ToLower(tool)) {
			filteredTools.Yellow = append(filteredTools.Yellow, tool)
		}
	}

	if len(filteredCrests) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Blacklisted too many crests"})
		return
	}

	randomCrestNum := rand.IntN(len(filteredCrests))
	crest := filteredCrestKeys[randomCrestNum]

	blueVesticrests := buildConfig.BlueVesticrests
	yellowVesticrests := buildConfig.YellowVesticrests

	numWhites := filteredCrests[crest].White
	numReds := filteredCrests[crest].Red
	numBlues := filteredCrests[crest].Blue + blueVesticrests
	numYellows := filteredCrests[crest].Yellow + yellowVesticrests

	if numWhites > len(filteredTools.White) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Too many blacklisted silk skills"})
		return
	}
	if numReds > len(filteredTools.Red) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Too many blacklisted red tools"})
		return
	}
	if numBlues > len(filteredTools.Blue) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Too many blue vesticrests or too many blacklisted"})
		return
	}
	if numYellows > len(filteredTools.Yellow) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Too many yellow vesticrests or too many blacklisted"})
		return
	}

	permutation := rand.Perm(len(filteredTools.White))
	whites := make([]string, numWhites)
	for i := range numWhites {
		whites[i] = filteredTools.White[permutation[i]]
	}

	permutation = rand.Perm(len(filteredTools.Red))
	reds := make([]string, numReds)
	for i := range numReds {
		reds[i] = filteredTools.Red[permutation[i]]
	}

	permutation = rand.Perm(len(filteredTools.Blue))
	blues := make([]string, numBlues)
	for i := range numBlues {
		blues[i] = filteredTools.Blue[permutation[i]]
	}

	permutation = rand.Perm(len(filteredTools.Yellow))
	yellows := make([]string, numYellows)
	for i := range numYellows {
		yellows[i] = filteredTools.Yellow[permutation[i]]
	}

	crestTools := make(map[string][]string)
	crestTools["whites"] = whites
	crestTools["reds"] = reds
	crestTools["blues"] = blues
	crestTools["yellows"] = yellows

	c.JSON(http.StatusOK, gin.H{"crest": crest, "tools": crestTools})
}

func GetEverything(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"crests":      crestKeys,
		"whiteTools":  tools.White,
		"redTools":    tools.Red,
		"blueTools":   tools.Blue,
		"yellowTools": tools.Yellow,
	})
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

	router.POST("/api/build", RandomBuild)
	router.GET("/api/list", GetEverything)

	router.Run(":5001")
}
