const datetimePicker = document.getElementById('datetime-picker');
const startButton = document.getElementById('start-button');

let userSelectedDate = null;
let timerInterval;

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

flatpickr(datetimePicker, {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    userSelectedDate = selectedDates[0];
    const currentDate = new Date();

    if (userSelectedDate < currentDate) {
      iziToast.error({
        title: 'Error',
        message: 'Please choose a date in the future',
      });
      startButton.disabled = true;
    } else {
      startButton.disabled = false;
    }
  },
});

function updateTimer() {
  if (!userSelectedDate) {
    return;
  }

  const now = new Date();
  const timeRemaining = userSelectedDate - now;

  if (timeRemaining <= 0) {
    clearInterval(timerInterval);
    startButton.disabled = false;
    document.getElementById('datetime-picker').disabled = false;
    iziToast.success({
      title: 'Finished!',
      message: 'The countdown is over.',
    });
  } else {
    const { days, hours, minutes, seconds } = convertMs(timeRemaining);
    document.querySelector('[data-days]').textContent = addLeadingZero(days);
    document.querySelector('[data-hours]').textContent = addLeadingZero(hours);
    document.querySelector('[data-minutes]').textContent =
      addLeadingZero(minutes);
    document.querySelector('[data-seconds]').textContent =
      addLeadingZero(seconds);
  }
}

startButton.addEventListener('click', () => {
  startButton.disabled = true;
  document.getElementById('datetime-picker').disabled = true;
  timerInterval = setInterval(updateTimer, 1000);
});
