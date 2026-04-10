import axios from 'axios'

const apiUrl =
  import.meta.env.VITE_API_BASE_URL || 'https://rental.mitwit-cre.com.tw/'

const Api = axios.create({
  baseURL: apiUrl,
})

export default Api