# Ptime Extension

*Ptime Extension* is a simple, user-friendly Chrome extension that provides a customizable timer. It allows users to start, pause, and reset a timer, as well as customize the timer's hours, minutes, and seconds. The extension includes an interactive interface with a digital clock display and options to modify the timer settings.

## Features

- Start, pause, and reset the timer.
- Customize timer settings (hours, minutes, seconds).
- Digital clock interface.
- Option to change timer values through an editable input screen.
- Alarm notification with sound and a custom alert modal when the timer reaches zero.

## Installation
1. Download and extract the source code or clone the repository to your local machine.
2. Open Chrome and navigate to chrome://extensions/.
3. Enable Developer mode in the top-right corner.
4. Click on Load unpacked and select the folder containing the extension files.
5. The extension will now be installed and visible in the Chrome toolbar.

## Usage
1. Click the extension icon to open the timer interface.
2. Press Start to begin the timer, and Pause to stop it.
3. Click Reset to reset the timer to the last saved value.
4. To modify the timer's settings, click the Edit button, input new values for hours, minutes, and seconds, and click Save.
5. The timer will remain in focus when there are 10 seconds or less remaining.

## Permissions
- storage: Used to store and retrieve the timer state.
- windows: Used to manage and focus the extension window during countdown.
- alarms: Used to schedule and manage timer functionality.

## License

This project is open-source and available under the [MIT License](/LICENSE).

## Contributing

Please follow the guidelines outlined in our [Contributing Guide](/CONTRIBUTING.md).


## Credits 

The idea for this project was derived from **[Ptime](https://github.com/rahidmondal/ptime)**.

