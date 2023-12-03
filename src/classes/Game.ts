import planets from "../data/planets";
import TPlanet from "../types/TPlanet";
import Planet from "./Planet";

class Game {
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private qntGravityElement: HTMLSpanElement;
  private containerButtons: HTMLElement;
  private gravityPerSecondElement: HTMLSpanElement;
  private planets: Planet[] = [];

  private buyAudio: HTMLAudioElement;

  constructor(
    canvas: HTMLCanvasElement,
    qntGravityElement: HTMLSpanElement,
    containerButtons: HTMLElement,
    gravityPerSecondElement: HTMLSpanElement
  ) {
    this.canvas = canvas;
    this.context = canvas.getContext("2d")!;

    this.qntGravityElement = qntGravityElement;
    this.containerButtons = containerButtons;
    this.gravityPerSecondElement = gravityPerSecondElement;

    this.buyAudio = new Audio("src/assets/audios/buy.mp3");

    this.reloadGame();

    this.loadPlanetButtons(planets);
    this.initSun();

    this.gameLoop();

    setInterval(() => {
      this.incrementGravity(this.getTotalGravitiesPerSecond());
    }, 1000);

    addEventListener("resize", () => this.resize(this.planets));
  }

  private resize(planets: Planet[]) {
    planets.forEach((planet) => {
      planet.initialPositionX = this.canvas.width / 2 - (330 * planet.size) / 2;
      planet.initialPositionY = this.canvas.height / 2 - (330 * planet.size) / 2;
    });
  }

  private reloadGame() {
    const data = localStorage.getItem("game");

    if (data != null) {
      const { gravities, savedPlanets, planetsData } = JSON.parse(data);

      savedPlanets.forEach((planetData: TPlanet) => {
        const planet = new Planet(this.processPlanetData(planetData));
        this.planets.unshift(planet);
      });

      planetsData.forEach((planet: TPlanet, index: number) => {
        planets[index] = planet;
      });

      this.qntGravityElement.textContent = gravities;

      this.updatedGravitiesPerSecondElement();
    }
  }

  incrementGravity(amount: number) {
    this.qntGravityElement.innerHTML = `${this.getCurrentGravities() + amount}`;
    this.updateButtons(planets);
  }

  save() {
    const savedPlanets: TPlanet[] = [];

    this.planets.forEach((planet) => {
      const savedPlanet = planets.find((p) => p.name == planet.name);

      if (savedPlanet != undefined) {
        savedPlanets.push(savedPlanet);
      }
    });

    const data = {
      gravities: this.getCurrentGravities(),
      savedPlanets,
      planetsData: planets,
    };

    localStorage.setItem("game", JSON.stringify(data));
  }

  updateButtons(planets: TPlanet[]): void {
    const buttons = Array.from(this.containerButtons.children);

    buttons.forEach((button, index) => {
      button.toggleAttribute("disabled", planets[index].price > this.getCurrentGravities());
    });
  }

  private gameLoop = () => {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.drawOrbitLines();
    this.drawPlanets(this.planets);

    requestAnimationFrame(this.gameLoop);
  };

  private updatedGravitiesPerSecondElement() {
    const totalGravitiesPerSecond = this.getTotalGravitiesPerSecond();
    this.gravityPerSecondElement.textContent = `${totalGravitiesPerSecond.toString()} por seg`;
  }

  private getTotalGravitiesPerSecond(): number {
    return this.planets.reduce((gravities, planet) => {
      return gravities + planet.gravityPerSecond;
    }, 0);
  }

  private drawPlanets(planets: Planet[]) {
    planets.forEach((planet) => {
      planet.draw(this.context);
      planet.update();
    });
  }

  private drawOrbitLines() {
    const orbits = [75, 110, 150, 200, 260, 330, 400];

    this.context.strokeStyle = "#121212";
    this.context.lineWidth = 2;

    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;

    orbits.forEach((orbit) => {
      this.context.beginPath();
      this.context.arc(centerX, centerY, orbit, 0, Math.PI * 2);
      this.context.stroke();
    });
  }

