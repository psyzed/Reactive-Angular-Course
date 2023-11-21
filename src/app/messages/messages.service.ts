import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { filter } from "rxjs/operators";

@Injectable()
export class MessagesService {
  private errorSubject = new BehaviorSubject<string[]>([]);

  public errors$: Observable<string[]> = this.errorSubject
    .asObservable()
    .pipe(filter((messages) => messages && messages.length > 0));

  showError(...errors: string[]) {
    this.errorSubject.next(errors);
  }
}
