import { useState, useEffect } from "react"
import { Navbar } from "./Navbar"
import { Link } from "react-router-dom"

interface Crest {
  name: string
  whites: []
  reds: []
  blues: []
  yellows: []
}

function Home() {
  const [crest, setCrest] = useState<Crest>({
    name: "",
    whites: [],
    reds: [],
    blues: [],
    yellows: []
  })
  const [blueVests, setBlueVests] = useState<number>(Number(localStorage.getItem("blueVests") || 1))
  const [yellowVests, setYellowVests] = useState<number>(Number(localStorage.getItem("yellowVests") || 1))
  const [blacklist, setBlacklist] = useState(localStorage.getItem("blacklist") || "")
  const [error, setError] = useState("")

  useEffect(() => {
    localStorage.setItem("blacklist", blacklist)
  }, [blacklist])

  useEffect(() => {
    localStorage.setItem("blueVests", String(blueVests))
  }, [blueVests])

  useEffect(() => {
    localStorage.setItem("yellowVests", String(yellowVests))
  }, [yellowVests])

  async function fetchBuild() {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/build`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ blueVests: blueVests, yellowVests: yellowVests, blacklist: blacklist})
    })

    const result = await response.json()

    if (response.ok) {
      const newCrest: Crest = {
        name: result.crest,
        whites: result.tools["whites"],
        reds: result.tools["reds"],
        blues: result.tools["blues"],
        yellows: result.tools["yellows"]
      }

      setCrest(newCrest)
      setError("")
    } else {
      setError(result.error)
    }
  }

  return (
    <div>
        <Navbar />
        <h1>Silksong Build Generator</h1>
        <button className="btn btn-success" onClick={fetchBuild}>Generate</button>
        <div className="form-group d-flex justify-content-center align-items-center gap-4">
          <label htmlFor="blueVests">Blue Vesticrests</label>
          <input className="form-control" type="number" min="0" value={blueVests} onChange={(e) => setBlueVests(Number(e.target.value))} style={{ width: "60px"}} />
          <label htmlFor="yellowVests">Yellow Vesticrests</label>
          <input className="form-control" type="number" min="0" value={yellowVests} onChange={(e) => setYellowVests(Number(e.target.value))} style={{ width: "60px"}} />
        </div>
        <p className="text-danger">{error}</p>
        {
          crest.name != "" && (
            <div>
              <h2>{crest.name}</h2>
              {
                crest.whites.length != 0 && (
                  <div>
                    <p><strong>Silk Skills: </strong>{crest.whites.join(", ")}</p>
                  </div>
                )
              }
              {
                crest.reds.length != 0 && (
                  <div>
                    <p><strong>Red Tools: </strong>{crest.reds.join(", ")}</p>
                  </div>
                )
              }
              {
                crest.blues.length != 0 && (
                  <div>
                    <p><strong>Blue Tools: </strong>{crest.blues.join(", ")}</p>
                  </div>
                )
              }
              {
                crest.yellows.length != 0 && (
                  <div>
                    <p><strong>Yellow Tools: </strong>{crest.yellows.join(", ")}</p>
                  </div>
                )
              }
            </div>
          )
        }
        <hr className="border-primary" />
        <div className="form-group d-flex flex-column align-items-center">
            <label htmlFor="blacklist"><strong>Blacklist</strong>. Case insensitive, separate by newline or comma (spaces are important!)</label>
            <div className="border">
                <textarea className="form-control text-box" rows={8} value={blacklist} onChange={(e) => setBlacklist(e.target.value)} />
            </div>
        </div>
        <Link to="/list">List of all crests, skills, and tools</Link>
    </div>  
  )
}

export default Home
