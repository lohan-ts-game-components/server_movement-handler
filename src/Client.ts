///<reference lib="dom"/>

import { pack } from "msgpackr";
import { Utils } from "./Utils";

interface Direction {
  up: number;
  right: number;
  down: number;
  left: number;
  dt: number
}

export class Client {
  private _ws: WebSocket;
  private _id: String;
  private _x: number;
  private _y: number;
  private _speed: number;
  private _canvasHeight: number = 600;
  private _canvasWidth: number = 900;

  constructor(ws: WebSocket) {
    this._ws = ws;
    this._id = Utils.generateId();
    this._x = 30;
    this._y = 30;
    this._speed = 0.5;

    console.log("[->] Client connected");
    const msg = { info: "connected: " + this._id };
    this._ws.send(JSON.stringify(msg));
    this._ws.send(JSON.stringify({clientPosition:{x:this._x, y:this._y}}))
  }

  get x() {
    return this._x;
  }
  get y() {
    return this._y;
  }
  get canvasHeight() {
    return this._canvasHeight;
  }
  get canvasWidth() {
    return this._canvasWidth;
  }

  public move(direction: Direction) {
    /**
     * Translation
     */
    const distance = this._speed * direction.dt;
    const dx = -((direction.left - direction.right) * distance);
    const dy = -((direction.up - direction.down) * distance);

    const newX = this._x + dx;
    const newY = this._y + dy;
    if (newX > 0 && newX < this._canvasWidth) {
      this._x = newX;
    }
    if (newY > 0 && newY < this._canvasHeight) {
      this._y = newY;
    }
    this._ws.send(JSON.stringify({clientPosition:{x:this._x, y:this._y}}))
  }

  public disconnect() {
    this._ws.close();
    console.log("[<-] Client disconnected");
  }
}
