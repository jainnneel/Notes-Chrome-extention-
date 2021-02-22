
// alert("dsadsa neel jain")

const firebaseConfig = {
    apiKey: "XXXXXXXX",
    authDomain: "badget-7d2e5.firebaseapp.com",
    databaseURL: "XXXXXXXX",
    projectId: "badget-7d2e5",
    storageBucket: "badget-7d2e5.appspot.com",
    messagingSenderId: "388376641692",
    appId: "1:388376641692:web:e74eff1e379f24e43eed59"
  };

  firebase.initializeApp(firebaseConfig);
 
  console.log(firebase)
  
  chrome.runtime.onMessage.addListener((msg,sender,response) => {
      try {
          
          if(msg.command=="fetchAllNotes"){
                // console.log(msg)    
                 firebase.database().ref('/notes').once('value').then(function(res){
                    //  console.log(res.val())
                     response({type:"results",status:"success",data:res.val(),request:msg});
                 });
                 return true;
             }
        

            if(msg.command=="deleteNote"){
                // console.log(msg)
            var id = msg.data.id;
            if(id != ''){
                try {
                    var deleteNode = firebase.database().ref('/notes/'+id).remove();
                    response({type:"results",status:"success",data:id,request:msg})
                } catch (error) {
                    console.log(error);
                    response({type:"results",status:"failed",data:id,request:msg})
                }
            }else{
                    response({type:"results",status:"failed",data:id,request:msg})
            }
               return true;
            }

            if(msg.command=="saveNote"){
                // console.log(msg+'   '+'savenoteeeee')
                var title = msg.data.title;
                var body = msg.data.body;
                var id = msg.data.id;

                if(id != 'GENAUTO'){
                    var note = firebase.database().ref('notes/'+id).update({
                        title : title,
                        body : body,
                    })
                    response({type:"results",status:"success",data:id,request:msg})
                }else{
                    var newNoteKey = firebase.database().ref().child('notes').push().key;
                    var newNte =  firebase.database().ref('/notes/'+newNoteKey).set({
                        title : title,
                        body : body,
                    });
                    response({type:"results",status:"success",data:newNoteKey,request:msg})
                }
            //    return true;
            }
// return true;
} catch (error) {
    console.log(error)
}
} 
// return true;
  );