  private initSun(): void {
    const sunData = {
      srcImage: "src/assets/images/sun.png",
      name: "Sol",
      price: 0,
      description: "",
      gravityPerSecond: 0,
      size: 0.3,
      orbit: 0,
      velocity: 0,
      angle: 0,
      positionX: 0,
      positionY: 0,
    };

    this.planets.push(new Planet(this.processPlanetData(sunData)));
  }

  private getCurrentGravities(): number {
    return parseInt(this.qntGravityElement.innerHTML);
  }

  private loadPlanetButtons(planets: TPlanet[]): void {
    this.containerButtons.innerHTML = "";

    const buttons = planets.map((button) => this.createPlanetButton(button));
    this.containerButtons.append(...buttons);
  }

  private createPlanet(dataIn: TPlanet): void {
    const planet = new Planet(this.processPlanetData(dataIn));

    this.planets.unshift(planet);

    this.playAudio(this.buyAudio);
    this.incrementGravity(-dataIn.price);
    this.updatePlanetPrice(dataIn);
    this.updateButtons(planets);
    this.updatedGravitiesPerSecondElement();
  }

  private removePlanet(event: MouseEvent, dataIn: TPlanet): void {
    event.preventDefault();
    const index = this.planets.findIndex((planet) => planet.name == dataIn.name);
    this.planets.splice(index, 1);
    this.updatedGravitiesPerSecondElement();
  }

  private playAudio(audio: HTMLAudioElement): void {
    audio.currentTime = 0;
    audio.play();
  }

  private updatePlanetPrice(dataIn: TPlanet) {
    const index = planets.findIndex((planet) => planet.name == dataIn.name);
    planets[index].price = Math.round(dataIn.price * 1.15);
    this.loadPlanetButtons(planets);
  }

  private createPlanetButton(dataIn: TPlanet): HTMLElement {
    const button = this.createHTMLElement("button", "button--planet");
    const image = this.createImageElement(dataIn.srcImage);
    const tooltip = this.createTooltip(dataIn);

    const tooltipMessage = `Disponível com ${dataIn.price.toLocaleString()} gravidades.`;
    const tooltipDisabled = this.createDisabledTooltip(tooltipMessage);

    button.append(image, tooltip, tooltipDisabled);

    button.setAttribute("disabled", "");

    button.addEventListener("click", () => this.createPlanet(dataIn));
    button.addEventListener("contextmenu", (e) => this.removePlanet(e, dataIn));

    return button;
  }

  private processPlanetData(dataIn: TPlanet): TPlanet {
    const positionX = this.canvas.width / 2 - (330 * dataIn.size) / 2;
    const positionY = this.canvas.height / 2 - (330 * dataIn.size) / 2;

    const lastPlanetAdded = this.planets.find((planet) => planet.name == dataIn.name);

    const angle = lastPlanetAdded ? lastPlanetAdded.angle + 10 : 0;

    return { ...dataIn, positionX, positionY, angle };
  }

  private createTooltip(dataIn: TPlanet): HTMLElement {
    const div = this.createHTMLElement("div", "tooltip");

    const name = this.createHTMLElement("span", "planet--name");
    const price = this.createHTMLElement("span", "planet--price");
    const description = this.createHTMLElement("span", "planet--description");

    name.textContent = dataIn.name;
    price.textContent = dataIn.price.toString();
    description.textContent = dataIn.description;

    div.append(name, price, description);

    return div;
  }

  private createDisabledTooltip(textContent: string): HTMLElement {
    const div = this.createHTMLElement("div", "tooltip--disabled");
    const span = this.createHTMLElement("span");

    span.textContent = textContent;

    div.appendChild(span);

    return div;
  }

  private createImageElement(src: string): HTMLImageElement {
    const image = new Image();
    image.src = src;
    return image;
  }

  private createHTMLElement(tag: string, className?: string): HTMLElement {
    const element = document.createElement(tag);

    if (className != undefined) {
      element.classList.add(className);
    }

    return element;
  }
}

export default Game;
