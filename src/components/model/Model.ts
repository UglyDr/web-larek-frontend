import { IEvents } from "../base/events";

export abstract class Model {
  constructor(protected events: IEvents) {

    this.events = events;
  }

  emitChanges(event: string, payload?: object) {
    this.events.emit(event, payload ?? {});
  }

 
}