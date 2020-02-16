import {Injectable} from '@angular/core';
import {AngularFireDatabase, AngularFireList, AngularFireObject, QueryFn} from '@angular/fire/database';
import {FormInfo, randomUid} from './form';
import {take} from 'rxjs/operators';
import {Observable, Subscribable} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class FormApiService {
    _formPath = '/form';
    _entryPath = '/entry';
    forms: AngularFireList<FormInfo>;
    entries: AngularFireList<any>;

    constructor(private _db: AngularFireDatabase) {
        this.forms = this._db.list(this._formPath);
        this.entries = this._db.list(this._entryPath);
    }

    setForm(formInfo: FormInfo, formId: string = randomUid(10)) {
        console.log({formId: formId, formInfo: formInfo});
        return this.forms.set(formId, formInfo);
    }

    addEntry(formId: string, entry: any) {
        return this._db.list(`${this._entryPath}/${formId}/`).push(entry);
    }

    getForm(formId: string): AngularFireObject<FormInfo> {
        return this._db.object(`${this._formPath}/${formId}`);
    }

    getFormOnce(formId: string): Subscribable<FormInfo> {
        return this.getForm(formId).valueChanges().pipe(take(1));
    }

    getAllEntries(formId: string): Observable<any[]> {
        console.log(`${this._entryPath}/${formId}/`);
        this._db.object(`${this._entryPath}/${formId}/`).valueChanges().subscribe(value => {
            console.log(value);
        });
        return this._db.list(`${this._entryPath}/${formId}/`).valueChanges();
    }

}
