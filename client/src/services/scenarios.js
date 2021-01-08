import axios from 'axios'
import authHeader from './auth-header'
const baseUrl = 'http://localhost:3001/api/'

const getAll = () => {
  return axios.get(baseUrl + 'content/allScenarios', {
    headers: authHeader()
  })

}

const deleteScenario = (scenarioToDeleteVar) => {
  const request = {
    headers: authHeader()
    /* body: {
      "scenarioToDeleteVar": scenarioToDeleteVar.toString()
    },
    "scenarioToDeleteVare": scenarioToDeleteVar.toString(), 
    data: {
      "scenarioToDeleteVare": scenarioToDeleteVar
    }*/
    /* params: {
      "scenarioToDeleteVar": String(scenarioToDeleteVar),
    } */
  }

  console.log(request)

  return axios.delete(baseUrl + 'content/scenario', {
    headers: authHeader(), 
    data: {
      scenarioToDeleteVar: scenarioToDeleteVar
    }})
}

export default {
  getAll,
  deleteScenario
}