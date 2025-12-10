import axios from 'axios'

const api = axios.create({
  baseURL: 'https://smpm-backend.onrender.com'
})

export default api