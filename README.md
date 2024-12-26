# Telegram Attendance Bot

This project is a Telegram bot designed to track attendance for events. It allows users to mark their attendance and retrieve attendance records easily.

## Features

- Track attendance for events
- Retrieve attendance records
- Easy to set up and use

## Project Structure

```
telegram-attendance-bot
├── src
│   ├── bot.ts                  # Entry point of the Telegram bot
│   ├── controllers
│   │   └── attendanceController.ts # Handles attendance tracking and retrieval
│   ├── routes
│   │   └── index.ts            # Sets up routes for the bot
│   └── types
│       └── index.ts            # Defines interfaces for attendance and user data
├── package.json                 # npm configuration file
├── tsconfig.json                # TypeScript configuration file
└── README.md                    # Project documentation
```

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/telegram-attendance-bot.git
   ```

2. Navigate to the project directory:
   ```
   cd telegram-attendance-bot
   ```

3. Install the dependencies:
   ```
   npm install
   ```

## Usage

1. Update the bot token in `src/bot.ts`.
2. Run the bot:
   ```
   npm start
   ```

3. Interact with the bot on Telegram to track attendance.

## Contributing

Feel free to submit issues or pull requests to improve the bot's functionality.