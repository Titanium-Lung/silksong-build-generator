import { useState } from "react"
import logo from "./assets/Hornet_Idle.png"

interface Crest {
  name: string
  whites: []
  reds: []
  blues: []
  yellows: []
}

function App() {
  const [crest, setCrest] = useState<Crest>({
    name: "",
    whites: [],
    reds: [],
    blues: [],
    yellows: []
  })
  const [blueVests, setBlueVests] = useState<number>(1)
  const [yellowVests, setYellowVests] = useState<number>(1)

  async function fetchBuild() {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/build`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ blueVests: blueVests, yellowVests: yellowVests})
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
    } else {
      console.log(result.error)
    }
  }

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark navbar-sticky bg-primary px-3 px-md-5 mb-4">
            <a className="navbar-brand" href="/">
                <img src={logo} style={{ height: "40px", width: "auto" }} /> Silksong Build Generator
            </a>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarColor01" aria-controls="navbarColor01" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbarColor01">

                <ul className="navbar-nav me-auto">
                    <li className="nav-item active">
                        <a className="nav-link" href="/">Home</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="https://github.com/Titanium-Lung/silksong-build-generator">Github</a>
                    </li>
                </ul>
            </div>
        </nav>
        <h1>Silksong Build Generator</h1>
        <button className="btn btn-success" onClick={fetchBuild}>Generate</button>
        <div className="form-group d-flex justify-content-center align-items-center gap-4">
          <label htmlFor="blueVests">Blue Vesticrests</label>
          <input className="form-control" type="number" min="0" value={blueVests} onChange={(e) => setBlueVests(Number(e.target.value))} style={{ width: "60px"}} />
          <label htmlFor="yellowVests">Yellow Vesticrests</label>
          <input className="form-control" type="number" min="0" value={yellowVests} onChange={(e) => setYellowVests(Number(e.target.value))} style={{ width: "60px"}} />
        </div>
        {
          crest.name != "" && (
            <div>
              <h2>{crest.name}</h2>
              {
                crest.whites.length != 0 && (
                  <div>
                    <p><strong>Whites: </strong>
                    {
                      crest.whites.join(", ")
                    }
                    </p>
                  </div>
                )
              }
              {
                crest.reds.length != 0 && (
                  <div>
                    <p><strong>Reds: </strong>
                    {
                      crest.reds.join(", ")
                    }
                    </p>
                  </div>
                )
              }
              {
                crest.blues.length != 0 && (
                  <div>
                    <p><strong>Blues: </strong>
                    {
                      crest.blues.join(", ")
                    }
                    </p>
                  </div>
                )
              }
              {
                crest.yellows.length != 0 && (
                  <div>
                    <p><strong>Yellows: </strong>
                    {
                      crest.yellows.join(", ")
                    }
                    </p>
                  </div>
                )
              }
            </div>
          )
        }
    </div>  
  )
}

export default App
