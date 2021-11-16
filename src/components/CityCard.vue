<template>
  <div class="city-card">
    <h3 class="city-card__title">{{ cityName }}{{`, ${countryCode}`}}</h3>
    <p class="city-card__country">{{ countryName }}</p>
    <table class="city-card__table">
      <tr>
        <td>Weather</td>
        <td>{{weather}}</td>
      </tr>
       <tr>
        <td>Temperature</td>
        <td>{{temp | tempToCelsius}}</td>
      </tr>
       <tr>
        <td>Humidity</td>
        <td>{{humidity + ' %'}}</td>
      </tr>
    </table>
    <span>{{timesRemain}}</span>
    <div class="city-card-actions">
      <button class="city-card-action" v-if="!defaultCity" @click="handleRemove(id)">
        REMOVE
      </button>
      <button class="city-card-action"
      :style="{'margin-left': cityName ? 'auto' : 'inherit'}"
      @click="handleReload(id)">
        RELOAD
      </button>
    </div>
  </div>
</template>

<script>
import moment from 'moment'

export default {
  props: {
    id: {
      type: Number,
      default: 1
    },
    defaultCity: {
      type: Boolean,
      default: false
    },
    cityName: {
      type: String,
      default: 'City'
    },
    countryName: {
      type: String,
      default: 'Country'
    },
    countryCode: {
      type: String,
      default: ''
    },
    weather: {
      type: String,
      default: ''
    },
    humidity: {
      type: Number,
      default: 0
    },
    temp: {
      type: Number,
      default: 0
    },
    timeStamp: {
      type: Date,
      default: () => new Date()
    }
  },
  data: () => ({
    timesRemain: ''
  }),
  beforeMount () {
    this.udpateTime()
    this.interval = setInterval(this.udpateTime, 1000 * 60)
  },
  destroyed () {
    clearInterval(this.interval)
  },
  filters: {
    tempToCelsius: (temp) => {
      return Math.round(temp - 273.15) + ' °C'
    }
  },
  methods: {
    udpateTime () {
      console.log('times: ', moment(this.timeStamp).startOf('mins').fromNow())
      this.timesRemain = moment(this.timeStamp).startOf('mins').fromNow()
    },
    handleRemove (id) {
      this.$store.dispatch('removeCity', id)
    },
    handleReload (id) {
      this.$store.dispatch('refreshWeatherCity', id)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  .city-card {
    max-width: 825px;
    box-shadow: 0px 2px 10px rgba(10, 10, 10, 0.25);
    border-radius: 6px;
    padding: 24px;
    width: 100%;
    text-align: left;
    &__table {
      width: 100%;
      & tr td:first-child {
        text-align: left;
      }
      & tr td:last-child {
        text-align: right;
      }
      & tr {
        padding: 12px 0;
        border-bottom: 1px solid #C4C4C4;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
    }
    & span {
      display: block;
      text-align: right;
      margin-top: 10px;
      font-size: 12px;
    }
  }
  .city-card-actions {
    margin-top: 32px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .city-card-action {
      background-color: transparent;
      text-transform: uppercase;
      color: #9B51E0;
      border: none;
      font-weight: bold;
      font-size: 16px;
      cursor: pointer;
    }
  }
</style>
