# Squat Timer

A simple web app to count your squats for 60 seconds.

**Live app:** [https://freddiefujiwara.com/squat-timer/](https://freddiefujiwara.com/squat-timer/)

## What this app does

- Uses your phone motion sensor.
- Detects squat movement.
- Counts each squat.
- Plays a short beep when a squat is counted.
- Runs a 60-second timer.
- Shows your final result in a modal.
- Lets you share your result.

## How it works (simple)

1. Tap **Start**.
2. The app asks for motion sensor permission (on supported devices/browsers).
3. The timer starts from 60 seconds.
4. The app reads `devicemotion` data.
5. A filter smooths noisy sensor data.
6. If movement passes a threshold, the app treats it as squat down/up motion.
7. The count increases once per valid squat cycle.
8. A 1-second delay helps avoid double-counting.
9. When time is up, the app stops and shows your total.

## Main screen parts

- **TimerDisplay**: shows seconds left.
- **CounterDisplay**: shows squat count.
- **StatusFeedback**: shows squat/stand state.
- **ControlPanel**: start, stop, reset buttons.
- **ErrorMessage**: shows permission or sensor errors.
- **ResultModal**: shows final count and share button.

## Project structure

```text
src/
  App.vue                         # main app flow
  main.js                         # app entry
  components/
    ControlPanel.vue
    CounterDisplay.vue
    ErrorMessage.vue
    ResultModal.vue
    StatusFeedback.vue
    TimerDisplay.vue
  composables/
    useSquatCounter.js            # motion sensor + squat logic
    useTimer.js                   # 60-second timer logic
    useAudio.js                   # beep sound logic
  __tests__/                      # component/composable tests
```

## Tech stack

- Vue 3
- Vite
- Vitest + Vue Test Utils

## Local setup

### 1) Install

```bash
npm install
```

### 2) Run in development

```bash
npm run dev
```

### 3) Build for production

```bash
npm run build
```

### 4) Preview production build

```bash
npm run preview
```

### 5) Run tests

```bash
npm test
```

## Notes

- Best experience is on a smartphone with motion sensors.
- Some browsers (especially on iOS) need a user tap before audio/sensor use.
- If permission is denied, the app cannot count squats.

## License

This project is released under the MIT License. See [LICENSE](./LICENSE).
