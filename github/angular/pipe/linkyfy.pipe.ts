import { Pipe, PipeTransform } from '@angular/core';
import { Message } from '../modal/Message';

@Pipe({
  name: 'linkyfy'
})
export class LinkyfyPipe implements PipeTransform {

  transform(message:Message[], searchKey: string): any {
    if(!!message){
      let msg=[]
    message.forEach(e=> {
        e.content =  this.linkify(e.content);
         msg.push(e);
    });
    return msg;
  }else{
    return message;
  }
  }
  linkify(inputText) {
    //URLs starting with http://, https://, or ftp://
    var replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
    var replacedText = inputText.replace(replacePattern1, '<a href="$1" target="_blank">$1</a>');

    //URLs starting with www. (without // before it, or it'd re-link the ones done above)
    var replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
    var replacedText = replacedText.replace(replacePattern2, '$1<a href="http://$2" target="_blank">$2</a>');

    //Change email addresses to mailto:: links
    var replacePattern3 = /(\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,6})/gim;
    var replacedText = replacedText.replace(replacePattern3, '<a href="mailto:$1">$1</a>');

    return replacedText
  }
}
