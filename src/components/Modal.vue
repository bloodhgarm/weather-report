<template>
  <div class="overlay" v-show="show">
    <div class="modal-window-wrapper">
      <h3 class="modal-window-title">Choose a city</h3>
      <p class="modal-window-description">
        To find city start typing and pick one from the suggestions
      </p>
      <div class="modal-window-search-container">
        <input class="modal-window-search" type="text"
          placeholder="Search city"
          @input="inputSearchCity" v-model="findCity"
          @focus="citiesListShow = true"
        />
        <div class="error" v-if="!$v.findCity.required">Field is required</div>
        <div class="error" v-if="!$v.findCity.numberExist">Name must doesn't have special symbols</div>
        <ul class="modal-window-search-list" v-show="citiesList.length != 0 && citiesListShow" ref="search-results">
          <li v-for="cityOption in citiesList" :key="cityOption.id" @click="selectCity(cityOption.id)">
            {{ cityOption.city }}
          </li>
        </ul>
        <div class="modal-window-search-actions" @click="handleClick">
          <button class="modal-window-action" :disabled="selectedCity === ''" data-control="clear">CLEAR</button>
          <button class="modal-window-action" data-control="cancel">CANCEL</button>
          <button class="modal-window-action" data-control="add" :disabled="selectedCity === ''">ADD</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'

let searchTime
// eslint-disable-next-line
const numberExist = (value) => !/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/.test(value)
export default {
  mixins: [validationMixin],
  data () {
    return {
      findCity: '',
      citiesList: [],
      selectedCity: '',
      citiesListShow: false
    }
  },
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  validations: {
    findCity: {
      required,
      numberExist
    }
  },
  mounted () {
    console.log('this.findCity:', this.findCity)
  },
  methods: {
    handleClick (event) {
      const condition = event.target.dataset.control
      switch (condition) {
        case 'cancel':
          this.$emit('close-window', false)
          break
        case 'clear':
          this.findCity = ''
          this.citiesList = []
          this.selectedCity = ''
          break
        case 'add':
          this.handleAddCity()
          this.$emit('close-window', false)
          break
        default:
          break
      }
    },
    inputSearchCity () {
      if (this.$v.findCity.$invalid) return
      clearTimeout(searchTime)
      searchTime = setTimeout(async () => {
        if (this.findCity.trim()) {
          this.citiesList = (await this.$store.dispatch('searchCity', this.findCity)).filter(t => t.type === 'CITY')
          console.log('citiesList', this.citiesList)
        }
      }, 300)
      this.selectedCity = ''
    },
    selectCity (id) {
      this.selectedCity = id
      this.findCity = this.citiesList.find(t => t.id === id).city
      this.citiesListShow = false
    },
    handleAddCity () {
      const city = this.citiesList.find(t => t.id === this.selectedCity)
      if (city) {
        this.$store.dispatch('addCity', city)
      }
      this.citiesListShow = false
      this.findCity = ''
      this.selectedCity = ''
    }
  }
}
</script>

<style lang="scss">
  .overlay {
    position: fixed;
    width: 100%;
    height: 100vh;
    background-color: rgba($color: #000000, $alpha: 0.8);
    top: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    .modal-window-wrapper {
      text-align: left;
      background-color: white;
      box-shadow: 0px 16px 24px rgba(0, 0, 0, 0.14), 0px 6px 30px rgba(0, 0, 0, 0.12), 0px 8px 10px rgba(0, 0, 0, 0.2);
      border-radius: 4px;
      padding: 24px;
      .modal-window-title {
        font-weight: bold;
        font-size: 32px;
        line-height: 38px;
        color: #1B1B1B;
        margin: 0;
      }
      .modal-window-description {
        font-size: 24px;
        line-height: 24px;
        color: #767676;
        margin-bottom: 40px;
      }
    }
    .modal-window-search-container{
      position: relative;
      .modal-window-search {
        font-weight: 500;
        font-size: 24px;
        line-height: 24px;
        color: #C1C1C1;
        padding: 16px 0;
        width: 100%;
        border: none;
        border-bottom: 1px solid #C4C4C4;
        margin-bottom: 140px;
        &:focus {
          outline: none;
          border-color: orange;
        }
      }
    }
    .modal-window-search-actions {
      display: flex;
      justify-content: flex-end;
      align-items: center;
    }
    .modal-window-action {
      border: none;
      background-color: transparent;
      color: #9B51E0;
      text-transform: uppercase;
      cursor: pointer;
      &:disabled {
        color: #C1C1C1;
      }
      &:first-child {
        margin-right: auto;
      }
    }
  }
  .modal-window-search-list {
    position: absolute;
    margin: 0;
    top: 61px;
    left: 0;
    width: 100%;
    padding: 10px 15px;
    background-color: #f5f5f5;
    list-style: none;
    & li {
      text-align: left;
      padding: 5px 10px;
      cursor: pointer;
      &:hover {
        background-color: orange;
        color: white;
      }
    }
  }
</style>
