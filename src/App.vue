<template>
  <div id="app">
    <div class="container">
      <div class="header">
        <h1 class="header-general-title">
          World Weather
        </h1>
        <p class="header-subtitle">
          Watch weather in your current location
        </p>
      </div>
      <div class="current-city-block">
        <CityCard
          country-name="Your current location"
          :city-name="currentCity.city"
          :country-code="currentCity.countryCode"
          :weather="currentCity.main"
          :humidity="currentCity.humidity"
          :temp="currentCity.temp"
          :defaultCity="true"
          :timeStamp="currentCity.timeStamp "
        />
      </div>
      <div class="cities-block" v-show="citiesList.length > 0">
        <div class="city-card-wrapper" v-for="cityOptions in citiesList" :key="cityOptions.id">
          <CityCard
            :country-name="cityOptions.country"
            :city-name="cityOptions.city"
            :country-code="cityOptions.countryCode"
            :weather="cityOptions.main"
            :humidity="cityOptions.humidity"
            :temp="cityOptions.temp"
            :id="cityOptions.id"
          />
        </div>
      </div>
      <div class="app-actions">
        <button class="app-action-button" @click="showModal = true">
          +
        </button>
      </div>
    </div>
    <ModalWindow @close-window="showModal = false" :show="showModal"/>
  </div>
</template>

<script>
import CityCard from './components/CityCard.vue'
import ModalWindow from './components/Modal.vue'
export default {
  name: 'App',
  components: {
    CityCard,
    ModalWindow
  },
  beforeMount () {
    this.$store.dispatch('getCurrentUserCityWeather')
    this.$store.commit('SET_CITIES')
  },
  data () {
    return {
      showModal: false
    }
  },
  computed: {
    currentCity () {
      return this.$store.state.currentCity
    },
    citiesList () {
      return this.$store.state.cities
    }
  }
}
</script>

<style lang="scss">
#app {
  font-family: Lato, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  & * {
    box-sizing: border-box;
    font-family: Lato, Helvetica, Arial, sans-serif;
  }
}
.container {
  max-width: 1520px;
  margin: 0 auto;
  @media(max-width: 1024px) {
    padding: 0 15px;
    width: 100%;
  }
}
.current-city-block{
  display: flex;
  justify-content: center;
}
.header-general-title {
  font-style: normal;
  font-weight: 300;
  font-size: 70px;
  line-height: 80px;
  color: #1B1B1B;
  margin: 0;
}
.header-subtitle {
  color: #767676;
  font-size: 24px;
  margin: 32px 0 20px 0;
}
.cities-block {
  display: flex;
  width: 100%;
  justify-content: flex-start;
  flex-wrap: wrap;
  margin-top: 40px;
  .city-card-wrapper {
    padding: 0 15px;
    max-width: 350px;
    margin: 15px 0;
    flex: 0 0 25%;
  }
  @media (max-width: 1024px) {
    & {
      justify-content: center;
      .city-card-wrapper {
        flex: 0 0 33%;
      }
    }
  }
  @media (max-width: 768px) {
    & {
      justify-content: space-between;
      .city-card-wrapper {
        flex: 0 0 50%;
        margin-bottom: 20px;

      }
    }
  }
  @media (max-width: 425px) {
    & {
      justify-content: center;
      .city-card-wrapper {
        flex: 0 0 100%;
      }
    }
  }
}
.app-actions {
  position: fixed;
  right: 45px;
  bottom: 35px;
}
.app-action-button {
  background: #9B51E0;
  box-shadow: 0px 4px 5px rgba(0, 0, 0, 0.14), 0px 1px 10px rgba(0, 0, 0, 0.12), 0px 2px 4px rgba(0, 0, 0, 0.2);
  border-radius: 50px;
  width: 50px;
  height: 50px;
  text-align: center;
  vertical-align: middle;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 25px;
}
</style>
