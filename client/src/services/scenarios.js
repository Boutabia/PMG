import axios from 'axios'
import authHeader from './auth-header'
const baseUrl = 'http://localhost:3001/api/'

const getAll = () => {
  return axios.get(baseUrl + 'content/allScenarios', {
    headers: authHeader()
  })

}

const getCategories = () => {
  return axios.get(baseUrl + "content/category");
};

const deleteScenario = (scenarioToDeleteVar) => {
  return axios.delete(baseUrl + 'content/scenario', { 
    data: {scenarioToDeleteVar: scenarioToDeleteVar},
    headers: authHeader(),
  })
}

const createScenario = (scenarioData) => {
  return axios.post(baseUrl + 'content/complete', scenarioData, {
    headers: authHeader()
  })
}

const scenarios = {
  getAll,
  getCategories,
  deleteScenario,
  createScenario
}

export default scenarios;