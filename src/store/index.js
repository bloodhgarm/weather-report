import axios from 'axios'
import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    cities: [],
    currentCity: {}
  },
  mutations: {
    SET_CURRENT_USER_CITY (state, city) {
      state.currentCity = Object.assign({}, state.currentCity, city)
      localStorage.setItem('currentCity', JSON.stringify(state.currentCity))
    },
    ADD_CITY_TO_LIST (state, city) {
      state.cities.push(city)
    },
    REMOVE_CITY (state, id) {
      const cityIndex = state.cities.findIndex(t => t.id === id)
      state.cities.splice(cityIndex, 1)
    },
    REFRESH_CITY_WEATHER (state, city) {
      const cityIndex = state.cities.findIndex(t => t.id === city.id)
      state.cities.splice(cityIndex, 1, city)
    },
    REFRESH_LOCALSTORAGE_CITIES (state) {
      localStorage.removeItem('cities')
      localStorage.setItem('cities', JSON.stringify(state.cities))
    },
    SET_CITIES (state) {
      if (localStorage.getItem('cities')) {
        state.cities = JSON.parse(localStorage.getItem('cities'))
      }
    }
  },
  actions: {
    async getCurrentUserCityWeather ({ commit }) {
      try {
        if (localStorage.getItem('currentCity')) {
          commit('SET_CURRENT_USER_CITY', JSON.parse(localStorage.getItem('currentCity')))
          return
        }
        localStorage.removeItem('currentCity')
        const userCoords = await getUserPosition().then((data) => data).catch((error) => {
          console.error(error)
          const getTimeZoneCity = new Date().toString().match(/\(\w+/gm)[0].replace('(', '')
          const getCity = axios.get(`http://geodb-free-service.wirefreethought.com/v1/geo/cities?limit=1&offset=0&namePrefix=${getTimeZoneCity}&sort=-elevation`)
            .then((city) => {
              return {
                lat: city.data.data[0].latitude,
                lng: city.data.data[0].longitude
              }
            })
          return getCity
        })
        axios.get(`http://geodb-free-service.wirefreethought.com/v1/geo/locations/${encodeURIComponent(userCoords.lat + '+' + userCoords.lng)}/nearbyCities?limit=1&radius=100`)
          .then((response) => {
            commit('SET_CURRENT_USER_CITY', response.data.data[0])
            axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${response.data.data[0].city.split(',')[0]}&APPID=617cdb11b41a751be0d49c5e95a5fc30`)
              .then((report) => {
                commit('SET_CURRENT_USER_CITY', { ...report.data.main, ...report.data.weather[0], timeStamp: new Date() })
              })
          })
      } catch (error) {
        console.error(error)
      }
    },
    searchCity ({ commit }, city) {
      return axios.get(`http://geodb-free-service.wirefreethought.com/v1/geo/cities?limit=5&offset=0&namePrefix=${city}&sort=-elevation`)
        .then((response) => response.data.data)
        .catch((error) => {
          console.error(error)
          return []
        })
    },
    addCity ({ commit }, city) {
      axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city.city}&APPID=617cdb11b41a751be0d49c5e95a5fc30`)
        .then((report) => {
          commit('ADD_CITY_TO_LIST', { ...city, ...report.data.main, ...report.data.weather[0], timeStamp: new Date() })
          commit('REFRESH_LOCALSTORAGE_CITIES')
        })
    },
    removeCity ({ commit }, id) {
      commit('REMOVE_CITY', id)
      commit('REFRESH_LOCALSTORAGE_CITIES')
    },
    refreshWeatherCity ({ commit, state }, id) {
      const findCity = state.cities.find(t => t.id === id) || state.currentCity
      axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${findCity.city}&APPID=617cdb11b41a751be0d49c5e95a5fc30`)
        .then((refreshReport) => {
          commit('REFRESH_CITY_WEATHER', { ...findCity, ...refreshReport.data.main, ...refreshReport.data.weather[0], refreshed: true })
        })
    }
  },
  modules: {
  }
})

async function getUserPosition () {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        })
      },
      () => {
        reject(new Error('geolocation is not allowed'))
      },
      {
        timeout: 5000,
        maximumAge: 0
      })
  })
}
