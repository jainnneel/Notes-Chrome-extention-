
window.firstOpen = false;

function fetchNotes(){

    document.querySelector('.pages_holder').innerHTML = '';
    chrome.runtime.sendMessage({command:"fetchAllNotes"},(response) => {
        var notes = response.data;
        console.log(notes)
        window.notes = [];
        var nav = '<ol class="list" >';
        for(const noteId in notes){
            nav+='<li data-noteId="'+noteId+'"><b>'+notes[noteId].title+'</b></li>'
            window.notes[noteId] = notes[noteId];     
        }
        nav += '</ol>';
        document.querySelector('.pages_holder').innerHTML = nav;
        listenClicks();
    });
   
}
fetchNotes()
function clearNotes(){
    var list = document.querySelectorAll('ol li');
    console.log(list)
    for(var i = 0; i < list.length ; i++){
        try {
            list[i].classList.remove('active');
        } catch (error) {
            console.log(error)
        }
    }
    document.querySelector('.holder h1').innerHTML = '';
    document.querySelector('.holder .post_body').innerHTML = '';
    document.querySelector('.holder h1').removeAttribute('data-noteid');
    document.querySelector('.deletepage').classList.add('hidden');

}

document.querySelector('.newnote').addEventListener('click',function(){
    clearNotes();
});
document.querySelector('.savepage').addEventListener('click',function(){
   
    var title = document.querySelector('.holder h1').innerHTML;
    var body = document.querySelector('.holder .post_body').innerHTML;
    var id = document.querySelector('.holder h1').dataset.noteid;
    console.log(id)
    savePage(id,title,body);
});

document.querySelector('.deletepage').addEventListener('click',function(){
   
    var id = false;

    try {
        id = document.querySelector('.holder h1').dataset.noteid;
        console.log(id)
    } catch (error) {
        console.log(error)
    }
    if(id==undefined){
        id = 'dsadas';   
    }
    if(id!=undefined){
        var confirm = window.confirm('Are you sure???');
        if(confirm){
            chrome.runtime.sendMessage({command:"deleteNote",data:{id:id,body:'',title:''}},(response)=>{
                fetchNotes();
                clearNotes();
            })
        }
    }
});

function changePage(noteId){
    console.log(noteId)
    const obj = window.notes[noteId];
    document.querySelector('.holder h1').innerHTML = obj.title;
    document.querySelector('.holder h1').dataset.noteid = noteId;
    document.querySelector('.holder .post_body').innerHTML = obj.body;
    var list = document.querySelectorAll('ol li');
    for(var i = 0; i < list.length ; i++){
        try {
            list[i].classList.remove('active');
        } catch (error) {
            console.log(error)
        }
    }
    localStorage.setItem('_notes_lastpage',noteId);
    document.querySelector('ol li[data-noteid="'+noteId+'"]').classList.add('active')
    document.querySelector('.deletepage').classList.remove('hidden');
}

function savePage(id,title,body){
    if(title=='' || body==''){
        alert("title or body empty")
    }else{
        if(id==undefined){
            id= 'GENAUTO';
        }else{
            console.log(id)
           window.notes[id].title = title;
           window.notes[id].body = body;
           document.querySelector('.pages_holder li[data-noteid="'+id+'"]').innerHTML= title;
        }
         chrome.runtime.sendMessage({command:"saveNote",data:{id:id,body:body,title:title}},(response)=>{
               try{
                 var obj = response;
                 console.log(response)
                 document.querySelector('.holder h1').dataset.noteid = obj.data; 
                 localStorage.setItem('_notes_lastpage',obj.id);
                 document.querySelector('.deletepage').classList.remove('hidden');
               }catch(e){
                console.log(e);
               }
            })
            fetchNotes();
    }
}

function listenClicks(){
    var list = document.querySelectorAll('.pages_holder ol li');
    for(var i= 0;i < list.length;i++){
        list[i].addEventListener('click',function(){
            console.log(this.dataset.noteid)
            changePage(this.dataset.noteid);
        })
    }
    console.log(list)
    if(window.firstOpen==false){
        window.firstOpen == true;
        try {
            var open = localStorage.getItem('_notes_lastpage');
            console.log(open)
            if(open!=null){
                document.querySelector('ol li[data-noteid="'+open+'"]').click();
            }
        } catch (e) {
            console.log(e);
        }
    }
}




