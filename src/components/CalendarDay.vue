<template>
  <div :class="classObject" @click="captureClick">
    {{ day.format('D') }}
    <ul class="event-list">
      <li v-for="event in events">{{ event.description }}</li>
    </ul>
  </div>
</template>

<script>
  export default {
    props: ['day'],
    methods: {
      captureClick () {
        this.$store.commit('eventFormPosition', { x: event.clientX, y: event.clientY });
        this.$store.commit('eventFormActive', true);
        this.$store.commit('eventFormDate', this.day);
      },
    },
    computed: {
      events () {
        return this.$store.state.events.filter(event => event.date.isSame(this.day, 'day'));
      },
      classObject () {
        let today = this.day.isSame(this.$moment(), 'day');
        let eventFormDate = this.$store.state.eventFormDate;
        let eventFormActive = this.$store.state.eventFormActive;
        return {
          day: true,
          // today class will be applied if today is same as today
          today,
          past: this.day.isSameOrBefore(this.$moment(), 'day') && !today,
          active: eventFormDate.isSame(this.day, 'day') && eventFormActive,
        }
      }
    }
  }
</script>
