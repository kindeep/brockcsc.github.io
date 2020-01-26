
import {take} from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventDataService } from 'app/views/events/event-data.service';
import { Event, EventApiService } from 'app/shared/api';
import { DatePipe } from '@angular/common';


@Component({
    providers: [DatePipe],
    selector: 'csc-event',
    templateUrl: './event.component.html',
    styleUrls: ['./event.component.scss']
})
export class EventComponent implements OnInit {
    event: Event;
    error: string;
    loaded: boolean;
    id: string;

    constructor(private _eventDataService: EventDataService, private _eventApiService: EventApiService, private _route: ActivatedRoute) {
        this.loaded = false;
    }

    ngOnInit() {
        this._route.params.pipe(take(1)).subscribe(params => {
            this.id = params['id'];
            this.loadEvent();
        });
    }

    public getImageUrl(): string {
        const url = (path: string) => {
            return `url(${path})`;
        };
        if (this.event !== undefined && this.event.image !== undefined) {
            return url(this.event.image.url);
        }
        return url('/assets/placeholder.png'); // temp
    }

    private loadEvent(): void {
        if (this._eventDataService.hasEvent()) {
            this.loaded = true;
            this.event = this._eventDataService.getEvent();
        } else {
            this._eventApiService.getEventByKey(this.id).pipe(take(1)).subscribe(event => {
                this.loaded = true;
                if (event as any) {
                    this.event = event as Event;
                } else {
                    this.error = `Event doesn't exist.`;
                }
            });
        }
    }

}