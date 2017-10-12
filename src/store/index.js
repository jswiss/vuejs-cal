import Vue from 'vue';
import Vuex from 'vuex';
import moment from 'moment-timezone';
import axios from 'axios';
// import VuexPersist from 'vuex-persist';

moment.tz.setDefault('UTC');

Vue.use(Vuex);

// const vuexLocalStorage = new VuexPersist({
// 	key: 'vuex',
// 	storage: window.localStorage,
// });

export default new Vuex.Store({
	state: {
		currentYear: 2017,
		currentMonth: 10,
		eventFormPositionX: 0,
		eventFormPositionY: 0,
		eventFormActive: false,
		eventFormDate: moment(),
		events: [],
	},
	mutations: {
		setCurrentMonth(state, payload) {
			state.currentMonth = payload;
		},
		setCurrentYear(state, payload) {
			state.currentYear = payload;
		},
		eventFormPosition(state, payload) {
			state.eventFormPositionX = payload.x;
			state.eventFormPositionY = payload.y;
		},
		eventFormActive(state, payload) {
			state.eventFormActive = payload;
		},
		addEvent(state, payload) {
			state.events.push(payload);
		},
		eventFormDate(state, payload) {
			state.eventFormDate = payload;
		},
	},
	actions: {
		addEvent(context, payload) {
			let obj = {
				description: payload,
				date: context.state.eventFormDate,
			};
			axios.post('/add_event', obj).then(res => {
				if (res.status === 200) {
					context.commit('addEvent', obj);
					resolve();
				} else {
					reject();
				}
			});
		},
	},
	// plugins: [vuexLocalStorage.plugin],
});
