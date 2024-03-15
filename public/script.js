inputel = document.querySelectorAll("input[type='checkbox']");

for(var i=0;i<inputel.length;i++){
    inputel[i].addEventListener("change", function(e){
        document.querySelector('div#'+e.target.id).classList.toggle("checked");
    
    });
}

