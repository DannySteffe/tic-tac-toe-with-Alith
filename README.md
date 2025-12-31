
# Tic Tac Toe with Alith AI

A modern Tic Tac Toe web application featuring Alith, an AI opponent powered by xAI’s Grok.

![Tic Tac Toe with Alith](https://placehold.co/600x400/1e293b/38bdf8?text=Tic+Tac+Toe+vs+Alith)

## Features

* **Alith AI opponent**: An intelligent opponent powered by a hybrid engine using decision logic and the Grok LLM.
* **Contextual commentary**: Alith responds to player moves with short, dynamic comments generated via the Grok API.
* **Modern UI**: Clean glassmorphism-inspired design with smooth animations and a dark theme.
* **Difficulty levels**:

  * **Easy**: Random valid moves for casual play.
  * **Medium**: Balanced gameplay with basic strategy.
  * **Alith AI (Hard)**: Unbeatable opponent with optimal decision-making and LLM-driven personality.

## Tech Stack

* **Frontend**: React, TypeScript, Vite
* **Styling**: Vanilla CSS (CSS variables and animations)
* **AI Integration**: Alith library with xAI Grok API

## Getting Started

1. **Clone the repository**

   ```bash
   git clone https://github.com/DannySteffe/tic-tac-toe-with-Alith.git
   cd tic-tac-toe-with-Alith
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure API key**
   Create a `.env` file in the root directory and add your Grok API key:

   ```env
   VITE_GROK_API_KEY=your_xai_api_key_here
   ```

4. **Run the application**

   ```bash
   npm run dev
   ```

Built by [DannySteffe](https://github.com/DannySteffe)

