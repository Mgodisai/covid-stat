import { Injectable } from '@angular/core';
import { UserRepository } from '../user.repository';

@Injectable({
   providedIn: 'root',
})
export class RegService {
   constructor(private readonly userRepository: UserRepository) {}

   register(username: string, password: string, email?: string): boolean {
      return this.userRepository.addUser({ username, password, email });
   }
}
