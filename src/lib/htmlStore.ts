import { writable } from "svelte/store";


const defaultHtml = `
<html>
<head>
  <title>Welcome to LLM 💘 HTML Project!</title>
  <style>
    body {
      font-family: "Arial", sans-serif;
      background-color: #e6f7ff;
      text-align: center;
      color: #003366;
    }
    h1 {
      color: #ff69b4;
      font-size: 42px;
      text-shadow: 2px 2px #f5aebb;
    }
    .blink {
      animation: blink-animation 1s steps(5, start) infinite;
      -webkit-animation: blink-animation 1s steps(5, start) infinite;
    }
    a:link {
      color: #0066ff;
    }
    a:visited {
      color: #993366;
    }
    a:hover {
      font-weight: bold;
      font-size: 18px;
      transition: all 0.3s ease-in-out;
      color: #009900;
      text-decoration: underline;
    }
    @keyframes blink-animation {
      to {
        visibility: hidden;
      }
    }
    .container {
      border: 2px solid #00bfff;
      margin: 20px;
      padding: 20px;
      background-color: #f0f8ff;
    }
    .marquee {
      width: 100%;
      background-color: #ccffcc;
      color: #003333;
      white-space: nowrap;
      overflow: hidden;
      position: relative;
    }
    .marquee div {
      display: inline-block;
      padding-left: 100%;
      animation: marquee 10s linear infinite;
    }
    @keyframes marquee {
      0% {
        transform: translate(0, 0);
      }
      100% {
        transform: translate(-100%, 0);
      }
    }
  </style>
</head>
<body>
  <div class="marquee"><div>Welcome to the LLM 💘 HTML Project - Creating Magic with Code!</div></div>
  <h1>LLM 💘 HTML: 90s Edition</h1>
  <div class="container">
    <p><strong class="blink">Explore the Possibilities!</strong></p>
    <p>This project is all about harnessing the power of language models to edit HTML pages in ways never seen before. Join us on this exciting journey!</p>
    <a href="#">Discover our Blog!</a><br>
    <a href="#">Learn about the Technology!</a>
  </div>
</body>
</html>
`;

const htmlStore = writable(defaultHtml);

export default htmlStore;