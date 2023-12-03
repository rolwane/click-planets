import TPlanet from "../types/TPlanet";

class Planet {
  private image: HTMLImageElement;
  private positionX: number;
  private positionY: number;

  readonly name: string;
  readonly gravityPerSecond: number;
  private readonly orbit: number;
  private readonly velocity: number;

  size: number;
  angle: number;
  initialPositionX: number;
  initialPositionY: number;

  constructor(dataIn: TPlanet) {
    const {
      srcImage,
      positionX,
      positionY,
      size,
      orbit,
      velocity,
      angle,
      gravityPerSecond,
      name,
    } = dataIn;

    this.initImage(srcImage);

    this.positionX = positionX;
    this.positionY = positionY;

    this.initialPositionX = positionX;
    this.initialPositionY = positionY;

    this.size = size;
    this.orbit = orbit;
    this.velocity = velocity;
    this.angle = angle;

    this.name = name;
    this.gravityPerSecond = gravityPerSecond;
  }

  private initImage(srcImage: string): void {
    const img = new Image();
    img.src = srcImage;
    this.image = img;
  }

  draw(context: CanvasRenderingContext2D): void {
    context.drawImage(
      this.image,
      this.positionX,
      this.positionY,
      330 * this.size,
      330 * this.size
    );
  }

  update(): void {
    this.positionX = this.initialPositionX + this.orbit * Math.cos(this.angle);
    this.positionY = this.initialPositionY + this.orbit * Math.sin(this.angle);

    this.angle += this.velocity;
  }
}

export default Planet;
