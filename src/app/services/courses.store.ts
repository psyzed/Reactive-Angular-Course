import { Injectable, inject } from "@angular/core";
import { BehaviorSubject, Observable, throwError } from "rxjs";
import { Course, sortCoursesBySeqNo } from "../model/course";
import { catchError, map, shareReplay, tap } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";
import { LoadingService } from "../loading/loading.service";
import { MessagesService } from "../messages/messages.service";

@Injectable({ providedIn: "root" })
export class CoursesStore {
  private httpClient = inject(HttpClient);
  private loadingService = inject(LoadingService);
  private messageService = inject(MessagesService);

  private coursesSubject = new BehaviorSubject<Course[]>([]);

  public courses$: Observable<Course[]> = this.coursesSubject.asObservable();

  constructor() {
    this.loadAllCourses();
  }

  filterByCategory(category: string): Observable<Course[]> {
    return this.courses$.pipe(
      map((courses) =>
        courses
          .filter((course) => course.category == category)
          .sort(sortCoursesBySeqNo)
      )
    );
  }

  saveCourse(courseId: string, changes: Partial<Course>): Observable<Course> {
    const courses = this.coursesSubject.getValue();
    const courseIndex = courses.findIndex((course) => course.id == courseId);

    const newCourse: Course = {
      ...courses[courseIndex],
      ...changes,
    };

    const newCourses: Course[] = courses.slice(0);
    newCourses[courseIndex] = newCourse;

    this.coursesSubject.next(newCourses);

    return this.httpClient
      .put<Course>("/api/courses/" + courseId, changes)
      .pipe(
        catchError((err) => {
          const message = "Could not save course";
          this.messageService.showError(message);
          console.log(err);
          return throwError(err);
        }),
        shareReplay()
      );
  }

  private loadAllCourses(): void {
    const loadCourses$ = this.httpClient.get<Course[]>("/api/courses").pipe(
      map((res) => res["payload"]),
      catchError((err) => {
        const message = "Could not load courses";
        this.messageService.showError(message);
        console.log(err);
        return throwError(err);
      }),
      tap((courses) => this.coursesSubject.next(courses))
    );

    this.loadingService.showLoaderUntilCompleted(loadCourses$).subscribe();
  }
}
