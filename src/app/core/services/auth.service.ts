import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { User } from '../models/user.model';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private readonly apiUrl = environment.apiUrl;

    private readonly currentUserKey = 'renthub_current_user';

    constructor(
        private http: HttpClient
    ) { }

    register(user: User): Observable<User> {
        return this.http.post<User>(
            `${this.apiUrl}/users`,
            user
        );
    }

    login(email: string): Observable<User[]> {
        return this.http.get<User[]>(
            `${this.apiUrl}/users?email=${email}`
        );
    }

    logout(): void {
        localStorage.removeItem(this.currentUserKey);
    }

    setCurrentUser(user: User): void {
        localStorage.setItem(
            this.currentUserKey,
            JSON.stringify(user)
        );
    }

    getCurrentUser(): User | null {
        const user = localStorage.getItem(this.currentUserKey);

        return user ? JSON.parse(user) : null;
    }

    isLoggedIn(): boolean {
        return !!this.getCurrentUser();
    }

    getUserName(): string {
        const user = this.getCurrentUser();
        return user?.name ?? '';
    }

}