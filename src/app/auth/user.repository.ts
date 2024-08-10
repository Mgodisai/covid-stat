import { Injectable } from '@angular/core';
import { StoredUser } from './models/storedUser.model';
import CryptoJS from 'crypto-js';
import { User } from './models/user.model';

@Injectable({
   providedIn: 'root',
})
export class UserRepository {
   private users: StoredUser[] = [];
   private nextId = 1;
   constructor() {
      console.log('UserRepository created');
      this.users = [
         {
            id: this.nextId++,
            username: 'admin',
            passwordHash: this.hashPassword('admin123'),
            email: 'admin@test.com',
         },
         {
            id: this.nextId++,
            username: 'user',
            passwordHash: this.hashPassword('user123'),
            email: 'user@test.com',
         },
      ];
   }

   getAllUsers(): StoredUser[] {
      return this.users;
   }

   getUser(username: string): StoredUser | undefined {
      return this.users.find((user) => user.username === username);
   }

   addUser(userToCreate: {
      username?: string;
      password?: string;
      email?: string;
   }): boolean {
      if (!userToCreate.username || !userToCreate.password) {
         return false;
      }
      if (this.getUser(userToCreate.username)) {
         return false;
      }
      const storedUser: StoredUser = {
         id: this.nextId++,
         username: userToCreate.username,
         passwordHash: this.hashPassword(userToCreate.password),
         email: userToCreate.email ?? 'no mail',
      };

      this.users.push(storedUser);
      return true;
   }

   validateUser(username: string, password: string): User | undefined {
      const user = this.getUser(username);
      const validationResult =
         user !== undefined &&
         user.passwordHash === this.hashPassword(password);
      if (validationResult) {
         return { id: user.id, username: user.username, email: user.email };
      }
      return undefined;
   }

   private hashPassword(password: string): string {
      return CryptoJS.SHA256(password).toString();
   }
}
