import { Injectable } from '@angular/core';
import { UserRepository } from '../user.repository';
import { of } from 'rxjs/internal/observable/of';
import { throwError } from 'rxjs/internal/observable/throwError';

@Injectable({
   providedIn: 'root',
})
export class RegService {
   constructor(private readonly userRepository: UserRepository) {}

   register(username: string, password: string, email?: string) {
      const isExistingUser = this.userRepository.getUser(username);

      if (isExistingUser) {
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
