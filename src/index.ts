import Game from "./classes/Game";

const canvas = document.querySelector("canvas")!;

const qntGravityElement = document.querySelector(".gravity--quantity") as HTMLSpanElement;
const gravityPerSecondElement = document.querySelector(".gravity-per-second") as HTMLSpanElement;

const containerButtons = document.querySelector(".container-buttons") as HTMLElement;
const mainButton = document.querySelector(".button--click");

const setupCanvas = () => {
  const aside = document.querySelector("aside")!;

  canvas.width = innerWidth - aside.clientWidth - 100;
  canvas.height = innerHeight;
};

setupCanvas();

const game = new Game(canvas, qntGravityElement, containerButtons, gravityPerSecondElement);

const audio = new Audio("src/assets/audios/pop.mp3");

mainButton?.addEventListener("mousedown", () => {
  game.incrementGravity(1);

  audio.currentTime = 0;
  audio.play();
});
