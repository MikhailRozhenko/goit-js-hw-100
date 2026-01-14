// Описаний в документації

import flatpickr from 'flatpickr';
// Додатковий імпорт стилів
import 'flatpickr/dist/flatpickr.min.css';

// Описаний у документації
import iziToast from 'izitoast';
// Додатковий імпорт стилів
import 'izitoast/dist/css/iziToast.min.css';

document.addEventListener('DOMContentLoaded', () => {
  const input = document.querySelector('#datetime-picker');
  const button = document.querySelector('button[data-start]');
  const daysEl = document.querySelector('[data-days]');
  const hoursEl = document.querySelector('[data-hours]');
  const minutesEl = document.querySelector('[data-minutes]');
  const secondsEl = document.querySelector('[data-seconds]');
  let intervalId = null;

  let userSelectedDate = null;
  button.disabled = true;
  syncButtonState();

  console.log(button.classList);

  input.disabled = false;

  const options = {
    enableTime: true,
    time_24hr: true,
    defaultDate: new Date(),
    minuteIncrement: 1,
    onClose(selectedDates) {
      const selectedDate = selectedDates[0];
      const now = new Date();

      if (selectedDate < now) {
        showError('Please choose a date in the future');
        button.disabled = true;
        syncButtonState();
        userSelectedDate = null;
        return;
      }

      button.disabled = false;
      syncButtonState();

      userSelectedDate = selectedDate;
    },
  };

  flatpickr(input, options);

  function formatTime(ms) {
    const totalSeconds = Math.floor(ms / 1000);

    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return {
      days,
      hours: hours.toString().padStart(2, '0'),
      minutes: minutes.toString().padStart(2, '0'),
      seconds: seconds.toString().padStart(2, '0'),
    };
  }

  function showError(message) {
    iziToast.error({
      title: 'Error',
      message: message,
      position: 'topRight',
      timeout: 3000,
      pauseOnHover: true,
      close: true,
    });
  }

  button.addEventListener('click', () => {
    input.disabled = true;
    button.disabled = true;
    syncButtonState();

    if (intervalId) return;
    intervalId = setInterval(() => {
      const currentTime = Date.now();
      const diff = userSelectedDate - currentTime;
      if (diff <= 0) {
        daysEl.textContent = '00';
        hoursEl.textContent = '00';
        minutesEl.textContent = '00';
        secondsEl.textContent = '00';

        clearInterval(intervalId);
        intervalId = null;
        input.disabled = false;
      } else {
        const time = formatTime(diff);
        daysEl.textContent = time.days;
        hoursEl.textContent = time.hours;
        minutesEl.textContent = time.minutes;
        secondsEl.textContent = time.seconds;
      }
    }, 1000);
  });

  function syncButtonState() {
    button.classList.toggle('disabled-button', button.disabled);
  }
});
