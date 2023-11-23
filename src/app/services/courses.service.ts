import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable } from "rxjs";
import { Course } from "../model/course";
import { map, shareReplay } from "rxjs/operators";
import { Lesson } from "../model/lesson";

@Injectable({ providedIn: "root" })
export class CoursesService {
  private httpClient = inject(HttpClient);

  loadAllCourses(): Observable<Course[]> {
    return this.httpClient.get<Course[]>("/api/courses").pipe(
      map((res) => res["payload"]),
      shareReplay()
    );
  }

  loadCourseById(id: number): Observable<Course> {
    return this.httpClient
      .get<Course>("/api/courses/" + id)
      .pipe(shareReplay());
  }

  loadAllCourseLessons(id: number): Observable<Lesson[]> {
    return this.httpClient
      .get<Lesson[]>("/api/lessons/", {
        params: {
          courseId: id,
          pageSize: "1000",
        },
      })
      .pipe(
        map((res) => res["payload"]),
        shareReplay()
      );
  }

  saveCourse(courseId: string, changes: Partial<Course>): Observable<Course> {
    return this.httpClient
      .put<Course>("/api/courses/" + courseId, changes)
      .pipe(shareReplay());
  }

  searchLessons(searchTerm: string): Observable<Lesson[]> {
    return this.httpClient
      .get<Lesson[]>("/api/lessons", {
        params: {
          filter: searchTerm,
          pageSize: "100",
        },
      })
      .pipe(
        map((res) => res["payload"]),
        shareReplay()
      );
  }
}
