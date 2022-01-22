import { Pipe, PipeTransform } from '@angular/core';
import { Userprofile } from "../modal/Userprofile";

@Pipe({
  name: 'userFilter'
})
export class UserFilterPipe implements PipeTransform {
  transform(user: Userprofile[], searchKey: string): any {
    if (!!searchKey) {
      return user.filter(x => {
        let searchText =  x.username + ' '+ x.country+ ' '+ x.description;
        if ( searchText.toLowerCase().search(searchKey.toLowerCase()) != -1 ) {
          return true;
        }
      }
      );
    } else {
      return user;
    }

  }

}

