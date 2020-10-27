import axios from 'axios'

const instance = axios.create({
  baseURL: process.env.MM_API_URL,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
})

export default instance
