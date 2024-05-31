import {Component, Input, OnChanges, OnInit, Output, EventEmitter} from '@angular/core';
import {NgClass, NgForOf} from "@angular/common";

@Component({
    selector: 'app-pagination',
    standalone: true,
    imports: [
        NgClass,
        NgForOf
    ],
    templateUrl: './pagination.component.html',
    styleUrl: './pagination.component.css'
})
export class PaginationComponent implements OnInit, OnChanges {

    @Input() current_page: number = 1
    @Input() total_pages: number = 1
    @Output() paginatedData: EventEmitter<number> = new EventEmitter()

    pages: number[] = []

    ngOnInit() {
        this.updatePages()
    }

    ngOnChanges(): void {
        this.updatePages()
    }

    updatePages() {
        this.pages = []
        let start = Math.max(this.current_page - 2, 1)
        let end = Math.min(start + 2, this.total_pages)
        for (let i = start; i <= end; i++) {
            this.pages.push(i);
        }
    }

    changePage(value: string) {
        if (value == "prev") {
            this.current_page = Math.max(this.current_page - 1, 1)
        } else if (value == "next") {
            this.current_page = Math.min(this.current_page + 1, this.total_pages)
        } else {
            this.current_page = parseInt(value)
        }
        this.paginatedData.emit(this.current_page)
        this.updatePages()
    }

    protected readonly toString = toString;
}
