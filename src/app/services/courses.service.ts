import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable } from "rxjs";
import { Course } from "../model/course";
import { map, shareReplay } from "rxjs/operators";

@Injectable({ providedIn: "root" })
export class CoursesService {
  private httpClient = inject(HttpClient);

  loadAllCourses(): Observable<Course[]> {
    return this.httpClient.get<Course[]>("/api/courses").pipe(
      map((res) => res["payload"]),
      shareReplay()
    );
  }

  saveCourse(courseId: string, changes: Partial<Course>): Observable<Course> {
    return this.httpClient
      .put<Course>("/api/courses/" + courseId, changes)
      .pipe(shareReplay());
  }
}
