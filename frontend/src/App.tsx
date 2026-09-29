import { useState } from "react"
import logo from "./assets/Hornet_Idle.png"

interface Crest {
  name: string
  whites: [],
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

  async function fetchBuild() {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/build`, {
        method: "GET"
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
        <br></br>
        {
          crest.name != "" && (
            <div>
              <h3>{crest.name}</h3>
              <p><strong>Whites:</strong></p>
              {
                crest.whites.join(", ")
              }
              <p><strong>Reds:</strong></p>
              {
                crest.reds.join(", ")
              }
              <p><strong>Blues:</strong></p>
              {
                crest.blues.join(", ")
              }
              <p><strong>Yellows:</strong></p>
              {
                crest.yellows.join(", ")
              }
              {/* <p>Whites: {crest.whites}; Reds: {crest.reds}; Blues: {crest.blues}; Yellows: {crest.yellows}</p> */}
            </div>
          )
        }
    </div>  
  )
}

export default App
