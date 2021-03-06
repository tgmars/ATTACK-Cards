import Vue from 'vue'
import Component from 'vue-class-component'
import { state } from '@/main'


@Component({
    template:
    `
    <div>
    <b-navbar toggleable='lg' type='dark' variant='primary'>
      <b-navbar-brand><router-link to="/" style='color:white'>MITRE ATT&CK Cards</router-link></b-navbar-brand>
  
      <b-navbar-toggle target='nav-collapse'></b-navbar-toggle>
  
      <b-collapse id='nav-collapse' is-nav>
        <b-navbar-nav>
          <b-nav-item>
            <router-link to="/stats" style='color:white'>Statistics</router-link></b-nav-item>
        </b-navbar-nav>
  
       
      </b-collapse>
    </b-navbar>
  </div>
    `
})

//           <b-nav-item v-on:click='setChatShown' style='color:white'>Show/Hide Chat</b-nav-item>

export default class Navbar extends Vue {

  constructor(){
    super()
  }

  setChatShown(){
    state.chatShown = !state.chatShown;
  
  }


}