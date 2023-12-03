import Game from "./classes/Game";

const audio = new Audio("src/assets/audios/pop.mp3");
const canvas = document.querySelector("canvas")!;

const qntGravityElement = document.querySelector(".gravity--quantity") as HTMLSpanElement;
const gravityPerSecondElement = document.querySelector(".gravity-per-second") as HTMLSpanElement;
const containerButtons = document.querySelector(".container-buttons") as HTMLElement;
const mainButton = document.querySelector(".button--click");
const saveButton = document.querySelector(".button--save");

const setupCanvas = () => {
  const aside = document.querySelector("aside")!;

  canvas.width = innerWidth - aside.clientWidth - 100;
  canvas.height = innerHeight;
};

addEventListener("resize", setupCanvas);

setupCanvas();

const game = new Game(canvas, qntGravityElement, containerButtons, gravityPerSecondElement);

mainButton?.addEventListener("mousedown", () => {
  game.incrementGravity(1);
  audio.currentTime = 0;
  audio.play();
});

saveButton?.addEventListener("click", () => {
  game.save();
  alert("Sou progresso foi salvo.");
});
