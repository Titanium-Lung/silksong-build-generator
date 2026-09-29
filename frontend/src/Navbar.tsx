import logo from "./assets/Hornet_Idle.png"

export function Navbar() {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark navbar-sticky bg-primary px-3 px-md-5 mb-4">
            <a className="navbar-brand" href="/">
                <img src={logo} style={{ height: "40px", width: "auto" }} /> Silksong Build Generator
            </a>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarColor01" aria-controls="navbarColor01" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbarColor01">

                <ul className="navbar-nav me-auto">
                    <li className="nav-item">
                        <a className="nav-link" href="/">Home</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="https://github.com/Titanium-Lung/silksong-build-generator">Github</a>
                    </li>
                </ul>
            </div>
        </nav>
    )
}