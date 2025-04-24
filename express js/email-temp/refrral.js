module.exports =(data,sub,userData)=> {
   // console.log(userData)
   return '\
   <div style="border: 1px solid #c5c5c5; max-width: 484px;margin: 20px auto;  padding: 10px;">\
   <img style="width:80px;border-radius:5px;" src=" https://offersaroundus.com/assets/front-end/img/logo/email-logo.png" >\
   <p style="float: right;font-size: 12px;font-weight: bold;max-width: 250px;" >'+sub+'</p>\
   <hr style="border-bottom:1px solid #c5c5c5;width: 100%" >\
   <p style="font-size: 12px;margin-bottom: 7px;">Hi,</p>\
   <a style="color:blue" href="'+userData+'">'+userData+'</a> \
   <hr style="border-bottom:1px solid #c5c5c5;" >\
   <p style="font-size: 12px;" >'+data+'</p> \
   <br><p style="font-size: 12px;" >Cheers,</p>\
   <p style="font-size: 12px;" >Team Offers Around Us</p>\
   <p style="font-size: 12px;" > <a href=" https://offersaroundus.com/">www.offersaroundus.com </a></p>\
   </div>\
   ';
  }