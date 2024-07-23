import axios from 'axios'

export default axios.create({
    baseURL:'http://localhost:5001/api'
    // baseURL:'https://verona-cfiw.onrender.com/api'
});