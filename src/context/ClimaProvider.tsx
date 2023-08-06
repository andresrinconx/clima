import { createContext, useState } from "react"
import axios from "axios"

const ClimaContext = createContext<{
  busqueda: {ciudad: string, pais: string}
  datosBusqueda: (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => void
  consultarClima: (datos: any) => void
  resultado: {name: string, main: {temp: number, temp_min: number, temp_max: number}}
  cargando: boolean
  noResultado: string
}>({
  busqueda: {ciudad: '', pais: ''},
  datosBusqueda: () => {},
  consultarClima: () => {},
  resultado: {name: '', main: {temp: 0, temp_min: 0, temp_max: 0}},
  cargando: false,
  noResultado: ''
})

export const ClimaProvider = ({children}: {children: React.ReactNode}) => {
    const [busqueda, setBusqueda] = useState({
        ciudad: '',
        pais: ''
    })
    const [resultado, setResultado] = useState({name: '', main: {temp: 0, temp_min: 0, temp_max: 0}})
    const [cargando, setCargando] = useState(false)
    const [noResultado, setNoResultado] = useState('')


    const datosBusqueda = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
        setBusqueda({
            ...busqueda,
            [e.target.name]: e.target.value
        })
    }

    const consultarClima = async (datos: any) => {
        setCargando(true)
        setNoResultado('')
        try {
            const { ciudad, pais } = datos

            const appId = import.meta.env.VITE_API_KEY

            const url = `http://api.openweathermap.org/geo/1.0/direct?q=${ciudad},${pais}&limit=1&appid=${appId}`

            const { data } = await axios(url)
            const { lat, lon } = data[0]

            const urlClima = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${appId}`

            const { data: clima } = await axios(urlClima)
            setResultado(clima)

        } catch (error) {
            setNoResultado('No hay resultados')
        } finally {
            setCargando(false)
        }

    }
  
  return (
  <ClimaContext.Provider value={{
    busqueda,
    datosBusqueda,
    consultarClima, 
    resultado,
    cargando,
    noResultado
  }}>
    {children}
  </ClimaContext.Provider>
  )
}

export default ClimaContext