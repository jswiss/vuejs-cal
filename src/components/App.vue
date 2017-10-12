<template>
  <div>
    <div id="header">
      <div>
        <img src="../assets/logo.png" alt="VueJS Calendar">
        <h1>VueJS Calendar</h1>
      </div>
      <div>
        <current-month></current-month>
      </div>
    </div>
    <div id="day-bar">
      <div>Mon</div>
      <div>Tue</div>
      <div>Wed</div>
      <div>Thu</div>
      <div>Fri</div>
      <div>Sat</div>
      <div>Sun</div>
    </div>
    <div id="calendar">
      <div class="calendar-week" v-for="week in weeks">
        <calendar-day v-for="day in week" :day="day"></calendar-day>
      </div>
    </div>
    <event-form></event-form>
  </div>
</template>

<script>
  import CalendarDay from './CalendarDay.vue';
  import CurrentMonth from './CurrentMonth.vue';
  import EventForm from './EventForm.vue';

  export default {
    data () {
      return {

      };
    },
    computed: {
      // from store!
      month () {
        return this.$store.state.currentMonth;
      },
      year () {
        return this.$store.state.currentYear;
      },
      // generating all days in current month
      days () {
        let days = [];
        let currentDay = this.$moment(`${this.year}-${this.month}-1`, 'YYYY-M-D');

        // keep adding to the current day while we're still in the current month
        do {
          days.push(currentDay);
          currentDay = this.$moment(currentDay).add(1, 'days');
        } while ((currentDay.month() + 1) === this.month);

        // Add previous days to start
        currentDay = this.$moment(days[0]);

        const SUNDAY = 0;
        const MONDAY = 1;

        if (currentDay.day() !== MONDAY) {
          do {
            currentDay = this.$moment(currentDay).subtract(1, 'days');
            // using unshift instead of push, which pushes to start of array rather than end
            days.unshift(currentDay);
          } while (currentDay.day() !== MONDAY);
        }

        // Add following days to end
        currentDay = this.$moment(days[days.length - 1]);

        do {
          currentDay = this.$moment(currentDay).add(1, 'days');
          days.push(currentDay);
        } while (currentDay.day() !== SUNDAY);

        return days;
      },
      weeks () {
        let weeks = [];
        let week = [];

        for (let day of this.days) {
          week.push(day);
          if (week.length === 7) {
            weeks.push(week);
            week = [];
          }
        }
        return weeks;
      },
    },
    components: {
      CalendarDay,
      CurrentMonth,
      EventForm,
    }
  }
</script>

<style>

</style>