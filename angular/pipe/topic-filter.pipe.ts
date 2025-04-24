import { Pipe, PipeTransform } from '@angular/core';
import { Topic } from "../modal/Topic";
@Pipe({
  name: 'topicFilter'
})
export class TopicFilterPipe implements PipeTransform {

  transform(topic: Topic[], searchKey: string): any {
    if (!!searchKey) {     
    return  topic.filter(x=>{
      if ( x.name.toLowerCase().search(searchKey.toLowerCase()) != -1 ) {
        return true;
      }
    });
    }else {
      return topic;

    }
  }

}
