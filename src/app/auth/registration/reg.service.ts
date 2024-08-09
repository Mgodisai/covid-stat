import { Injectable } from '@angular/core';
import { UserRepository } from '../user.repository';
import { of } from 'rxjs/internal/observable/of';
import { tap } from 'rxjs/internal/operators/tap';
import { Observable } from 'rxjs/internal/Observable';
import { throwError } from 'rxjs/internal/observable/throwError';

@Injectable({
   providedIn: 'root',
})
export class RegService {
   constructor(private readonly userRepository: UserRepository) {}

   register(
      username: string,
      password: string,
      email?: string
   ): Observable<boolean> {
      const isExistingUser = this.userRepository.getUser(username);

      if (isExistingUser) {
         console.log('User already exists with name: ', username);
         return throwError(
            () => new Error(`User already exists with username: ${username}`)
         );
      }

      const registrationResult = this.userRepository.addUser({
         username,
         password,
         email,
      });
      if (registrationResult) {
         return of(true);
      } else {
         return of(false);
      }
   }
}
