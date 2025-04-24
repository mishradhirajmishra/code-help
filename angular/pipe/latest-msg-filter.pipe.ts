import { Pipe, PipeTransform } from '@angular/core';
import { Latestmsg } from "../modal/Latestmsg";

@Pipe({
  name: 'latestMsgFilter'
})
export class LatestMsgFilterPipe implements PipeTransform {
  transform(user: Latestmsg[], searchKey: string): any {
    if (!!searchKey) {
      return user.filter(x => {
        let searchText =  x.name + ' '+ x.lastMsgId.content+ ' '+ x.lastMsgId.fromId.username;
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
