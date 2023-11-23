import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { Lesson } from "../model/lesson";
import { Observable } from "rxjs";
import { CoursesService } from "../services/courses.service";

@Component({
  selector: "course",
  templateUrl: "./search-lessons.component.html",
  styleUrls: ["./search-lessons.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchLessonsComponent implements OnInit {
  public searchResults$: Observable<Lesson[]>;
  public activeLesson: Lesson;

  constructor(private coursesService: CoursesService) {}

  ngOnInit() {}

  onSearch(searchTerm: string): void {
    this.searchResults$ = this.coursesService.searchLessons(searchTerm);
  }

  openLesson(lesson: Lesson): void {
    this.activeLesson = lesson;
  }

  backToSearch(): void {
    this.activeLesson = null;
  }
}
