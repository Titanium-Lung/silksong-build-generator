import { useEffect, useState } from "react";
import { Navbar } from "./Navbar";
import './list.css'

function List() {
    const [crests, setCrests] = useState([])
    const [whiteTools, setWhiteTools] = useState([])
    const [redTools, setRedTools] = useState([])
    const [blueTools, setBlueTools] = useState([])
    const [yellowTools, setYellowTools] = useState([])

    useEffect(() => {
        async function fetchEverything() {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/list`, {
                method: "GET"
            })

            const result = await response.json()

            if (response.ok) {
                setCrests(result.crests)
                setWhiteTools(result.whiteTools)
                setRedTools(result.redTools)
                setBlueTools(result.blueTools)
                setYellowTools(result.yellowTools)
            } else {
                console.log(result.error)
            }
        }
        fetchEverything()
    }, [])

    return (
        <div>
            <Navbar />
            <h1>Crests</h1>
            {
                crests.map((crest, index) => (
                    <p key={index}>{crest}</p>
                ))
            }
            <h1>Silk Skills</h1>
            {
                whiteTools.map((tool, index) => (
                    <p key={index}>{tool}</p>
                ))
            }
            <h1>Red Tools</h1>
            {
                redTools.map((tool, index) => (
                    <p key={index}>{tool}</p>
                ))
            }
            <h1>Blue Tools</h1>
            {
                blueTools.map((tool, index) => (
                    <p key={index}>{tool}</p>
                ))
            }
            <h1>Yellow Tools</h1>
            {
                yellowTools.map((tool, index) => (
                    <p key={index}>{tool}</p>
                ))
            }
        </div>        
    )
}

export default List
