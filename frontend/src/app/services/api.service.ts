// import { Injectable } from '@angular/core';
// import { HttpClient, HttpParams } from '@angular/common/http';
// import { Observable } from 'rxjs';

// @Injectable({
//   providedIn: 'root'
// })
// export class ApiService {
//   private apiUrl = 'http://localhost:5000/api';

//   constructor(private http: HttpClient) { }

//   // User API
//   getUsers(): Observable<any> {
//     return this.http.get(`${this.apiUrl}/users`);
//   }

//   getUser(id: string): Observable<any> {
//     return this.http.get(`${this.apiUrl}/users/${id}`);
//   }

//   addUser(data: any): Observable<any> {
//     return this.http.post(`${this.apiUrl}/users`, data);
//   }

//   deleteUser(id: string): Observable<any> {
//     return this.http.delete(`${this.apiUrl}/users/${id}`);
//   }

//   // Food APIs
//   getFoods(): Observable<any> {
//     return this.http.get(`${this.apiUrl}/foods`);
//   }

//   // Activity APIs
//   getActivities(): Observable<any> {
//     return this.http.get(`${this.apiUrl}/activities`);
//   }

//   //  Entry APIs
//   createOrUpdateEntry(data: any): Observable<any> {
//     return this.http.post(`${this.apiUrl}/entries`, data);
//   }

//   getEntryByDate(userId: string, date: string): Observable<any> {
//     const params = new HttpParams().set('date', date);
//     return this.http.get(`${this.apiUrl}/entries/${userId}`, { params });
//   }
//   getAllEntriesForUser(userId: string) {
//     return this.http.get<any[]>(`${this.apiUrl}/entries/user/${userId}`);
//   }

// }


import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:5000/api';

  constructor(private http: HttpClient) { }

  // User API
  getUsers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/users`);
  }

  getUser(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/${id}`);
  }

  addUser(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/users`, data);
  }

  deleteUser(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/users/${id}`);
  }

  // Food APIs
  // getFoods(): Observable<any> {
  //   return this.http.get(`${this.apiUrl}/foods`);
  // }
getFoods(search: string = ''): Observable<any> {
  const params = new HttpParams().set('search', search);
  return this.http.get(`${this.apiUrl}/foods`, { params });
}


  // Activity APIs
 getActivities(search: string = ''): Observable<any> {
  console.log(`Searching activities with term: ${search}`);
  
  const params = new HttpParams().set('search', search);
  return this.http.get(`${this.apiUrl}/activities`, { params });
}

  // Entry APIs
  createOrUpdateEntry(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/entries`, data);
  }

  getEntryByDate(userId: string, date: string): Observable<any> {
    const params = new HttpParams().set('date', date);
    return this.http.get(`${this.apiUrl}/entries/${userId}`, { params });
  }

  // ✅ Updated with 404 fallback
  getAllEntriesForUser(userId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/entries/user/${userId}`).pipe(
      catchError(err => {
        if (err.status === 404) {
          console.warn('⚠️ No entries found for this user, returning empty array.');
          return of([]);
        }
        return throwError(() => err);
      })
    );
  }
}
